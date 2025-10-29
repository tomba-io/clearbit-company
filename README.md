# Tomba Clearbit-Company Actor

[![Actor](https://img.shields.io/badge/Apify-Actor-blue)](https://apify.com/actors)
[![Tomba API](https://img.shields.io/badge/Tomba-API-green)](https://tomba.io)
[![Rate Limit](https://img.shields.io/badge/Rate%20Limit-150%2Fmin-orange)](https://tomba.io/api)

A powerful Apify Actor that enriches company information using the **Tomba Company API**. Perfect for sales teams, marketers, and researchers who need comprehensive company data for lead generation, market research, and business intelligence based on domain names.

## Key Features

- **Company Enrichment**: Get detailed company information from domain names
- **Comprehensive Data**: Organization details, location, contact info, and business intelligence
- **Industry Classification**: Company industries, SIC/NAICS codes, and business categories
- **Technology Stack**: Technologies and tools used by companies
- **Contact Information**: Phone numbers and email addresses from company websites
- **Rate Limited**: Respects Tomba's 150 requests per minute limit
- **Bulk Processing**: Process multiple domains efficiently
- **Error Handling**: Robust error handling with detailed logging

## How it works

The Actor leverages Tomba's powerful Company API to gather comprehensive business information:

### Process Flow

1. **Authentication**: Connects to Tomba API using your credentials
2. **Domain Processing**: Accepts array of domains to enrich
3. **Data Validation**: Processes and validates company information
4. **Rate Limiting**: Automatically handles 150 requests/minute limit
5. **Data Storage**: Saves results to Apify dataset

### What You Get

For each domain, you'll receive:

- **Company Details**: Name, legal name, description, founding year, size
- **Location Info**: Complete address, country, city, state, postal code
- **Contact Data**: Phone numbers and email addresses from website
- **Social Presence**: Twitter, Facebook, LinkedIn profiles
- **Business Intel**: Industries, revenue estimates, employee count
- **Technology Stack**: Tech stack and digital infrastructure
- **Domain Information**: WHOIS data and registration details

## Quick Start

### Prerequisites

1. **Tomba Account**: Sign up at [Tomba.io](https://app.tomba.io/api) to get your API credentials

### Getting Your API Keys

1. Visit [Tomba API Dashboard](https://app.tomba.io/api)
2. Copy your **API Key** (starts with `ta_`)
3. Copy your **Secret Key** (starts with `ts_`)

## Input Configuration

### Required Parameters

| Parameter        | Type     | Description                     |
| ---------------- | -------- | ------------------------------- |
| `tombaApiKey`    | `string` | Your Tomba API key (ta_xxxx)    |
| `tombaApiSecret` | `string` | Your Tomba secret key (ts_xxxx) |
| `domains`        | `array`  | Array of domains to enrich      |

### Optional Parameters

| Parameter    | Type     | Default | Description                         |
| ------------ | -------- | ------- | ----------------------------------- |
| `maxResults` | `number` | `50`    | Maximum number of results to return |

### Example Input

```json
{
    "tombaApiKey": "ta_xxxxxxxxxxxxxxxxxxxx",
    "tombaApiSecret": "ts_xxxxxxxxxxxxxxxxxxxx",
    "domains": ["tomba.io", "example.com", "google.com"],
    "maxResults": 100
}
```

### Best Practices

- **Domain Selection**: Use clean domain names without protocols (http/https)
- **Rate Limits**: The Actor automatically handles Tomba's 150 requests/minute limit
- **Batch Size**: Process 10-50 domains at a time for optimal performance

### Example Output

```json
{
    "name": "Tomba technology web service LLC",
    "legalName": "Tomba technology web service LLC",
    "domain": "tomba.io",
    "site": {
        "phoneNumbers": ["(850) 790-5575"],
        "emailAddresses": ["***@tomba.io", "***@tomba.io", "***@tomba.io", "**@tomba.io", "**@tomba.io", "**@tomba.io"]
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
    "facebook": {
        "handle": "tombaplatforum"
    },
    "linkedin": {
        "handle": "tomba-io"
    },
    "twitter": {
        "handle": "tombaplatforum"
    },
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
    "source": "tomba_company_enrichment"
}
```

### Data Structure Overview

The output contains comprehensive company information organized into logical sections:

#### Company Basics

- **Identity**: Company name, legal name, domain, description
- **Classification**: Industry tags, SIC codes, NAICS codes
- **Timeline**: Founded year, key milestones, data indexing timestamps

#### Location & Contact

- **Geographic Data**: Complete address, city, state, country, postal code
- **Contact Information**: Phone numbers and email addresses from website
- **Coordinates**: Latitude and longitude (when available)

#### Digital Presence

- **Social Media**: Twitter, Facebook, LinkedIn profiles and handles
- **Domain Info**: WHOIS data, registrar information, creation dates
- **Email Infrastructure**: Email provider and system details

#### Business Intelligence

- **Company Metrics**: Employee count, revenue estimates, traffic rankings
- **Company Type**: Business structure (privately held, public, etc.)
- **Market Position**: Industry standing and competitive indicators

#### Technology Stack

- **Technologies Used**: Complete list of technologies and tools
- **Tech Categories**: Organized technology classifications
- **Digital Infrastructure**: Web servers, frameworks, and development tools

### Key Benefits

- **Domain-Focused**: Perfect for company research based on website domains
- **Comprehensive Coverage**: 50+ data points per company enrichment
- **Real-time Data**: Fresh company information and business intelligence
- **Structured Output**: Consistent JSON format for easy integration
- **Technology Insights**: Detailed tech stack analysis for competitive research

## Use Cases

- **Lead Generation**: Enrich prospect companies with detailed business information
- **Market Research**: Analyze company profiles and industry trends
- **Sales Intelligence**: Get comprehensive company data for better targeting
- **Competitive Analysis**: Research competitors and market positioning
- **Data Enrichment**: Enhance existing company databases with fresh information
- **Technology Research**: Analyze technology adoption across companies
- **Domain Intelligence**: Get business context for domain names

## Resources & Documentation

### API Documentation

- [Tomba API Docs](https://tomba.io/api) - Complete API reference
- [Authentication Guide](https://app.tomba.io/api) - Get your API keys
- [Pricing & Limits](https://tomba.io/pricing) - Understand rate limits and costs

## FAQ

### General Questions

**Q: What is company enrichment?**
A: Company enrichment takes a domain name and returns comprehensive business information including company details, location, industry, employee count, revenue, technologies used, and social media profiles.

**Q: What kind of information can I get about companies?**
A: You get business basics (name, description, industry), location data, employee metrics, revenue estimates, technology stack, social media profiles, and contact information.

**Q: How accurate is the company data?**
A: Tomba maintains high-quality data with regular updates from multiple sources. Accuracy is typically 90%+ for established companies, though newer companies may have limited information.

### Usage & Features

**Q: Can I enrich any domain?**
A: You can enrich most business domains. Personal domains (gmail.com) or non-business websites may return limited information. The best results come from established company websites.

**Q: How many companies can I enrich at once?**
A: You can process up to 1000 domains per run. For optimal performance, process 20-50 domains per batch.

**Q: What if a company doesn't have much public information?**
A: Newer companies, private organizations, or companies with minimal web presence may return limited data. The service provides whatever information is publicly available.

**Q: Do you provide financial information?**
A: Yes, when available, including revenue estimates, funding information, employee count ranges, and company growth indicators.

### Technical Questions

**Q: What domain formats should I use?**
A: Use clean domain names like "stripe.com" or "example.org". Don't include protocols (http/https) or subdomains unless specifically needed.

**Q: What are the rate limits?**
A: The Actor automatically handles Tomba's rate limits for company enrichment. Large batches are processed with appropriate delays.

**Q: How should I handle missing data?**
A: Missing fields are normal, especially for newer or smaller companies. Check for null/empty values in your processing logic.

**Q: Can I get historical company data?**
A: The service provides current company information. For historical tracking, you'd need to run periodic enrichments and store the results over time.

### Business Applications

**Q: How can this help with lead qualification?**
A: Company size, industry, technology stack, and revenue data help qualify leads, prioritize prospects, and tailor sales approaches based on company characteristics.

**Q: Is this useful for market research?**
A: Absolutely! Aggregate company data across industries to understand market trends, competitive landscapes, and identify potential opportunities.

**Q: Can I use this for competitive analysis?**
A: Yes, enrich competitor domains to understand their technology choices, company size, market positioning, and business model indicators.

**Q: How does this help with account-based marketing?**
A: Detailed company profiles enable personalized marketing approaches, technology-specific messaging, and account segmentation based on company characteristics.

### Data & Privacy

**Q: Where does the company data come from?**
A: Data is sourced from publicly available information including company websites, business databases, SEC filings, social media, and other legitimate public sources.

**Q: Is this GDPR compliant?**
A: Yes, company enrichment uses only publicly available business information and complies with privacy regulations.

**Q: How often is company data updated?**
A: Tomba regularly updates its company database. Update frequency varies by company and data type, with larger companies typically having more frequent updates.

**Q: Can I enrich my customer database?**
A: Yes, enriching customer domains helps understand your customer base, identify upselling opportunities, and improve customer segmentation.

### Integration & Workflow

**Q: How can I integrate this with my CRM?**
A: The JSON output can be easily integrated with CRM systems to enrich company records, improve lead scoring, and enhance sales intelligence.

**Q: Should I combine this with other enrichment tools?**
A: Yes, combining company enrichment with person enrichment (Clearbit Person) provides comprehensive account intelligence for sales and marketing.

**Q: How do I handle large company databases?**
A: Process companies in batches, implement error handling for failed enrichments, and consider your API quota when planning large-scale enrichment projects.

**Q: Can I automate company enrichment?**
A: Yes, set up automated workflows to enrich new domains as they enter your systems, keeping your company database current and comprehensive.

## Keywords

Clearbit company, company enrichment, firmographic data, business intelligence, company profiles, corporate data, company information, business data enrichment, Clearbit API, company research, B2B data, enterprise data

## Support

If you need any help, have questions, or encounter any issues while using Tomba.io, please don't hesitate to reach out to our support team. You can contact us via:

- **Email**: support@tomba.io
- **Live chat**: Available on the Tomba.io website during business hours

## Contributing

We welcome contributions to improve this actor. Please feel free to submit issues, feature requests, or pull requests to help make this tool even better for the community.

## About Tomba

Founded in 2020, Tomba prides itself on being the most reliable, accurate, and in-depth source of email address data available anywhere. We process terabytes of data to produce our Email finder API.

![Tomba Logo](https://tomba.io/logo.png)
