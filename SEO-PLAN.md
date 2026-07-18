# Fleetcodes SEO execution plan

SEO cannot guarantee a permanent number-one position. The objective is to make every useful page easy to discover, technically eligible to index, clearly differentiated, and more helpful and authoritative than competing results.

## Current baseline (18 July 2026)

- 85 blog articles and 5 core URLs are included in the generated sitemap.
- Every route gets crawlable static HTML, a canonical URL, metadata, structured data, and internal links at build time.
- The public robots file allows crawling and advertises the sitemap.
- Google already surfaces the blog hub and multiple individual articles.
- The largest remaining risks are topic cannibalization, bulk publication patterns, overly long titles/descriptions, five legacy non-normalized slugs, several thin articles, and oversized images.

## P0: indexing control (week 1)

1. Verify both domain properties in Google Search Console and Bing Webmaster Tools.
2. Submit `https://www.fleetcodes.com/sitemap.xml` and inspect Coverage/Page Indexing daily for the first two weeks.
3. Export every `Crawled - currently not indexed`, `Discovered - currently not indexed`, duplicate canonical, soft-404, and blocked URL.
4. Map each excluded URL to one action: improve, consolidate/redirect, intentionally noindex, or keep and monitor.
5. Test representative URLs with URL Inspection and Rich Results Test after every release.

Success criteria: no sitemap URL returns a non-200 response; no accidental `noindex`; Google-selected canonical matches the declared canonical; valid BlogPosting and Breadcrumb structured data.

## P1: consolidate topic clusters (weeks 1-3)

Create one primary page per search intent. Merge overlapping articles and use permanent redirects from retired URLs. Start with:

- The three predictive-maintenance articles.
- The two real-time supply-chain visibility articles.
- The two EV fleet-management articles.
- AI fleet management versus AI dispatch articles.
- Manual operations versus fleet software articles.
- Last-mile delivery overview versus optimization articles.

Each cluster needs one pillar page, supporting articles targeting distinct questions, contextual two-way links, and non-overlapping titles/H1s. Do not mass-publish near-identical articles.

## P1: snippet and content quality (weeks 2-5)

- Add an explicit `seoTitle` and `metaDescription` field to each article during editorial review; keep titles near 50-60 characters and descriptions useful around 140-160 characters.
- Expand or consolidate articles under 600 words when they do not fully answer a distinct intent.
- Add original product screenshots, workflows, data, expert quotes, author bios, editorial policy, sources, and a visible last-reviewed date.
- Fact-check time-sensitive legal, tax, safety, pricing, and policy claims against primary sources before publishing.
- Remove unsupported superlatives and templated passages. Demonstrate first-hand experience with concrete examples and product evidence.

## P2: site architecture and commercial pages (weeks 3-8)

- Build indexable feature pages for dispatch automation, trip management, billing/POD, compliance, fleet analytics, GPS visibility, driver management, and integrations.
- Build pages for distinct audiences and use cases only when each has unique proof and content.
- Add topic hubs linking pillars, supporting guides, feature pages, case studies, and demo conversion pages.
- Add breadcrumbs in the visible UI and keep important pages within three clicks of the homepage.
- Publish case studies with measurable outcomes and customer approval.

## P2: performance and media (weeks 3-6)

- Convert oversized PNG/JPEG covers to responsive AVIF/WebP, with width/height, `srcset`, and lazy loading below the fold.
- Target passing field Core Web Vitals: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at the 75th percentile.
- Reduce the initial JavaScript bundle and validate mobile performance on real production URLs.

## P3: authority and distribution (ongoing)

- Earn relevant links through original logistics benchmarks, calculators, templates, compliance checklists, integrations, partnerships, and credible industry contributions.
- Maintain consistent organization profiles and author identities. Avoid paid link schemes, doorway pages, keyword stuffing, and scaled low-value content.
- Repurpose each strong article for LinkedIn/newsletters/industry communities, pointing to the canonical guide.

## Measurement cadence

Weekly: indexed sitemap URLs, valid/excluded reasons, crawl errors, impressions, clicks, CTR, average position, non-brand queries, leads, and Core Web Vitals.

Monthly: query-to-page cannibalization, content decay, referring domains, assisted conversions, and updates required for time-sensitive articles.

Prioritize outcomes by qualified organic demos and revenue, not raw indexed-page count or rankings alone.
