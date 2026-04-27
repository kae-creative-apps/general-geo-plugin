---
name: geo-brief
description: Use this skill when the user types /geo-brief [topic] or asks to generate a content brief for a new page targeting AI search. Creates a full brief with keyword variants, page structure, opening paragraph template, and JSON-LD schema block. Run as Step 4 of the closed loop on high-priority content gaps from /geo-gaps. Also triggers on "write a content brief", "create a brief for AI SEO", or "how should I structure a page about [topic]".
version: 1.0.0
---

# geo-brief

## When to Use

Run to generate a content brief + schema skeleton for a new page. Invoke with
`/geo-brief "[topic or question]"`. Most useful after running `/geo-gaps`.

---

## Instructions

> *Step 4 of 4: Creating new content. This generates a brief your writer can take
> directly into production.*

Read `geo-config.md`. If missing, say "Run `/geo-setup` first." and stop.

Extract the topic from the user's message. If no topic is provided, ask:
"What topic or question should I write a brief for?"

Determine brief type:
- **Type B (Proprietary):** if `has_proprietary_data: true` in config
- **Type A (Standard):** all other cases

---

### Type A — Standard Brief

Generate the following sections:

**1. Target keyword and variants**
- Primary keyword (as users type it)
- 3-5 semantic variants (related phrasings AI engines also answer)
- PAA questions to address (3-5 questions from Google's PAA for this topic)

**2. Page metadata**
- Recommended URL slug (lowercase, hyphens, descriptive)
- Title tag (60 chars max, leads with keyword, answer-oriented)
- Meta description (150 chars max, includes a specific number or fact if possible)

**3. Opening paragraph template**
Write the actual opening paragraph (inverted pyramid):
- Sentence 1 (direct answer, 20-30 words): The specific answer with a number or fact
- Sentence 2 (context, 20-30 words): Why this matters or who this applies to
- Total: 40-60 words

**4. Content structure**
For each recommended H2 section (3-5 sections):
- H2 text (in question format when possible)
- 2-3 H3 sub-questions in PAA format
- Word count target: 120-180 words
- Data/stat to include: what specific number or finding to feature
- Content type: prose / list / table / comparison

**5. Author recommendation**
- Recommended author type for this topic (researcher, practitioner, editor)
- Credential to display (e.g., "Former industry practitioner of 15 years")

**6. Internal linking**
- 2-3 pages on the brand's site to link to from this page
- 1-2 pages that should link to this new page

---

### Type B — Proprietary Data Brief

Everything in Type A, PLUS:

**Proprietary data pull instructions**
For each data point in the brief, specify exactly what to pull:
- Metric name (e.g., "median compensation for this role")
- Filter to apply (e.g., "filter by: region = Southeast, company size = 200-500 employees")
- Format to use: "According to [Brand]'s [Year] data from [N] [subjects], [metric] is [value]."
- Stable permalink recommendation: `[domain]/data/[year]-[metric-slug]`

**Gateway variant** (only if `has_paywalled_content: true`):
If this topic is covered in gated content, generate a gateway page brief:
- Public page that answers the primary question well enough to be citable
- 200-400 word structure, standalone as a source
- Prominent link to gated content: "See the full [Report Name] →"
- `isPartOf` JSON-LD relationship pointing to the gated resource

---

### Schema Block (both types)

Choose the appropriate schema type:
- Topic is a how-to or guide → HowTo
- Topic is data-heavy or research-based → Dataset or ScholarlyArticle
- Topic has Q&A structure → FAQPage
- General article → Article

Generate the complete JSON-LD block using values from `geo-config.md` for
publisher name, url, and sameAs. Mark datePublished and dateModified as placeholders.

---

## Output

**Content Brief** (terminal, markdown format):
```
CONTENT BRIEF: [Topic]
Brand: [Brand Name] | Type: [Standard/Proprietary]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Full brief as specified above]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Schema Block** (terminal, ready to paste into CMS `<head>`):
```json
[Complete JSON-LD block]
```

After outputting the brief, say:
> "Hand this brief to your writer or content team. When you've created briefs for
> all the gaps you want to address this month, run `/geo-report` to generate your
> monthly performance summary."
