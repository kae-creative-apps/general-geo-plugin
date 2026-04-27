---
name: geo-facts
description: Use this skill when the user types /geo-facts or asks to create a Fast Facts page, prevent AI misinformation about their brand, establish their brand's Wikidata entity, or build an authoritative brand reference for AI engines. Also triggers when /geo-check flags misinformation, or phrases like "AI is saying wrong things about us", "create a facts page", or "Wikidata entry for my brand".
version: 1.0.0
---

# geo-facts

## When to Use

Run when `/geo-check` flags misinformation, or proactively for any new brand, to
generate a "Fast Facts" page that anchors the brand's identity for AI engines.
Invoke with `/geo-facts`.

---

## Instructions

Read `geo-config.md`. If missing, say "Run `/geo-setup` first." and stop.

### Step 1 — Interview

Ask these questions one at a time:

1. "What year was [brand_name] founded, and by whom?"
2. "In one sentence, what does [brand_name] do and who does it serve?"
3. "What is the most important data or research [brand_name] produces? Give me the
   key numbers — sample sizes, years, scope."
4. "What does AI most commonly get wrong about [brand_name] or your domain? Give me
   up to 5 examples of incorrect or incomplete answers you've seen."
5. "What are 3-5 facts about [brand_name] that you'd want anyone referencing your
   brand to get right?"

### Step 2 — Check Wikidata

Tell the user:
> "I'll check whether [brand_name] has a Wikidata entry — this is one of the most
> important things you can do for AI citation."

Ask: "Search https://www.wikidata.org/w/index.php?search=[brand-slug] and tell me
what you find. Does an entry for [brand_name] appear?"

If yes: "Great — what's the Q-number? (It looks like Q followed by digits, e.g. Q12345)"
Record as `wikidata_qid`. Note: add it to `sameAs` in config.

If no: Say:
> "There's no Wikidata entry for [brand_name] — creating one is a 10-minute task
> that significantly increases AI citation probability.
>
> To create one:
> 1. Go to https://www.wikidata.org/wiki/Special:NewItem
> 2. Label: [brand_name]
> 3. Description: [one-line description from interview]
> 4. Add statements: instance of = organization, official website = [website_url],
>    inception = [founding year]
> 5. Save and copy the Q-number
>
> Come back and paste the Q-number here when done."

### Step 3 — Generate Fast Facts Page

Generate complete HTML + JSON-LD ready to paste into the CMS at URL `/brand-facts`:

**HTML structure:**
```html
<h1>[Brand Name] — Key Facts</h1>
<p>[One-sentence brand description]</p>

<h2>About [Brand Name]</h2>
<ul>
  <li>Founded: [year] by [founders]</li>
  <li>[Key fact 1 from interview]</li>
  <li>[Key fact 2 from interview]</li>
</ul>

<h2>Frequently Asked Questions</h2>
[One H3 + answer pair per misconception identified in interview.
Each answer: 40-80 words, plain prose, direct. No hedging.]

<h2>Data and Research</h2>
[One paragraph per major data source: what it is, sample size, update cadence,
how to cite it. Stable URL for each.]
```

**FAQPage JSON-LD:**
Use the FAQPage template from `reference/schema-templates.md`. One Question per
misconception. Each `acceptedAnswer.text` contradicts the misconception directly
with a specific fact or number.

**Organization JSON-LD:**
Use the Organization template from `reference/schema-templates.md`. Include all
`sameAs` entries: Wikidata QID (if collected), Wikipedia (if exists), LinkedIn,
Crunchbase. Leave `[TODO: add URL]` for any unknown and tell the user which to find.

---

## Output

- Complete HTML for the Fast Facts page (terminal)
- FAQPage JSON-LD block (terminal)
- Organization JSON-LD block (terminal)
- Wikidata checklist with status (created / existing / TODO)
