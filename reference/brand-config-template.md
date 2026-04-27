# GEO Brand Config

Copy this file to your project root as `geo-config.md` and fill in each field.
This file is created automatically when you run `/geo-setup`.

---

## Brand

- **brand_name:** [e.g., Acme Corp]
- **website_url:** [e.g., https://acmecorp.com]
- **industry_vertical:** [free text — e.g., e-commerce, SaaS, healthcare, finance, media, nonprofit]
- **has_paywalled_content:** [true | false]
- **has_proprietary_data:** [true | false]

## Prompt Set

- **prompt_set:** [custom]
- **prompt_set_path:** [reference/prompt-sets/[brand-slug].md]
- **anchor_questions:**
  1. [question — selected during /geo-setup]
  2. [question]
  3. [question]
  4. [question]
  5. [question]
  6. [question]
  7. [question]
  8. [question]
  9. [question]
  10. [question]

## Google Sheets

- **brand_sheet_webhook:** [Your Apps Script Web App URL — deployed from your brand's Google Sheet]
- **brand_sheet_url:** [Your brand's Google Sheet URL — for reference only]

## Google Drive

- **drive_folder_id:** [Google Drive folder ID — extracted from the folder URL after /folders/]
- **drive_folder_url:** [Full Google Drive folder URL — for reference only]

## Search Console

- **search_console:** [oauth | csv | none]
- **search_console_property:** [e.g., https://acmecorp.com — only if oauth]

## Notes

Optional freeform notes about this brand's setup, context, or known AI visibility issues.

- **notes:**
