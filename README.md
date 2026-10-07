# Tomba Clearbit Company Enrichment

[![Price](https://img.shields.io/badge/Price-%243.12%20per%201K%20domains-brightgreen)](#pricing)
[![No signup](https://img.shields.io/badge/Tomba%20account-not%20needed-blue)](#quick-start)
[![No rate limit](https://img.shields.io/badge/Rate%20limit-none-brightgreen)](#built-for-big-lists)

**Turn a list of domains into full company profiles.** Paste your domains and get each company's name, description, industry codes, size, revenue range, address, social profiles, tech stack and more, ready to export to your CRM or spreadsheet.

No Tomba account. No API key. No subscription. **You pay $0.00312 per domain, and only when we find the company.**

## Why teams choose this Actor

- **Start in 30 seconds**: Open the Actor, paste your domains, click Start. Nothing to sign up for
- **Pay only for results**: Domains with no company data, errors and invalid inputs are free
- **$3.12 per 1,000 domains**: No monthly plan, no credits that expire, no minimum spend
- **One row per company**: Firmographics, location, social profiles and tech stack in a single record
- **Built for big lists**: No rate limit. Hundreds of domains run in parallel
- **Never pay twice**: Domains you looked up in the last 24 hours come back from cache for free
- **Clean input, clean output**: Paste URLs or domains in any format; duplicates are removed automatically
- **Export anywhere**: Download as CSV, Excel or JSON, or send results straight to your CRM with Apify integrations

## What you can do with it

| Goal                        | How company data helps                                                                |
| --------------------------- | ------------------------------------------------------------------------------------- |
| **Qualify leads**           | Filter accounts by size, revenue range, industry code or country before you reach out |
| **Enrich your CRM**         | Fill in missing company names, descriptions, addresses and social profiles            |
| **Build target lists**      | Turn a list of websites into a segmented account list for ABM campaigns               |
| **Personalize outreach**    | Mention what the company does, where it is based and which tools it runs              |
| **Route and score inbound** | Send sign-ups to the right team based on company size, industry and location          |
| **Research markets**        | Compare companies across an industry by size, age, revenue and technology             |

## Quick start

1. Click **Try for free**
2. Paste your domains into **Domains to Enrich** (for example `stripe.com`, `tomba.io`)
3. Click **Start**, then download your results as CSV, Excel or JSON

That's it. No Tomba account or API key is needed.

## Input

| Field            | Required | Default | Description                                                                  |
| ---------------- | -------- | ------- | ---------------------------------------------------------------------------- |
| `domains`        | Yes      |         | Domains to enrich. URLs like `https://www.stripe.com/pricing` are cleaned up |
| `maxResults`     | No       | `50`    | Maximum number of domains to enrich (up to 1,000)                            |
| `maxConcurrency` | No       | `10`    | How many domains to process at the same time (1–50)                          |
| `maxRetries`     | No       | `3`     | How many times to retry a temporary failure (0–10)                           |
| `useCache`       | No       | `true`  | Reuse results from your previous runs for free                               |
| `cacheTtlHours`  | No       | `24`    | How long cached results stay valid (`0` turns the cache off)                 |

```json
{
    "domains": ["tomba.io", "stripe.com", "https://www.shopify.com/"],
    "maxResults": 500
}
```

## Output

You get one row per domain:

```json
{
    "name": "Tomba technology web service LLC",
    "legalName": "Tomba technology web service LLC",
    "domain": "tomba.io",
    "site": {
        "phoneNumbers": ["(850) 790-5575"],
        "emailAddresses": ["***@tomba.io", "***@tomba.io"]
    },
    "category": {
        "sicCode": "73",
        "sic4Codes": ["7371", "5045", "7373", "7379"],
        "naicsCode": "81",
        "naics6Codes": ["541511", "423430", "541512"]
    },
    "tags": ["lead generation software"],
    "description": "the most powerful email-finding tool which is able to list all the email addresses of people who are working in a particular company.",
    "foundedYear": "2021",
    "location": "US",
    "geo": {
        "streetAddress": "1228 claymont",
        "city": "Claymont",
        "postalCode": "19703",
        "state": "Delaware",
        "country": "United States",
        "countryCode": "US"
    },
    "facebook": { "handle": "tombaplatforum" },
    "linkedin": { "handle": "tomba-io" },
    "twitter": { "handle": "tombaplatforum" },
    "whois": {
        "registrar_name": "namecheap, inc.",
        "created_date": "2020-07-07T20:54:07+02:00",
        "referral_url": "https://www.namecheap.com/"
    },
    "emailProvider": "Google Workspace",
    "type": "privately held",
    "metrics": {
        "trafficRank": "661495",
        "employees": "1-10",
        "annualRevenue": "$0-$1M",
        "estimatedAnnualRevenue": "$0-$1M"
    },
    "tech": ["webpack", "Vue.js", "React", "Nginx", "Express"],
    "techCategories": ["JavaScript Libraries", "JavaScript Frameworks", "Web Servers", "Web Frameworks"],
    "source": "tomba_company_enrichment",
    "charged": true,
    "cached": false
}
```

| Field                             | Description                                                      |
| --------------------------------- | ---------------------------------------------------------------- |
| `domain`                          | The domain you submitted (cleaned up)                            |
| `name`, `legalName`               | Company name and legal name                                      |
| `description`                     | What the company does                                            |
| `foundedYear`                     | Year the company was founded                                     |
| `type`                            | Company type, e.g. privately held or public                      |
| `tags`                            | Industry and topic tags                                          |
| `category`                        | Industry codes: SIC and NAICS                                    |
| `location`, `geo`                 | Country code and full address (street, city, state, postal code) |
| `site`                            | Phone numbers and email addresses published on the website       |
| `linkedin`, `twitter`, `facebook` | Company social profiles                                          |
| `metrics`                         | Employee range, revenue range and website traffic rank           |
| `tech`, `techCategories`          | Technologies detected on the website and their categories        |
| `emailProvider`                   | Email provider the company uses, e.g. Google Workspace           |
| `whois`                           | Domain registrar and registration date                           |
| `source`                          | Always `tomba_company_enrichment`                                |
| `charged`                         | `true` if this lookup was billed                                 |
| `cached`                          | `true` if this result came from the cache (free)                 |
| `error`                           | Why no company data was returned, if applicable                  |

Fields are filled when the information is publicly available, so smaller or newer companies may have fewer of them. Domains with no data still get a row with `domain`, `charged: false` and an `error`, so nothing silently disappears from your list.

## Pricing

**$0.00312 per domain ($3.12 per 1,000).** No subscription and no Tomba account needed.

You are only charged when Tomba returns a usable answer:

| What happens                                    | Charged |
| ----------------------------------------------- | ------- |
| Company data found for the domain               | Yes     |
| No company data found for the domain            | No      |
| Invalid domain or any other error               | No      |
| Temporary failure (it is retried automatically) | No      |
| Result served from the cache                    | No      |

Every row shows `charged` and `cached`, so you always know what you paid for. To cap your spend, set **Maximum cost per run** in the run options: the Actor stops cleanly when the limit is reached.

## Built for big lists

- **No rate limit**: up to 50 domains are processed at the same time
- **Automatic retries**: temporary failures are retried for you, and never billed
- **Resumable**: if a run is interrupted, it continues where it stopped without charging you again
- **Cache**: repeat lookups within 24 hours are free

## Integrations

Run it on a schedule, call it from the Apify API, or connect it to Zapier, Make, Google Sheets, HubSpot, Slack and hundreds of other apps with [Apify integrations](https://docs.apify.com/platform/integrations). Webhooks let you trigger your own workflow as soon as a run finishes.

## FAQ

**Do I need a Tomba account or API key?**
No. Everything is built in. You only pay the per-domain price on Apify.

**How much does it cost?**
$0.00312 per domain with results ($3.12 per 1,000). Domains with no results, errors and cached lookups are free.

**How many domains can I enrich in one run?**
Up to 1,000 per run, processed in parallel. There is no rate limit.

**What domain format should I use?**
Anything works: `stripe.com`, `www.stripe.com` or `https://stripe.com/pricing`. We clean it up and remove duplicates.

**Why are some fields empty?**
We only return what is publicly known about the company. Large, established companies usually have the most complete profiles; new or very small companies may have fewer fields.

**Can I enrich free email domains like gmail.com?**
Use company websites instead. Free email providers and personal sites don't describe a business, so they rarely return useful data, and you aren't charged when nothing is found.

**I have email addresses, not domains. What should I use?**
Try the Tomba Clearbit Combined Actor: it takes an email address and returns both the person and their company.

**What if my run is interrupted?**
It picks up where it stopped. Domains already processed are not charged again.

**How do I limit what I spend?**
Set **Maximum cost per run** before you start. The Actor stops as soon as the limit is reached.

## Support

Questions or feedback? We're happy to help:

- **Email**: support@tomba.io
- **Live chat**: on [tomba.io](https://tomba.io) during business hours
- **Issues**: use the **Issues** tab on this Actor's page

## About Tomba

Founded in 2020, [Tomba](https://tomba.io) is a B2B data platform for finding, verifying and enriching business contacts. Our Email Finder, Domain Search and Email Verifier help sales and marketing teams reach the right people.

![Tomba Logo](https://tomba.io/logo.png)
