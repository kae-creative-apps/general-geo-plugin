---
name: geo-check
description: Use this skill when the user types /geo-check or asks to measure their brand's Share of Model, AI citation rate, or how often AI recommends their brand. Runs 10 anchor questions through ChatGPT, Perplexity, and Gemini live via browser and calculates per-engine Share of Model scores. Run monthly as Step 3 of the closed loop. Also triggers on "is AI citing us", "check our AI visibility", "Share of Model", or "are we being mentioned by AI".
version: 2.0.0
---

# geo-check

## When to Use

Run monthly to measure the brand's Share of Model (SoM) — how often ChatGPT,
Perplexity, and Gemini cite the brand when answering questions in its domain.
Invoke with `/geo-check`.

---

## Instructions

> *Step 3 of 4: Measure your Share of Model. Running 10 anchor questions through
> ChatGPT, Perplexity, and Gemini — live in your browser.*

Read `geo-config.md` from the project root. If missing: say "Run `/geo-setup` first." and stop.

Check for `anchor_questions` in config. If missing or empty: say "No anchor questions
configured yet. Run `/geo-setup` to select your 10 anchor questions — takes about
2 minutes." and stop.

Load the 10 anchor questions from `anchor_questions` in config. Load `brand_name`,
`website_url`, and `brand_sheet_webhook` from config.

Say:
> "Starting your monthly Share of Model check. I'll run your 10 anchor questions
> through ChatGPT, Perplexity, and Gemini — live in your browser. Make sure you're
> logged into all three before I begin. This takes about 10–15 minutes.
>
> Ready? I'll start with ChatGPT."

Wait for confirmation before proceeding.

### Step 1 — Query ChatGPT

For each of the 10 anchor questions:

1. Use the browser MCP tool to navigate to `https://chat.openai.com`
2. Start a new conversation (click "New chat" if needed)
3. Type the question into the message input and submit
4. Wait for the full response to complete — watch for the response to stop generating
5. Extract: full response text, any URLs cited, any brand or organization names mentioned as sources

Record for this question + ChatGPT engine:
- **Cited:** Yes / Mentioned / No
  - **Yes** = brand name explicitly credited as a source, linked, or attributed
  - **Mentioned** = brand name appears in the answer body but not as a primary source
  - **No** = brand not present in any form
- **Position:** 1st citation / 2nd citation / Later / Not cited
- **Competitor cited:** Any other domains or organizations that appear as sources (record exactly what you observe)
- **Misinformation:** Does the answer contain anything factually wrong or misleading about the brand's domain? Note specifically what is wrong.

After all 10 questions, calculate:
```
ChatGPT SoM = (count of questions where Cited = Yes OR Mentioned) / 10 × 100
```

### Step 2 — Query Perplexity

For each of the 10 anchor questions:

1. Navigate to `https://perplexity.ai`
2. Enter the question in the search bar and submit
3. Wait for the response and the sources panel to fully load
4. Extract: response text, all cited sources listed in the numbered sources panel (Perplexity lists these explicitly)

Record the same four fields (Cited, Position, Competitor cited, Misinformation) for each question.

After all 10, calculate:
```
Perplexity SoM = (count of questions where Cited = Yes OR Mentioned) / 10 × 100
```

### Step 3 — Query Gemini

For each of the 10 anchor questions:

1. Navigate to `https://gemini.google.com`
2. Start a new conversation and enter the question
3. Wait for the full response to complete
4. Extract: response text, any sources or links cited

Record the same four fields for each question.

After all 10, calculate:
```
Gemini SoM = (count of questions where Cited = Yes OR Mentioned) / 10 × 100
```

### Step 4 — Calculate Weighted Overall SoM

```
Overall SoM = (ChatGPT SoM × 0.80) + (Perplexity SoM × 0.12) + (Gemini SoM × 0.08)
```

Weights reflect real-world AI query market share (~85% ChatGPT, remainder split
Perplexity/Gemini). Round all scores to the nearest whole number.

### Step 5 — Write to Sheets

POST each result to `brand_sheet_webhook`. Write one row per question per engine
(30 data rows total), then four summary rows.

**Data rows** — one curl call per question per engine (30 total):

```bash
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Citation Monitor",
    "headers": ["Date","Question","Engine","Cited","Position","Competitor Cited","Misinformation","Live/Estimated"],
    "row": ["[YYYY-MM-DD]","[question text]","[ChatGPT|Perplexity|Gemini]","[Yes|Mentioned|No]","[1st|2nd|Later|Not cited]","[competitor name or —]","[Yes — note|No]","Live"]
  }'
```

**Summary rows** — four curl calls after all data rows:

```bash
# ChatGPT summary
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Citation Monitor",
    "headers": ["Date","Question","Engine","Cited","Position","Competitor Cited","Misinformation","Live/Estimated","SoM Score"],
    "row": ["[YYYY-MM-DD]","— ChatGPT Summary —","ChatGPT","—","—","—","—","Live","[ChatGPT SoM]%"]
  }'

# Perplexity summary
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Citation Monitor",
    "headers": ["Date","Question","Engine","Cited","Position","Competitor Cited","Misinformation","Live/Estimated","SoM Score"],
    "row": ["[YYYY-MM-DD]","— Perplexity Summary —","Perplexity","—","—","—","—","Live","[Perplexity SoM]%"]
  }'

# Gemini summary
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Citation Monitor",
    "headers": ["Date","Question","Engine","Cited","Position","Competitor Cited","Misinformation","Live/Estimated","SoM Score"],
    "row": ["[YYYY-MM-DD]","— Gemini Summary —","Gemini","—","—","—","—","Live","[Gemini SoM]%"]
  }'

# Weighted overall summary
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Citation Monitor",
    "headers": ["Date","Question","Engine","Cited","Position","Competitor Cited","Misinformation","Live/Estimated","SoM Score"],
    "row": ["[YYYY-MM-DD]","— Overall Weighted SoM —","Overall (weighted)","—","—","—","—","Live","[Overall SoM]%"]
  }'
```

Always include the `headers` field on every POST.

### Step 6 — Display Summary

```
Citation Monitor — [Brand Name] — [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ChatGPT SoM:    [X]%   ([N]/10 questions cited or mentioned)
Perplexity SoM: [X]%   ([N]/10 questions cited or mentioned)
Gemini SoM:     [X]%   ([N]/10 questions cited or mentioned)

Overall SoM:    [X]%   (weighted: ChatGPT 80% · Perplexity 12% · Gemini 8%)

Most cited competitors across all engines:
  1. [Source] — cited in [N] answers, by [engines]
  2. [Source] — cited in [N] answers, by [engines]
  3. [Source] — cited in [N] answers, by [engines]

Questions where AI gives wrong or incomplete answers:
  • "[Question]" — [engine]: [what is wrong or missing]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
30 result rows + 4 summary rows written to Citation Monitor tab.

Next: Run `/geo-gaps` to find topics AI is answering in your domain without you.
No prep needed — just type the command.
```

---

## Output

- 30 data rows (10 questions × 3 engines) appended to Citation Monitor tab
- 4 summary rows (ChatGPT SoM / Perplexity SoM / Gemini SoM / Overall weighted SoM)
- Terminal summary: per-engine scores, weighted overall, top 3 competitors, misinformation cases
