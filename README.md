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
