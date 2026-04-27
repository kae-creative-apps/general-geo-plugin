# GEO/AEO Best Practices Reference

This reference is loaded by geo plugin skills when auditing pages, generating briefs, or advising on fixes. It covers both traditional AEO (featured snippets, voice, PAA) and GEO (AI engine citation optimization).

---

## 1. Content Structure for AI Citation

### The 120-180 Word Passage Rule
AI engines extract passages, not full pages. Every section should be a self-contained passage of 120-180 words:
- **Opening 40-60 words:** Direct answer — self-contained, citable as a standalone sentence
- **Body 80-120 words:** Evidence, statistics, examples supporting the answer
- **Optional:** A comparison table (10-20x higher citation rate than prose)

This structure allows AI systems to extract meaningful, verifiable content without requiring readers to consume the full article. The opening window is critical: AI systems prioritize the first claim in a section when selecting citation passages. A passage that can stand alone and be quoted directly will be cited more frequently than content that requires surrounding context to make sense.

Comparison tables dramatically outperform prose passages in citation frequency. A side-by-side comparison of competitor pricing, feature sets, or methodologies will be cited by AI systems at 10-20x the rate of the same information buried in paragraphs. If your content makes a comparison argument, table format is non-negotiable for AI visibility.

### Inverted Pyramid
Lead every page and every section with the direct answer. Elaboration follows.

**Wrong approach:** "There are many factors that affect this topic, including A, B, C, and D, which we'll explore below..."

**Right approach:** "The median [key metric] is [value], according to [Brand]'s [Year] data from [N] [sources]."

The inverted pyramid model ensures that AI crawlers extract the core claim before any hedging language, qualifications, or elaboration. Many content writers bury the answer in the middle of a section after extensive context-setting. AI systems will prioritize the first substantive claim, so if that claim is a qualifier rather than the main finding, you lose citation potential.

This principle applies at every level: the page level, the section level, and even within individual paragraphs. The first sentence should contain the most important information. The next sentences should provide evidence. Background and nuance come last. This ordering is the opposite of traditional journalistic storytelling but directly optimizes for AI extraction.

### Featured Snippet Formats
Three core formats dominate featured snippet and AI Overview inclusion:

**Definition box:** H2 = "What is [Term]?" → 1-2 sentence answer immediately following (40-60 words max)
- Used when answering definitional questions
- AI systems recognize this pattern and prioritize it for inclusion
- The answer must be semantically complete within 40-60 words

**List snippet:** H2 framing a "how" or "steps" question → numbered/bulleted list of 5-8 items
- Use for process-oriented questions: "How to," "Steps to," "Ways to"
- Keep list items concise (one sentence each)
- The list itself should be the first element after the H2, not preceded by explanatory prose

**Table snippet:** Comparison table with clear row/column headers, plain HTML (not JS-rendered)
- Use for comparisons, feature matrices, or structured data
- Must use semantic HTML `<table>` tags, not CSS grid
- Headers must be in `<thead>` and `<th>` elements
- Tables render 10-20x more frequently in AI outputs than prose equivalents

---

## 2. Entity Disambiguation

### Entity Salience
AI systems distinguish between pages that *mention* an entity and pages that are *about* it. This distinction determines whether your page will be surfaced as an authoritative source or merely as a passing reference.

For a page to be treated as authoritative about a brand or topic, follow this checklist:
- Entity name appears in the `<title>` tag
- Entity name in H1 tag
- Entity name in the first 50 words of page body text
- Entity name in the URL slug (not just subdirectory)
- Entity name in meta description
- Internal links pointing to this page use the entity name as anchor text (not "click here" or "learn more")

A page that mentions your brand five times but never in the title, H1, or first paragraph will be treated as covering a tangential topic, not as an authoritative brand resource. Conversely, a page with the brand name in the title and H1 will trigger entity-focused ranking signals regardless of mention frequency elsewhere.

The first 50 words are critical. AI systems use this section to determine the page's primary topic. If your brand isn't mentioned in the opening, the system may classify the page as being about the topic (e.g., "salary data") rather than your brand's authority on the topic.

### SameAs — Mandatory, Not Optional
Every Organization schema must include a `sameAs` array. Treat it as required infrastructure, not optional SEO.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Brand Name]",
  "url": "https://yourdomain.com",
  "sameAs": [
    "https://www.wikidata.org/wiki/Q[QNUMBER]",
    "https://en.wikipedia.org/wiki/[BrandSlug]",
    "https://www.linkedin.com/company/[slug]",
    "https://www.crunchbase.com/organization/[slug]"
  ],
  "logo": "https://yourdomain.com/logo.png",
  "description": "[One sentence describing the brand and its primary value]"
}
```

The `sameAs` array tells AI systems: "These are all the same entity." Without it, the system may treat each property as a separate entity, fragmenting your authority signal. This is particularly important for organizations with multiple properties or historical name changes.

If the brand has no Wikidata entry, creating one is the single highest-leverage technical action available. Wikidata feeds most AI training pipelines and serves as the reference backbone for entity resolution across AI systems.

### Wikidata QID Anchoring Checklist
Wikidata is the knowledge graph backbone that AI systems reference for entity verification. Establishing your organization here is foundational.

1. **Search:** Go to https://www.wikidata.org and search for the brand name
2. **Create if missing:** If no entry exists, create a new item with:
   - Instance of (P31): Organization (Q20023) or Company (Q891726)
   - Official name (P1448): Your brand name
   - Inception date (P571): Your founding date
   - Headquarters location (P159): Your primary office location
   - Official website (P856): Your domain URL
   - Notable founder (P112): Key founder names if applicable
3. **Copy the Q-number:** Note the identifier (e.g., Q12345678)
4. **Add to all Organization schema:** Add the Wikidata URL to `sameAs` in every Organization schema on your site
5. **Wikipedia integration:** If a Wikipedia article exists about your organization, add the Wikidata link in the article's references section

Wikidata entries act as an identity anchor. Without one, AI systems may conflate your organization with similarly-named entities or treat each domain property as a distinct entity.

---

## 3. Schema Markup

### Priority Schema Types
Schema markup tells AI systems what type of content exists on your page and how to interpret it. Different content types require different schema, and priority varies based on your citation goals.

| Content Type | Schema Type | Key Fields |
|---|---|---|
| Homepage / About | Organization | name, url, sameAs, logo, foundingDate, description |
| Research report | ScholarlyArticle | name, author, datePublished, dateModified, funder, abstract |
| Data or statistics page | Dataset | name, description, creator, datePublished, variableMeasured |
| How-to / guide | HowTo | name, step (HowToStep), totalTime |
| FAQ page | FAQPage | mainEntity (Question + acceptedAnswer) |
| Blog / article | Article | name, author, datePublished, dateModified, publisher |
| Comparison page | Table (within Article) | Plain HTML, not JS-rendered |

ScholarlyArticle is the most powerful schema for citation inclusion. It signals to AI systems that this is peer-reviewed or editorial content worthy of academic-style citation. Even if your content isn't formally peer-reviewed, ScholarlyArticle schema increases citation probability significantly.

Dataset schema is essential for any page containing original statistics or research findings. It allows you to declare variable names, methodology, and sample sizes in machine-readable format — information AI systems actively seek when evaluating citation reliability.

### Author Schema
Every article needs an author with verifiable credentials. AI systems use author credentials to assess source reliability.

```json
{
  "@type": "ScholarlyArticle",
  "name": "[Article Title]",
  "author": {
    "@type": "Person",
    "name": "[Author Full Name]",
    "jobTitle": "[Title]",
    "affiliation": {
      "@type": "Organization",
      "name": "[Brand Name]"
    },
    "sameAs": "https://orcid.org/0000-0001-2345-6789"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "publisher": {
    "@type": "Organization",
    "name": "[Brand Name]"
  }
}
```

Use ORCID identifiers for researchers — ORCID is the standard identifier for academic researchers. For other authors, LinkedIn URLs serve as author identity anchors.

The job title and affiliation are critical. They establish why this person is qualified to make the claims in the article. "Jane Smith, Research Director at [Brand]" is far more credible than "Jane Smith" alone.

### Content Freshness
- Update `dateModified` in schema every time content changes — not just the date shown on the page. AI systems check this field to assess whether content reflects current information.
- AI citation rates drop sharply for content older than 6 months on fast-moving topics. For benchmark data, market analysis, and statistics, establish a refresh cadence and stick to it.
- Add a "Last verified: [Month Year]" note to every data-heavy page. This statement signals that the information is current and has been manually reviewed recently.

For annual surveys or benchmarks, plan to refresh every 12 months. For fast-moving topic areas (tech compensation, inflation-adjusted data, market analysis), quarterly updates are expected by AI systems.

---

## 4. AI Crawler Accessibility

### robots.txt — Allow All AI Crawlers
AI systems require explicit allowance in robots.txt. Do not assume they'll be treated like Googlebot.

```
# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GoogleOther
Allow: /

# Search engines
User-agent: Googlebot
Allow: /

User-agent: *
Allow: /
```

Each AI system uses a distinct user agent. If you block one, that system cannot index your content. The most common oversight is a `User-agent: *` with `Disallow: /` followed by specific Allow rules. This will block GPTBot, ClaudeBot, and other AI crawlers not explicitly whitelisted.

For brands publishing original research, allowing AI crawlers is critical to citation success. These crawlers index content explicitly to support AI training and answer generation.

### llms.txt
Create `/llms.txt` at the site root. This file provides AI crawlers with a curated guide to your most important and citable resources.

```
# [Brand Name]

[One paragraph describing what the brand publishes, who it serves, and what makes
its data or expertise unique.]

## Key resources

https://yourdomain.com/research/[report-slug]: [Brief description of what this
resource contains, including sample size and date if applicable.]

https://yourdomain.com/reference/[topic]: [Brief description of this reference
resource and what data or information it contains.]

https://yourdomain.com/about/methodology: [Brief description of methodology
documentation.]

## About our data

[One paragraph explaining your data sources, methodology, and what makes your
content uniquely citable.]
```

The llms.txt file serves several purposes: it routes AI crawlers to your most authoritative pages, it demonstrates transparency about your data sources and methodology, and it signals which pages are "official" sources worthy of citation.

### Server-Side Rendering
AI crawlers have limited JavaScript execution capability. Most AI systems execute no JavaScript at all.

All key content pages must be server-rendered or statically generated. Pages requiring JavaScript execution to display content will not be indexed by AI crawlers reliably and will not be available for citation.

This means:
- Data tables rendered with React/Vue must be server-rendered or exported as static HTML
- Data visualizations must have static HTML equivalents, not JS-only
- Content lazy-loaded on scroll will not be indexed
- Dynamic calculators must have a static results page linked from the calculator

Verify crawlability by fetching your pages with `curl` and checking if critical content appears in the raw HTML. If content is missing from the `curl` output, it's rendered with JavaScript and invisible to AI crawlers.

### Paywalled Content: max-snippet
For gated content where you want AI citation without exposing the full resource:

```html
<meta name="robots" content="max-snippet:200">
```

This allows AI systems to see and cite a 200-word excerpt but not the full content. Pair this with a strong public summary at the top of the page:

```html
<div class="abstract">
  <h2>[Report Title] — Executive Summary</h2>
  <p>[200-word summary of key findings]</p>
</div>

<!-- Gated content begins here -->
<div class="premium-content">
  [Full report content]
</div>
```

This strategy allows you to share enough information for AI systems to cite your research while directing readers to your full resource.

---

## 5. Paywalled and Gated Content Strategy

### The Academic Abstract Model
Every gated piece should have a public "abstract page" — a standalone resource that's fully crawlable and independently citable.

The abstract page structure:
- **200-400 word executive summary:** What question was researched and what were the top findings?
- **Methodology section:** Sample size, survey dates, population definition, weighting methodology
- **Three top-line findings with numbers:** The most important findings with specific data points
- **Citation-ready reference block:** Formatted reference that can be copy-pasted into academic or journalistic citations
- **ScholarlyArticle schema with abstract field populated:** Tells AI systems this is research content
- **Fully crawlable with its own stable canonical URL:** Not a fragment or JavaScript modal
- **Link to gated content:** "Read the full report" link with clear CTA

The abstract page should be independently citable. A researcher should be able to find this page, understand the research, extract a statistic, and cite it — all without accessing gated content.

Example structure:
```
https://yourdomain.com/research/[report-slug] [GATED]
https://yourdomain.com/research/[report-slug]/abstract [PUBLIC, CITABLE]
```

The abstract URL should be linked from your navigation and from the gated report homepage. AI systems will cite the abstract page, not the gated page, allowing you to reach AI audiences while protecting your premium research.

### Gateway Content
A gateway page is different from a teaser. A teaser says "read more" without providing value. A gateway page must:

1. **Answer the primary question completely enough to be independently citable.** A researcher should be able to extract a statistic from this page and cite it as a standalone source, without accessing your gated content.
2. **Signal that deeper resources exist** with a clear link to gated content. Use language like "Explore our full methodology in the complete report."
3. **Use structured data** to show the relationship using `isPartOf` in the gated report schema, pointing back to the gateway.

Example: Your data page might answer the primary question completely (gateway content) while the full report provides detailed breakdowns (gated content).

### Named Statistics with Stable URLs
Give every significant statistic a permanent, stable URL that never changes.

Format:
- `[domain]/data/[year]-[topic]`
- Example: `yourdomain.com/data/2025-[metric-slug]`

**Never move these URLs.** Redirects reduce citation confidence. AI systems trust static URLs more than redirect chains. Once you publish a statistic with a URL, that URL must be permanent.

The stat page should include:
- The number (with units)
- The year/date it was measured
- The sample size or source population
- The methodology note explaining how it was derived
- A link to the full research if gated

Once a statistic has a permanent URL, it becomes reusable across your site. Other pages can link to it, journalists can cite it, and AI systems can reference it. This creates a distributed citation network.

---

## 6. Citation Trust Signals

### Original Data as Citation Magnet
The single highest-leverage tactic: publish a statistic that can only be found here.

This is far more powerful than optimizing existing content. Original data creates a citation pull — AI systems will actively seek it out because it's available nowhere else.

Forms of original data:
- **Annual surveys with published methodology:** "According to [Brand]'s [Year] survey of [N] [subjects]..."
- **Quarterly benchmarks with raw numbers:** "As of Q1 [Year], [Brand]'s database shows..."
- **Database-derived statistics with sample size and date:** "Among [N] [subjects] surveyed continuously, [metric] is..."

Format for maximum citation probability:
> "According to [Brand]'s [Year] [Survey Name] of [N] [subjects], [key metric] is [value]. ([Link to stat page])"

This format is citable because it includes: source, year, methodology (sample size), finding, and source URL. AI systems copy this format regularly.

Avoid: "Research shows..." or "Studies indicate..." These vague attribution formats are never cited and provide no authority to your brand.

### Institutional Backlinks
One link from a .edu or .gov domain citing your data outweighs hundreds of commercial backlinks for AI citation purposes.

Earn these through:
- **Publishing original research with clear, accessible methodology:** Academics cite resources that explain their methodology clearly. Publish a methodology page linked from every research piece.
- **Responding to journalist queries** via HARO or Qwoted with original data and attribution-ready statistics.
- **Sharing research findings directly with academics** in your domain. Send relevant research to university professors and industry researchers who may cite it in papers.
- **Contributing to academic databases:** If your data fits academic standards, it may be indexed in academic databases, multiplying citation reach.

Institutional backlinks signal to AI systems: "This source is trusted by educational and governmental institutions." This signal is stronger than any SEO metric.

### Wikipedia References
Being cited as a reference on a Wikipedia article is among the strongest available signals for AI citation probability.

Strategy:
1. **Publish verifiable original data** with a stable URL that meets Wikipedia's verifiability standard. Wikipedia requires sources to be "published," "reliable," and "attributable to someone connected to the article." Your original research meets these criteria if published on your own domain.
2. **Find the relevant Wikipedia article** for your domain topic
3. **Add your data as a citation** to an existing claim or support a new claim. Use proper citation formatting.
4. **Monitor the citation.** Wikipedia editors occasionally challenge new citations; be prepared to defend with additional evidence.

Wikipedia citations are powerful because: (a) Wikipedia is indexed heavily by all AI systems, (b) a Wikipedia reference acts as a third-party endorsement, and (c) Wikipedia's verifiability requirements force you to publish reliable, well-documented content.

---

## 7. AEO — Featured Snippets, PAA, Voice

### People Also Ask (PAA) Optimization
People Also Ask (PAA) boxes appear in Google search results and are indexed by AI systems. Appearing in these boxes increases your visibility to both search users and AI systems.

Optimization process:
- **Map every content piece to 3-5 PAA questions.** Use Google Search Console and SEMrush to research what questions appear for your topic. Search your topic in Google and note the PAA questions that appear.
- **Each PAA question becomes an H3 heading** with a direct answer (40-80 words) immediately following.
- **The H3 text should match the exact or near-exact PAA question phrasing.** If Google's PAA shows "What is [key question]?", use that exact phrasing in your H3.
- **Answer format:** Opening sentence = direct answer (what the statistic is or definition). Following sentences = evidence or elaboration.

Example:
```html
<h3>What is the average [key metric] in [context]?</h3>
<p>According to [Brand]'s [Year] survey of [N] [subjects], the median [metric] is [value]. This ranges from [low] in [context A] to [high] in [context B], with variation of ±[X]%.</p>
```

AI systems pull from both PAA sections and snippet-optimized content, so this optimization serves both traditional SEO and AI citation goals.

### Voice Search
Voice search results are read aloud — no bullets, no tables, no visual formatting. Optimization requires different structure than text search.

Voice-optimized content requirements:
- Answers must work as spoken sentences. Avoid formatting that only makes sense visually.
- 40-60 words maximum for voice-optimized answers. Longer answers will be cut off.
- Numeric answers ("$65,000") perform better than ranges ("$50,000-$80,000") because numbers are pronounceable and specific.
- Use conversational question phrasing in your headings: "What does [role] typically earn?" rather than "[Role] Compensation Overview."

Example:
```html
<h3>What does [role] typically earn?</h3>
<p>According to [Brand]'s [Year] data, the median [role] salary in [context] is [value] per year. This varies by [key factors].</p>
```

Voice search optimization is distinct from featured snippet optimization. Both are important, but they have different constraints.

### AI Overviews (Google SGE)
Google's AI Overviews (previously SGE) synthesize information from multiple sources into a single AI-generated summary. Appearing in AI Overviews drives traffic and establishes authority.

Factors that improve AI Overview inclusion probability:
- **Pages ranking in positions 1-5 are far more likely to appear in AI Overviews** than pages ranking lower. If your page doesn't rank in the top 5 for your target keywords, optimize for traditional ranking first.
- **Multi-perspective content is included more frequently than one-sided content.** AI systems prefer to show multiple viewpoints, acknowledge complexity, and present counterarguments.
- **Strong news backlinks from credible outlets improve inclusion probability.** When a major news outlet cites your data or research, AI systems weight that more heavily for inclusion in AI Overviews.

To improve AI Overview inclusion:
1. Rank in top 5 for your target queries
2. Provide comprehensive, multi-angle coverage
3. Pursue news coverage and journalist citations
4. Ensure content is fresh (updated within 6 months)

---

## 8. Misinformation Correction

### Detection
Run monthly probe queries across AI engines to monitor how your brand and key claims are being represented.

Probe queries to run:
- `"[Brand name] [key claim]"` — Are key facts being stated accurately?
- `"[domain topic] statistics"` — Who is being cited as the authority?
- `"[domain topic] research"` — Who appears as a credible source?

Run these queries in ChatGPT, Claude, Perplexity, and Google AI Overviews monthly. Document the results. If your brand is being misrepresented or not cited where it should be, you have a correction priority.

### Fast Facts Page
Every brand should have a `/brand-facts` or `/about/facts` page designed specifically for AI system reference.

Contents:
- Short, declarative statements of key facts (ideal citation format for AI)
- FAQPage schema pre-addressing the most common misconceptions
- All `sameAs` entries for every major directory
- Founded date, headquarters location, key personnel
- Stable permalink, linked prominently from homepage and footer

### Correction Playbook
When an AI system states a false fact about your brand:

1. **Publish a page that directly contradicts the false claim** with primary source evidence. Use the page title format: "[False claim] — Here's what's actually true"
2. **Ensure the page is indexed and linked** prominently from your navigation
3. **Update your Wikidata entry** with the correct information
4. **For Perplexity specifically:** Use the thumbs-down feedback on the specific answer to signal the error
5. **For scale correction:** Get the correction published on Wikipedia or in a major news outlet. These sources feed AI training and influence how other sources cite the fact.

The fastest path to correction at scale is third-party coverage. If you correct the misinformation on your own site, only users who find your page will see it. But if a major news outlet covers the correction, it spreads through AI systems and influences how others cite the fact.

---

## 9. Domain Authority Signals Specific to AI

Traditional SEO authority signals (PageRank, backlinks) influence AI citation probability but are not the primary drivers. These signals are specific to AI systems:

| Signal | How to Build It | Priority |
|---|---|---|
| Training corpus inclusion | Long publishing history (3+ years), consistent crawlability, widespread indexing across archives | High |
| Wikipedia citation | Add your data as a reference on relevant Wikipedia articles | Critical |
| Academic citation | Publish original data, share with researchers, contribute to academic databases | High |
| Semantic cluster authority | 3+ years of consistent publishing in one topic area with 100+ content pieces | High |
| Structured data adoption | Error-free JSON-LD across all pages (not just homepage), proper schema types for content | Medium |
| HTTPS + Core Web Vitals | SSL certificate, LCP <2.5s, CLS <0.1, FID <100ms | Medium |
| Original data recency | Data published within 6 months for fast-moving topics (benchmarks, market data) | High |

**Training corpus inclusion** is the foundation. AI models train on internet data from specific date ranges. Being indexed during those windows and maintaining that index is critical. This requires:
- Consistent site uptime (no extended downtime)
- No broad blocking of AI crawlers
- Long publishing history (new sites take 3+ years to build citation momentum)

**Wikipedia citation** is the single strongest signal because it creates a third-party reference that feeds into training data. One Wikipedia citation outweighs dozens of backlinks.

**Semantic cluster authority** means being the go-to source for a specific topic area. This requires exclusive, high-quality data and consistent publishing in one domain.

**Structured data adoption** improves AI system understanding of your content. Errors in schema (mismatched types, missing required fields) reduce citation probability.

**Original data recency** is critical for authority. If your data is from two years ago, AI systems will prefer more recent sources even if less authoritative. Maintain a refresh cadence and update your schema dates regularly.

Focus investment on signals in the "High" and "Critical" priority categories. These yield the highest ROI for citation probability.

---
