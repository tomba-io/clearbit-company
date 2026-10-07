// End-to-end tests: run the Actor against a mock Tomba API.
import assert from 'node:assert/strict';
import { after, afterEach, describe, it } from 'node:test';

import type { MockHandler, MockServer } from './helpers.js';
import { removeStorage, runActor, startMockTomba, startStandbyActor, totalCharges } from './helpers.js';

function company(domain: string) {
    return {
        name: 'Stripe',
        legalName: 'Stripe, Inc.',
        domain,
        site: { phoneNumbers: ['+1 888-963-8955'], emailAddresses: ['support@stripe.com'] },
        category: { sicCode: '73', sic4Codes: ['7372'], naicsCode: '51', naics6Codes: ['511210'] },
        tags: ['payments', 'fintech', 'saas'],
        description: 'Financial infrastructure for the internet.',
        foundedYear: '2010',
        location: 'US',
        geo: {
            streetAddress: '354 Oyster Point Blvd',
            city: 'South San Francisco',
            postalCode: '94080',
            state: 'California',
            country: 'United States',
            countryCode: 'US',
        },
        linkedin: { handle: 'stripe' },
        twitter: { handle: 'stripe' },
        facebook: { handle: 'StripeHQ' },
        emailProvider: 'Google Workspace',
        type: 'privately held',
        metrics: { trafficRank: '312', employees: '5K-10K', annualRevenue: '$1B-$10B' },
        tech: ['React', 'Nginx'],
        techCategories: ['JavaScript Frameworks', 'Web Servers'],
    };
}

/** Default Tomba behaviour: known domains return a company, special domains return edge cases. */
const tomba: MockHandler = (req) => {
    assert.equal(req.method, 'GET');
    assert.equal(req.path, '/companies/find');
    const { domain } = req.query;
    if (domain === 'empty.com') return { body: { data: {} } };
    if (domain === 'null.com') return { body: { data: null } };
    if (domain === 'invalid.com') return { status: 422, body: { errors: { message: 'Invalid domain' } } };
    if (domain === 'html.com') return { raw: '<html>Bad gateway</html>' };
    return { body: { data: company(domain) } };
};

const servers: MockServer[] = [];
const dirs: string[] = [];

async function mock(handler: MockHandler = tomba): Promise<MockServer> {
    const server = await startMockTomba(handler);
    servers.push(server);
    return server;
}

async function run(...args: Parameters<typeof runActor>) {
    const result = await runActor(...args);
    dirs.push(result.storageDir);
    return result;
}

afterEach(async () => {
    await Promise.all(servers.splice(0).map(async (s) => s.close()));
});

after(async () => {
    await Promise.all(dirs.map(removeStorage));
});

describe('clearbit-company', () => {
    it('returns the company profile and charges one event per billable domain', async () => {
        const server = await mock();
        const result = await run({
            input: { domains: ['stripe.com', 'empty.com', 'null.com'] },
            endpoint: server.url,
        });

        assert.equal(result.code, 0, result.output);
        assert.equal(result.items.length, 3);

        const stripe = result.items.find((i) => i.domain === 'stripe.com');
        assert.deepEqual(stripe, {
            ...company('stripe.com'),
            domain: 'stripe.com',
            source: 'tomba_company_enrichment',
            charged: true,
            cached: false,
        });

        for (const domain of ['empty.com', 'null.com']) {
            const item = result.items.find((i) => i.domain === domain);
            assert.deepEqual(item, {
                domain,
                source: 'tomba_company_enrichment',
                charged: false,
                cached: false,
                error: 'No data found',
            });
        }

        assert.deepEqual(result.chargeCounts, { 'tomba-request': 1 });
    });

    it('sends the built-in credentials to Tomba', async () => {
        const server = await mock();
        await run({ input: { domains: ['stripe.com'] }, endpoint: server.url });
        assert.equal(server.requests[0].headers['x-tomba-key'], 'ta_test_key');
        assert.equal(server.requests[0].headers['x-tomba-secret'], 'ts_test_secret');
    });

    it('normalizes and deduplicates domains', async () => {
        const server = await mock();
        const result = await run({
            input: { domains: ['https://www.Stripe.com/pricing', 'stripe.com', ' STRIPE.COM ', 'http://tomba.io/'] },
            endpoint: server.url,
        });
        assert.deepEqual(server.requests.map((r) => r.query.domain).sort(), ['stripe.com', 'tomba.io']);
        assert.equal(result.items.length, 2);
        assert.equal(totalCharges(result), 2);
    });

    it('does not charge Tomba error statuses and does not retry them', async () => {
        const server = await mock();
        const result = await run({ input: { domains: ['invalid.com'] }, endpoint: server.url });
        assert.equal(result.code, 0, result.output);
        assert.equal(server.requests.length, 1);
        assert.equal(result.items[0].domain, 'invalid.com');
        assert.equal(result.items[0].charged, false);
        assert.match(String(result.items[0].error), /422: Invalid domain/);
        assert.equal(totalCharges(result), 0);
    });

    it('does not charge a non-JSON body', async () => {
        const server = await mock();
        const result = await run({ input: { domains: ['html.com'] }, endpoint: server.url });
        assert.equal(result.items[0].charged, false);
        assert.match(String(result.items[0].error), /Invalid response/);
        assert.equal(totalCharges(result), 0);
    });

    it('retries 429 and 5xx responses, then charges the success once', async () => {
        let calls = 0;
        const server = await mock(async (req) => {
            calls++;
            if (calls === 1)
                return {
                    status: 429,
                    body: { errors: { message: 'Too many requests' } },
                    headers: { 'retry-after': '1' },
                };
            if (calls === 2) return { status: 503, body: {} };
            return tomba(req);
        });
        const result = await run({ input: { domains: ['stripe.com'], maxRetries: 3 }, endpoint: server.url });
        assert.equal(server.requests.length, 3);
        assert.equal(result.items.length, 1);
        assert.equal(result.items[0].charged, true);
        assert.equal(result.items[0].name, 'Stripe');
        assert.deepEqual(result.chargeCounts, { 'tomba-request': 1 });
    });

    it('serves repeated runs from the cache for free', async () => {
        const server = await mock();
        const first = await run({ input: { domains: ['stripe.com'] }, endpoint: server.url });
        const second = await run({
            input: { domains: ['stripe.com'] },
            endpoint: server.url,
            storageDir: first.storageDir,
        });

        assert.equal(server.requests.length, 1);
        assert.equal(totalCharges(first), 1);
        assert.equal(second.items.length, 1);
        assert.equal(second.items[0].name, 'Stripe');
        assert.equal(second.items[0].cached, true);
        assert.equal(second.items[0].charged, false);
        assert.equal(totalCharges(second), 0);
    });

    it('calls Tomba again when the cache is disabled', async () => {
        const server = await mock();
        const first = await run({ input: { domains: ['stripe.com'], useCache: false }, endpoint: server.url });
        const second = await run({
            input: { domains: ['stripe.com'], useCache: false },
            endpoint: server.url,
            storageDir: first.storageDir,
        });
        assert.equal(server.requests.length, 2);
        assert.equal(second.items[0].cached, false);
        assert.equal(totalCharges(second), 1);
    });

    it('stops at the max charge limit and resumes without reprocessing', async () => {
        const server = await mock();
        const domains = ['a.com', 'b.com', 'c.com', 'd.com', 'e.com'];
        const input = { domains, maxConcurrency: 1, useCache: false, maxResults: 100 };

        // Locally every event costs $1, so a $2 budget allows two billable requests.
        const first = await run({ input, endpoint: server.url, maxTotalChargeUsd: 2 });
        assert.equal(first.code, 0, first.output);
        assert.equal(totalCharges(first), 2);
        assert.equal(server.requests.length, 2);
        assert.equal(first.items.length, 2);

        const second = await run({ input, endpoint: server.url, storageDir: first.storageDir, keepStorage: true });
        assert.equal(second.code, 0, second.output);
        assert.deepEqual(
            server.requests.map((r) => r.query.domain),
            domains,
        );
        // The default storages are kept, so the dataset and charging log cover both runs.
        assert.equal(second.items.length, 5);
        assert.equal(totalCharges(second), 5);
    });

    it('respects maxResults', async () => {
        const server = await mock();
        const result = await run({
            input: { domains: ['a.com', 'b.com', 'c.com'], maxResults: 2, maxConcurrency: 1 },
            endpoint: server.url,
        });
        assert.equal(result.items.length, 2);
        assert.equal(server.requests.length, 2);
    });

    it('runs requests in parallel', async () => {
        let active = 0;
        let peak = 0;
        const server = await mock(async (req) => {
            active++;
            peak = Math.max(peak, active);
            await new Promise((r) => {
                setTimeout(r, 100);
            });
            active--;
            return tomba(req);
        });
        const domains = Array.from({ length: 8 }, (_, i) => `site${i}.com`);
        await run({ input: { domains, maxConcurrency: 4 }, endpoint: server.url });
        assert.equal(server.requests.length, 8);
        assert.ok(peak > 1 && peak <= 4, `peak concurrency ${peak}`);
    });

    it('fails without Tomba credentials and never calls the API', async () => {
        const server = await mock();
        const result = await run({ input: { domains: ['stripe.com'] }, endpoint: server.url, withCredentials: false });
        assert.notEqual(result.code, 0);
        assert.match(result.output, /misconfigured/);
        assert.doesNotMatch(result.output, /ta_test_key|ts_test_secret/);
        assert.equal(server.requests.length, 0);
    });

    it('fails on empty input', async () => {
        const server = await mock();
        const result = await run({ input: { domains: [] }, endpoint: server.url });
        assert.notEqual(result.code, 0);
        assert.match(result.output, /at least one domain/);
        assert.equal(server.requests.length, 0);
    });

    it('fails when the domains field is missing', async () => {
        const server = await mock();
        const result = await run({ input: { emails: ['john@stripe.com'] }, endpoint: server.url });
        assert.notEqual(result.code, 0);
        assert.equal(server.requests.length, 0);
    });
});

describe('clearbit-company standby (real-time API)', () => {
    it('answers the readiness probe and a bare GET with usage info', async () => {
        const server = await mock();
        const actor = await startStandbyActor({ endpoint: server.url });
        try {
            const probe = await actor.call('/', { headers: { 'x-apify-container-server-readiness-probe': '1' } });
            assert.equal(probe.status, 200);
            const usage = await actor.call('/');
            assert.equal(usage.status, 200);
            assert.match(String(usage.body.usage), /GET/);
            assert.equal(server.requests.length, 0);
        } finally {
            await actor.stop();
        }
    });

    it('looks up domains from GET query parameters and charges per billable domain', async () => {
        const server = await mock();
        const actor = await startStandbyActor({ endpoint: server.url });
        let stopped;
        try {
            const res = await actor.call('/?domain=https://www.Stripe.com/about&domain=empty.com');
            assert.equal(res.status, 200);
            const items = res.body.items as Record<string, unknown>[];
            assert.equal(items.length, 2);
            assert.deepEqual(
                items.find((i) => i.domain === 'stripe.com'),
                {
                    ...company('stripe.com'),
                    domain: 'stripe.com',
                    source: 'tomba_company_enrichment',
                    charged: true,
                    cached: false,
                },
            );
            assert.equal(items.find((i) => i.domain === 'empty.com')?.error, 'No data found');
            assert.deepEqual(server.requests.map((r) => r.query.domain).sort(), ['empty.com', 'stripe.com'].sort());
        } finally {
            stopped = await actor.stop();
        }
        assert.deepEqual(stopped.chargeCounts, { 'tomba-request': 1 });
    });

    it('accepts a POST with the same JSON input as a normal run', async () => {
        const server = await mock();
        const actor = await startStandbyActor({ endpoint: server.url });
        try {
            const res = await actor.call('/', { body: { domains: ['a.com', 'b.com', 'c.com'], maxResults: 2 } });
            assert.equal(res.status, 200);
            assert.equal((res.body.items as unknown[]).length, 2);
            assert.equal(server.requests.length, 2);
        } finally {
            await actor.stop();
        }
    });

    it('serves repeated requests from the cache for free', async () => {
        const server = await mock();
        const actor = await startStandbyActor({ endpoint: server.url });
        let stopped;
        try {
            await actor.call('/?domain=stripe.com');
            const second = await actor.call('/?domains=stripe.com');
            assert.ok((second.body.items as Record<string, unknown>[]).every((i) => i.cached === true));
            assert.equal(server.requests.length, 1);
        } finally {
            stopped = await actor.stop();
        }
        assert.deepEqual(stopped.chargeCounts, { 'tomba-request': 1 });
    });

    it('keeps serving after a request hits maxResults', async () => {
        const server = await mock();
        const actor = await startStandbyActor({ endpoint: server.url });
        try {
            const first = await actor.call('/?domains=a.com,b.com&maxResults=1');
            assert.equal((first.body.items as unknown[]).length, 1);
            const second = await actor.call('/?domain=c.com');
            assert.equal((second.body.items as unknown[]).length, 1);
            assert.equal(server.requests.length, 2);
        } finally {
            await actor.stop();
        }
    });

    it('rejects invalid input with 400 and unknown paths with 404', async () => {
        const server = await mock();
        const actor = await startStandbyActor({ endpoint: server.url });
        try {
            const empty = await actor.call('/', { body: {} });
            assert.equal(empty.status, 400);
            assert.match(String(empty.body.error), /at least one domain/);
            assert.equal((await actor.call('/', { body: 'not json' })).status, 400);
            assert.equal((await actor.call('/?maxResults=abc&domain=a.com')).status, 400);
            assert.equal((await actor.call('/nope')).status, 404);
            assert.equal((await actor.call('/', { method: 'DELETE' })).status, 405);
            assert.equal(server.requests.length, 0);
        } finally {
            await actor.stop();
        }
    });

    it('returns 402 once the max charge limit is reached', async () => {
        const server = await mock();
        const actor = await startStandbyActor({ endpoint: server.url, maxTotalChargeUsd: 1 });
        try {
            const first = await actor.call('/?domain=a.com');
            assert.equal(first.status, 200);
            const second = await actor.call('/?domain=b.com');
            assert.equal(second.status, 402);
            assert.equal(server.requests.length, 1);
        } finally {
            await actor.stop();
        }
    });
});
