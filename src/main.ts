import { log } from 'apify';
import { Enrichment } from 'tomba';

import { InputError, queryInt, queryList, runActor } from './standby.js';
import type { RunOptions } from './tomba.js';
import { callTomba, getClient, normalizeDomain, runPool, unique } from './tomba.js';

interface ActorInput extends RunOptions {
    domains?: string[];
    maxResults?: number;
}

const SOURCE = 'tomba_company_enrichment';

await runActor<ActorInput>({
    title: 'Clearbit Company',
    count: (input) => Math.min(unique((input.domains ?? []).map(normalizeDomain)).length, input.maxResults ?? 50),
    fromQuery: (query) => ({
        domains: queryList(query, 'domain', 'domains'),
        maxResults: queryInt(query, 'maxResults'),
    }),
    run: async (input, { push, isDone, markDone, standby }) => {
        if (!input.domains?.length) throw new InputError('Input must contain at least one domain in "domains".');

        const maxResults = input.maxResults ?? 50;
        const enrichment = new Enrichment(getClient());

        // Each domain yields one item, so maxResults caps the number of domains processed.
        const domains = unique(input.domains.map(normalizeDomain)).slice(0, maxResults);
        const pending = domains.filter((domain) => !isDone(domain));
        if (pending.length < domains.length) {
            log.info(`Resuming: ${domains.length - pending.length} domains already processed.`);
        }
        if (!standby) log.info(`Enriching company data for ${pending.length} domains`);

        await runPool(pending, async (domain) => {
            const res = await callTomba('company', { domain }, async () => enrichment.company(domain));
            if (res.skipped) return;

            const data = res.data as Record<string, unknown> | null | undefined;
            const hasData = !res.error && typeof data === 'object' && data !== null && Object.keys(data).length > 0;

            if (hasData) {
                await push({
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
                await push({
                    domain,
                    source: SOURCE,
                    charged: res.charged,
                    cached: res.cached,
                    error,
                });
                log.info(`${domain}: ${error}`);
            }

            markDone(domain);
        });
    },
});
