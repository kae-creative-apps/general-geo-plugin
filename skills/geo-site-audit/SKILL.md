---
name: geo-site-audit
description: Use this skill when the user types /geo-site-audit or asks to audit their website pages for GEO or AEO readiness. Audits all available pages by traffic, scoring each on 10 GEO criteria. Run monthly as Step 1 of the closed loop. Also triggers on "audit my pages", "check my site for AI search", or "GEO score my website".
version: 1.0.0
---

# geo-site-audit

## When to Use

Run monthly (or more frequently for high-priority brands) to audit all available
pages for GEO/AEO readiness. Invoke with `/geo-site-audit`.

---

## Instructions

> *Step 1 of 4: Audit existing content. After this, run `/geo-fix [url]` on any
> page flagged High priority.*

Read `geo-config.md` from the project root. If it does not exist, say:
"Run `/geo-setup` first to configure your brand." and stop.

### Step 1 — Get Page List

**Always request a fresh CSV at the start of every audit run.** Do not reuse a
CSV from a previous session or from `/geo-setup`. Search Console data changes
monthly and the audit results are only meaningful if the traffic data is current.

**A) CSV drop (preferred)**
Say exactly:
> "Before we start — export a fresh CSV from Search Console so the audit reflects
> your current traffic. Go to Search Console → Performance → Pages → set the date
> range to the last 28 days → Export → Download CSV. Drop it here when ready.
>
> If you don't have access right now, say skip and I'll fall back to your sitemap."

Wait for the CSV or an explicit skip before proceeding.

If the user provides a CSV: parse it, remove rows with 0 impressions, sort by
Impressions descending. Audit all pages in the CSV (no cap). Extract the URL column.

**B) Sitemap fallback**
If the user skips or has no CSV, fetch `[website_url]/sitemap.xml`. Extract all
URLs. Audit all pages found, prioritizing most recently modified. Note in output:
"Using sitemap — drop a Search Console CSV next time for traffic-based results."

### Step 2 — Audit Each Page

For each URL, fetch the page and evaluate it against each criterion.
Score each criterion pass/fail, then calculate a GEO Score of 1-10
(criteria passed ÷ 10 × 10, rounded).

**Audit criteria (10 total):**

1. **Passage structure** — Does the page have at least one 120-180 word self-contained
   passage with a direct answer in the first 50 words?
2. **Entity salience** — Does the brand name appear in the title, H1, and first 50 words?
3. **Schema present** — Is there valid JSON-LD schema markup on the page?
4. **Schema type appropriate** — Is the schema type correct for the content
   (Article for blog, FAQPage for FAQ, Dataset for data pages, etc.)?
5. **Author credentials** — Is there a named author with a title or credential?
6. **Content freshness** — Was the page published or updated within the last 6 months?
   (Check dateModified in schema, or Last-Modified header, or visible date on page.)
7. **Featured snippet format** — Does any section use the inverted pyramid (direct
   answer first, then elaboration)?
8. **PAA questions** — Does the page include at least one H3 in question format
   (begins with What/How/Why/When/Should/Can)?
9. **AI crawler accessible** — Does the key content appear in raw HTML, not only
   after JS execution?
10. **Internal linking** — Does the page link to or from at least 2 other pages on
    the same domain?

### Step 3 — Check Trend Alignment

For each page, assess whether the topic is aligned with current trends in the brand's
domain based on `industry_vertical` from config.
Flag as: Strong / Moderate / Weak / Unknown.

### Step 4 — Write to Sheets

POST to `brand_sheet_webhook` from config:

```bash
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Site Audit",
    "headers": ["Date","URL","Title","GEO Score","Failed Criteria","Trend Alignment","Priority","Status"],
    "row": ["[YYYY-MM-DD]","[url]","[title]","[score]/10","[comma-separated failed criteria]","[Strong|Moderate|Weak]","[High|Medium|Low]","Needs review"]
  }'
```

Run one curl per page. If the webhook URL is empty in config, skip and note:
"No webhook configured — results shown in terminal only."

### Step 5 — Display Summary

Show a table of the 5 highest-priority pages:

```
GEO Site Audit — [Brand Name] — [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Priority  Score  URL                         Top Issue
HIGH      3/10   /example-page               No schema, no author, old content
HIGH      4/10   /another-page               Passage structure fails
HIGH      4/10   /third-page                 No PAA questions, JS-rendered
MEDIUM    5/10   /fourth-page                Author missing
MEDIUM    6/10   /fifth-page                 Schema type wrong
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full results written to your Google Sheet → Site Audit tab.

Next: Run `/geo-fix [url]` on each HIGH priority page — paste the URL from the list above.
When you've fixed all the HIGH pages you want to address, run `/geo-check` to measure
your Share of Model. No prep needed — just type the command.
```

---

## Output

- Rows appended to "Site Audit" tab in brand's Google Sheet
- Terminal summary of top 5 priority pages with one-line diagnosis each
