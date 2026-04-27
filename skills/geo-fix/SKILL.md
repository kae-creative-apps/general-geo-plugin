---
name: geo-fix
description: Use this skill when the user types /geo-fix [url] or asks to fix a specific page for GEO or AEO. Audits a single URL, generates a prioritized fix checklist with exact rewrites, and outputs a complete JSON-LD schema block ready to paste. Run as Step 2 of the closed loop on HIGH priority pages from /geo-site-audit. Also triggers on "fix this page for AI", "improve GEO score for [url]", or "schema markup for [url]".
version: 1.0.0
---

# geo-fix

## When to Use

Run on a specific URL to get a prioritized list of fixes and ready-to-paste schema
markup. Invoke with `/geo-fix [url]`. Most useful on pages flagged HIGH in `/geo-site-audit`.

---

## Instructions

> *Step 2 of 4: Fix existing content. Run this for each high-priority page from
> your site audit.*

Read `geo-config.md` from the project root. If it does not exist, say:
"Run `/geo-setup` first." and stop.

Extract the URL from the user's message. If no URL provided, ask: "Which URL should
I audit? Paste the full URL."

### Step 1 — Fetch and Analyze the Page

Fetch the URL. Extract:
- Full page title and H1
- Meta description
- All heading text (H2, H3, H4) in order
- First 300 words of body content
- Any existing JSON-LD schema blocks
- Author information if present
- Publication/modification date if present
- Whether content appears in raw HTML vs. requires JS

### Step 2 — Run Full Audit

Evaluate all 10 criteria from `geo-site-audit` (passage structure, entity salience,
schema present, schema type, author credentials, freshness, featured snippet format,
PAA questions, AI crawler accessible, internal linking).

Additionally check:
- **sameAs completeness:** If Organization schema exists, does `sameAs` include
  Wikidata, LinkedIn, and Crunchbase URLs?
- **Paywalled gateway:** If `has_paywalled_content: true` in config, is this a gated
  page? If so, generate a gateway page brief instead of editing the gated page.
- **Voice search:** Is there at least one answer formatted for voice (40-60 word
  prose, numeric answer, conversational question phrasing)?

### Step 3 — Generate Fix Checklist

Output a numbered fix list, highest-impact items first. For each fix, show exactly
what to change — not "improve your opening paragraph" but the actual rewritten text.

Prioritize in this order:
1. Missing or wrong schema (highest citation impact)
2. Passage structure failures (direct answer missing or not in first 50 words)
3. Author credentials missing
4. sameAs incomplete
5. PAA questions missing
6. Content freshness (flag if >6 months, recommend update date and dateModified)
7. Entity salience gaps
8. Voice search optimization

### Step 4 — Generate Schema Block

Generate the complete, correct JSON-LD schema for this page:
- Choose schema type based on content (Article, FAQPage, HowTo, ScholarlyArticle,
  Dataset — see `reference/schema-templates.md`)
- If paywalled gateway: use ScholarlyArticle with `abstract` field
- Pre-populate `sameAs` from config values
- Set `dateModified` to today's date as a placeholder: mark "UPDATE THIS when you publish"

### Step 5 — Save Fix Report to Google Drive and Update Sheet

Check `geo-config.md` for `drive_folder_id`.

**If `drive_folder_id` is not set:** say "No Drive folder configured — run `/geo-setup`
to add one. Skipping report save." and stop here.

**If `drive_folder_id` is set:**

**5a — Create the Google Doc**

Use the Drive MCP tool to create a new Google Doc in `drive_folder_id`:
- **Title:** `GEO Fix — [page title]`
- **Contents:** The full fix checklist output from Step 3, followed by the complete
  JSON-LD schema block from Step 4. Include the URL, current score, and estimated
  post-fix score at the top.

Record the returned document URL as `fix_doc_url`.

**5b — Write the doc URL back to the Site Audit sheet**

POST to `brand_sheet_webhook` using the two-step POST+GET pattern (Apps Script
redirects on POST — send the request, then follow the `Location` header with a GET):

```bash
# Step 1 — POST (expect a 302 redirect; capture Location header)
curl -s -o /dev/null -w "%{redirect_url}" -X POST "[brand_sheet_webhook]" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "updateRow",
    "tab": "Site Audit",
    "matchColumn": "URL",
    "matchValue": "[page_url]",
    "updateColumn": "Recommended Changes",
    "updateValue": "[fix_doc_url]"
  }'

# Step 2 — GET the redirect URL returned above
curl -s "[redirect_url_from_step_1]"
```

On success the webhook returns `{ "status": "ok", "tab": "Site Audit", "row": N }`.

Say: "Fix report saved → [fix_doc_url]
Updated Site Audit row for [page_url] → Recommended Changes column."

---

## Output

**Fix Checklist** (terminal):
```
GEO Fix Report — [URL]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current GEO Score: [X]/10 → Estimated after fixes: [Y]/10

1. [HIGH] [Specific fix with exact copy or code]
2. [HIGH] [Specific fix with exact copy or code]
3. [MEDIUM] [Specific fix]
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Schema Block** (terminal, ready to paste into CMS `<head>`):
```json
[Complete JSON-LD block]
```

**Drive report** (if `drive_folder_id` set):
- Google Doc created in configured Drive folder
- Site Audit row for this URL updated: Recommended Changes → Doc URL
