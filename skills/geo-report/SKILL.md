---
name: geo-report
description: Use this skill when the user types /geo-report or asks to generate a monthly performance report, summarize their brand's GEO and AEO scores, or write a monthly summary to their brand sheet. Run at the end of each monthly loop after completing /geo-check. Also triggers on "write my monthly GEO report" or "summarize my GEO performance".
version: 1.0.0
---

# geo-report

## When to Use

Run monthly after completing the rest of the loop to calculate a performance
summary and write it to the brand's own Google Sheet.
Invoke with `/geo-report`.

---

## Instructions

Read `geo-config.md`. If missing, say "Run `/geo-setup` first." and stop.

### Step 1 — Gather Brand Sheet Data

Tell the user:
> "I'll need to read your brand's Google Sheet to compile the summary. Open your
> sheet and export each tab (Site Audit, Citation Monitor, Content Gaps) as a CSV.
> Drop them all here."

If the user provides the CSVs, parse them. If they cannot export, ask them to
share key numbers directly:
- "What was your SoM score from your last `/geo-check` run?"
- "How many pages did `/geo-site-audit` flag as High priority?"
- "How many open gaps are in your Content Gaps tab?"

### Step 2 — Calculate Summary Metrics

From the Citation Monitor CSV data, find the four summary rows (rows where
Question contains "Summary" or "Overall"):

- **ChatGPT SoM:** Value from the "— ChatGPT Summary —" row, SoM Score column
- **Perplexity SoM:** Value from the "— Perplexity Summary —" row, SoM Score column
- **Gemini SoM:** Value from the "— Gemini Summary —" row, SoM Score column
- **SoM Score (Overall):** Value from the "— Overall Weighted SoM —" row, SoM Score column
- **SoM Δ:** Current Overall SoM minus previous month's Overall SoM (if prior row exists in Monthly Summary tab)
- **Avg GEO Score:** Average of all GEO Score values in Site Audit tab
- **High Priority Pages:** Count of rows where Priority = High in Site Audit tab
- **Open Gaps:** Count of rows in Content Gaps tab
- **Top Action:** The single most impactful action based on the data:
  - If ChatGPT SoM < 10%: "Run /geo-facts — ChatGPT has low brand awareness"
  - If Overall SoM < 10%: "Run /geo-facts to build brand entity foundation"
  - If High Priority Pages > 5: "Fix [top page URL from site audit]"
  - If Open Gaps > 10: "Create brief for: [top High priority gap]"
  - Otherwise: "Maintain — re-audit next month"

If Citation Monitor data uses the old single-engine format (no Engine column),
fall back to reading SoM Score directly and set ChatGPT SoM, Perplexity SoM,
and Gemini SoM all to "—".

### Step 3 — Write Summary Row to Brand Sheet

POST to `brand_sheet_webhook`:

```bash
curl -s -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "tab": "Monthly Summary",
    "headers": ["Date","Brand","ChatGPT SoM","Perplexity SoM","Gemini SoM","SoM Score","SoM Delta","Avg GEO Score","High Priority Pages","Open Gaps","Top Action"],
    "row": ["[YYYY-MM-DD]","[brand_name]","[ChatGPT SoM%]","[Perplexity SoM%]","[Gemini SoM%]","[Overall SoM%]","[+/-delta%]","[avg]/10","[count]","[count]","[top action]"]
  }'
```

### Step 4 — Display Summary

```
Monthly GEO Report — [Brand Name] — [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ChatGPT SoM:         [X]%
Perplexity SoM:      [X]%
Gemini SoM:          [X]%
Overall SoM:         [X]% ([+/-delta]% from last month)
Avg GEO Score:       [X]/10
High Priority Pages: [N]
Open Content Gaps:   [N]

Top Action: [top action text]

Summary row written to Monthly Summary tab ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Output

- One row appended to "Monthly Summary" tab in the brand's Google Sheet
- Terminal summary with all key metrics and top recommended action
