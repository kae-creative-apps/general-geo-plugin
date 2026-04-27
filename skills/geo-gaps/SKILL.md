---
name: geo-gaps
description: Use this skill when the user types /geo-gaps or asks to find content gaps, topics AI is answering in their domain that they don't have content for, or where competitors are dominating AI answers. Run after /geo-check as part of Step 3 of the closed loop. Also triggers on "what content are we missing", "what is AI saying about our industry that we don't cover", or "find keyword gaps for AI search".
version: 1.0.0
---

# geo-gaps

## When to Use

Run after `/geo-check` to find topics AI is answering in your domain that your
brand has no content for. Invoke with `/geo-gaps`.

---

## Instructions

> *Step 3 of 4: Finding content gaps — topics AI is answering in your domain that
> you don't have content for yet.*

Read `geo-config.md`. If missing, say "Run `/geo-setup` first." and stop.

### Step 1 — Identify Domain Questions

Using your knowledge of the brand's `industry_vertical`, generate a list of 40-60
questions that users commonly ask AI engines in this domain. Tailor these questions
to the specific industry or vertical described in config — make them concrete and
representative of real user queries in that space.

### Step 2 — Cross-Reference Existing Content

Fetch `[website_url]/sitemap.xml`. Extract all URLs. For each URL, fetch the page
title and meta description (or H1 if no meta description). Build a list of topics
the brand currently covers.

For each of the 40-60 domain questions, determine:
- **Covered:** Brand has a page that directly answers this question
- **Partial:** Brand has related content but not a direct answer
- **Missing:** Brand has no content on this topic

### Step 3 — Classify Gaps

For each Missing or Partial topic, determine the gap type:
- **No coverage:** Brand has nothing on this topic
- **Not cited:** Brand has a page but `/geo-check` results show it is not being cited
- **Competitor dominates:** Another source consistently appeared in `/geo-check` results for this topic (use observed citations from the Citation Monitor tab, not a pre-set list)
- **Misinformation opportunity:** AI gives wrong answers here — brand's data could correct it
- **Gateway opportunity:** Brand has paywalled content covering this topic
  (`has_paywalled_content: true`) — a free gateway page would get the topic cited

Prioritize gaps:
- **High:** Misinformation opportunity OR competitor dominates AND brand has
  proprietary data that would answer better
- **Medium:** No coverage on a frequently-asked question
- **Low:** Partial coverage that could be improved

### Step 4 — Write to Sheets

POST top 20 gaps to `brand_sheet_webhook`:

```bash
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Content Gaps",
    "headers": ["Date","Topic/Question","Gap Type","Who AI Cites Now","Priority","Brief Needed"],
    "row": ["[date]","[question]","[gap type]","[competitor]","[High|Medium|Low]","Yes"]
  }'
```

### Step 5 — Display Summary

```
Content Gaps — [Brand Name] — [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Found [N] gaps. Top 5 opportunities:

1. [HIGH] "[Question]"
   Gap type: [type]
   AI cites: [competitor] ([what's wrong])
   → Run: /geo-brief "[question]"

2. [HIGH] "[Question]"
   ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full gap list written to your Google Sheet → Content Gaps tab.

Next: Run `/geo-brief "[topic]"` for each gap you want to address — copy a topic
from the list above and paste it in. When you've created all the briefs you need
this month, run `/geo-report` to generate your monthly summary.
```

---

## Output

- Rows appended to "Content Gaps" tab in brand's Google Sheet
- Terminal summary of top 5 gaps with `/geo-brief` commands ready to copy
