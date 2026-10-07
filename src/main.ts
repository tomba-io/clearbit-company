import { Actor, log } from 'apify';
import { Enrichment } from 'tomba';

import type { RunOptions } from './tomba.js';
import { callTomba, logSummary, normalizeDomain, runPool, setupTomba, unique, useRunState } from './tomba.js';

interface ActorInput extends RunOptions {
    domains: string[];
    maxResults?: number;
}

const SOURCE = 'tomba_company_enrichment';

await Actor.init();

const input = await Actor.getInput<ActorInput>();
if (!input?.domains?.length) {
    await Actor.fail('Input must contain at least one domain in "domains".');
}

const { domains: rawDomains, maxResults = 50, ...runOptions } = input!;
const client = await setupTomba(runOptions);
const enrichment = new Enrichment(client);
const state = await useRunState();

// Each domain yields one dataset item, so maxResults caps the number of domains processed.
const domains = unique(rawDomains.map(normalizeDomain)).slice(0, maxResults);
const pending = domains.filter((domain) => !state.done[domain]);
if (pending.length < domains.length) {
    log.info(`Resuming: ${domains.length - pending.length} domains already processed.`);
}

const startedAt = Date.now();
log.info(`Enriching company data for ${pending.length} domains`);

await runPool(pending, async (domain) => {
    const res = await callTomba('company', { domain }, async () => enrichment.company(domain));
    if (res.skipped) return;

    const data = res.data as Record<string, unknown> | null | undefined;
    const hasData = !res.error && typeof data === 'object' && data !== null && Object.keys(data).length > 0;

    if (hasData) {
        await Actor.pushData({
            ...data,
            domain,
            source: SOURCE,
            charged: res.charged,
            cached: res.cached,
        });
        log.info(
            `${domain}: found ${String(data.name ?? data.organization ?? 'Unknown Company')}${res.cached ? ' (cached)' : ''}`,
        );
    } else {
        const error = res.error ?? 'No data found';
        await Actor.pushData({
            domain,
            source: SOURCE,
            charged: res.charged,
            cached: res.cached,
            error,
        });
        log.info(`${domain}: ${error}`);
    }

    state.done[domain] = true;
});

logSummary('Clearbit Company', domains.length, startedAt);

await Actor.exit();
