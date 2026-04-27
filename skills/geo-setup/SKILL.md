---
name: geo-setup
description: Use this skill when the user types /geo-setup or asks to set up the geo plugin for a new brand. Walks through a 5-minute onboarding wizard covering brand configuration, Google Sheets connection, prompt set selection, and optional Search Console setup. Also triggers on phrases like "configure my brand", "first time setup", or "geo setup".
version: 1.0.0
---

# geo-setup

## When to Use

Run this skill when first installing the geo plugin for a new brand, or when
reconfiguring an existing brand setup. Invoke with `/geo-setup`.

---

## Instructions

You are setting up the GEO plugin for a brand's marketing leader. Be
conversational, knowledgeable, and confident. You are a guide, not a form.
Ask one question at a time. Wait for each answer before proceeding.

**Before starting:** Check if `geo-config.md` exists in the project root. If it
does, say: "I found an existing config for [brand_name]. Want to update it, or
start fresh?" and wait for their answer.

---

### Step 1 — Introduce the Closed Loop

Say exactly this (do not paraphrase):

> "Welcome! This plugin helps you answer one question: *Is AI recommending your brand
> when people ask questions in your domain?*
>
> We'll do that in four steps you run once a month:
> 1. **Audit** your existing pages — see how they score for AI search
> 2. **Fix** the ones that need help
> 3. **Find gaps** — topics AI is answering that you don't cover yet
> 4. **Create** content for those gaps
>
> Let's get started. I'll ask you a few questions about your brand — it takes
> about 5 minutes."

---

### Step 2 — Brand Configuration

Ask these questions one at a time:

1. "What brand are we setting up?" (Record as `brand_name`)
2. "What's the website URL?" (Record as `website_url`)
3. "How would you describe the brand's industry or vertical? (e.g., e-commerce,
   SaaS, healthcare, finance, media, nonprofit — anything works)" (Record as
   `industry_vertical`)
4. "Does this brand have any paywalled or gated content — reports, tools, or data
   that require a login or purchase to access?" (Y/N → `has_paywalled_content`)
5. "Does this brand have proprietary data — like a survey database, internal
   research, or exclusive statistics — that others don't have access to?"
   (Y/N → `has_proprietary_data`)

After recording answers, say:
> "Good — and one thing worth knowing: proprietary data is one of the strongest
> signals AI engines use to decide who to cite. If [brand_name] has data nobody
> else has, we want to make sure that's front and center on every key page."

Then ask about Search Console:

> "One more thing before we move on — if you have access to Google Search Console,
> I'd recommend uploading a CSV of your top pages from the last month or so. This
> gives me real traffic data to work with instead of guessing which pages matter most.
>
> To export: Search Console → Performance → Pages → Export → Download CSV.
>
> You can drop it in the chat now, or skip it and add it later when you run
> `/geo-site-audit`."

If they upload a CSV now: record `search_console_csv_uploaded: true`, say
"Got it — I'll use this when we run the audit." Then continue to Step 3.
If they skip: continue to Step 3.

---

### Step 3 — Prompt Set Selection

Say: "I'll interview you to build a custom question set for [brand_name]. This
takes about 3 minutes." Load `reference/prompt-sets/generic.md` and follow the
interview guide. Save to `reference/prompt-sets/[brand-slug].md`.
Set `prompt_set: custom`.

After completing the interview and generating the prompt set, briefly explain
the strategic angle:

> "The goal with these questions is to cover the full range of things people ask AI
> in [brand_name]'s space — so we know exactly where you're showing up and where
> you're not. The more specific the questions, the more useful the data."

---

### Step 4 — Anchor Question Selection

After the prompt set is confirmed, auto-select 10 anchor questions for monthly
`/geo-check` runs. These are the questions that run through ChatGPT, Perplexity,
and Gemini every month — consistency is critical for trend tracking, so they are
saved to config and never change unless you explicitly update them.

**Select the 10 anchor questions as follows:**

Review the brand's full prompt set. Select the 10 questions that best satisfy:
1. Directly tied to the brand's proprietary data or core domain authority
2. A real user would ask this exact question in ChatGPT today
3. A correct answer should cite this brand specifically (not a generic answer)
4. Cover a range of topics (don't pick 10 questions about the same sub-topic)

Present the selected 10 to the user:

> "Here are the 10 anchor questions I've selected for your monthly `/geo-check` runs.
> These will be sent to ChatGPT, Perplexity, and Gemini every month — same questions
> every time, so your Share of Model trend is meaningful.
>
> 1. [question]
> 2. [question]
> 3. [question]
> 4. [question]
> 5. [question]
> 6. [question]
> 7. [question]
> 8. [question]
> 9. [question]
> 10. [question]
>
> Want to swap any of these out? Otherwise say 'looks good' and I'll save them."

Wait for confirmation or substitutions. Accept any changes. Save the final 10 to
`anchor_questions` in `geo-config.md`.

---

### Step 5 — Google Sheets Setup

Say:
> "Next, let's connect your Google Sheet. This is where all your results will be
> saved automatically each time you run a skill — nothing manual.
>
> First, create a new blank Google Sheet (sheets.google.com → New). Then paste
> the URL here."

Wait for the URL. Record as `brand_sheet_url`.

Then say:

> "Great. Now let's do a one-time Apps Script setup so I can write results to your
> sheet automatically. It takes about 5 minutes.
>
> In your Google Sheet:
> 1. Click **Extensions** → **Apps Script**
> 2. Select all the code in the editor and delete it
> 3. Paste in the following code:
>
> ```javascript
> function doPost(e) {
>   try {
>     var payload = JSON.parse(e.postData.contents);
>     var ss = SpreadsheetApp.getActiveSpreadsheet();
>
>     var tab = ss.getSheetByName(payload.tab);
>     if (!tab) {
>       tab = ss.insertSheet(payload.tab);
>       if (payload.headers && payload.headers.length > 0) {
>         tab.appendRow(payload.headers);
>       }
>     }
>
>     tab.appendRow(payload.row);
>
>     return ContentService
>       .createTextOutput(JSON.stringify({ status: 'ok', tab: payload.tab }))
>       .setMimeType(ContentService.MimeType.JSON);
>
>   } catch (err) {
>     return ContentService
>       .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
>       .setMimeType(ContentService.MimeType.JSON);
>   }
> }
> ```
>
> 4. Click **Deploy** → **New deployment**
> 5. Set type: **Web app** · Execute as: **Me** · Who has access: **Anyone**
> 6. Click **Deploy**, authorize when prompted
> 7. Copy the Web App URL and paste it here."

Wait for the URL. Record as `brand_sheet_webhook`.

---

### Step 6 — Google Drive Folder for Fix Reports

Say:
> "One more thing — `/geo-fix` can automatically save each page's fix report as a
> Google Doc and link it back to your Site Audit sheet. To enable this, I need a
> Google Drive folder to save reports into.
>
> Create a new folder in Google Drive (drive.google.com → New → Folder), name it
> something like 'GEO Fix Reports — [brand name]', then paste the folder URL here.
>
> You can skip this and add it later — it won't block anything else."

If they paste a URL:
- Extract the folder ID from the URL. Google Drive folder URLs follow the pattern:
  `https://drive.google.com/drive/folders/FOLDER_ID` or
  `https://drive.google.com/drive/u/0/folders/FOLDER_ID`
  The folder ID is the alphanumeric string after `/folders/`.
- Record as `drive_folder_id` and `drive_folder_url`.
- Say: "Got it — fix reports will be saved there automatically when you run `/geo-fix`."

If they skip: set `drive_folder_id: ""` and `drive_folder_url: ""` in config.
Say: "No problem — you can add this later by re-running `/geo-setup`."

---

### Step 7 — Search Console Property (Optional)

Say:
> "Last optional step: do you want to note your Search Console property URL so I
> can reference it in future sessions? It's just for my records — nothing automated."

If yes: ask for the property URL → record as `search_console_property`.
Set `search_console: csv` either way.

---

### Step 8 — Write Config and Hand Off

Write `geo-config.md` to the project root using the template from
`reference/brand-config-template.md`, filled in with all confirmed values.

Then deliver the handoff summary. Customize it for the brand — use the confirmed
details from this session. Do not give a generic summary. Specifically:

- Name the 1–2 topics where this brand has the strongest citation advantage
  (based on proprietary data or domain authority)
- Name 1–2 topics where AI is likely citing generic or weaker sources right now
  (gaps worth prioritizing in the first loop)

Then give the full workflow summary:

> "You're all set! Here's what we configured:
> - **Brand:** [brand_name] ([website_url])
> - **Industry/Vertical:** [industry_vertical]
> - **Prompt set:** custom ([N] questions)
> - **Sheet:** Connected ✓
> - **Anchor questions:** 10 saved ✓ (run `/geo-check` to measure your Share of Model)
> - **Drive folder:** [linked ✓ / not configured]
> - **Search Console:** [csv/not connected]
>
> ---
>
> **Your strategic starting point:**
> [1–3 sentences: where this brand has real citation potential and what to prioritize
> in the first loop. Be specific to the brand's domain and data situation.]
>
> ---
>
> **Here's your monthly workflow — run these in order, every month:**
>
> **Step 1 → `/geo-site-audit`**
> Fetches your pages and scores each one against 10 AI-readiness criteria.
> *Before running this:* export your traffic data from Google Search Console —
> Performance → Pages → Export → Download CSV. Have the file ready to drop into
> the chat. (No CSV? I'll fall back to your sitemap, but traffic-based results
> are more accurate.)
> *Writes to: Site Audit tab in your Google Sheet.*
>
> **Step 2 → `/geo-fix [url]`**
> Takes a specific page URL and rewrites or restructures it for better AI citation.
> Run this on any page flagged High priority from the audit.
> *If Drive is configured: saves a fix report Doc and links it back to your Site Audit sheet.*
>
> **Step 3 → `/geo-check`**
> Runs your 10 anchor questions through ChatGPT, Perplexity, and Gemini live in your
> browser. Measures your Share of Model per engine and calculates a weighted overall score.
> Takes about 10–15 minutes.
> *Writes to: Citation Monitor tab in your Google Sheet.*
>
> **Step 4 → `/geo-gaps`**
> Finds questions AI is answering in your domain where your brand isn't showing up.
> These are your content opportunities.
> *Writes to: Content Gaps tab in your Google Sheet.*
>
> **Step 5 → `/geo-brief [topic]`**
> Takes a gap topic and generates a full content brief optimized for AI citation.
> Run once per gap you want to close.
> *No sheet write — outputs a brief you can hand to a writer.*
>
> **Step 6 → `/geo-report`**
> Reads your Site Audit, Citation Monitor, and Content Gaps tabs, computes a
> monthly summary, and writes a summary row to your brand sheet.
> **Run this last, after completing steps 1–4.**
> *Writes to: Monthly Summary tab in your Google Sheet.*
>
> ---
>
> **Supporting commands (run anytime):**
>
> `/geo-facts` — Builds a Fast Facts page for your brand to prevent AI from citing
> wrong information about you. Especially valuable if AI is currently getting your
> brand's data, pricing, or positioning wrong. Good to run early.
>
> `/geo-report` — Can also be run standalone to update leadership on your current
> numbers without running the full loop.
>
> ---
>
> **Start here → run `/geo-site-audit` now.**"

---

## Output

- `geo-config.md` written to project root
- `reference/prompt-sets/[brand].md` written with custom prompt set
- Confirmation message with setup summary and first action
