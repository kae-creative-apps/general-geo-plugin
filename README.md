# geo — General-Purpose GEO Plugin for Claude Code

Monitor, fix, and grow your brand's GEO and AEO scores from the Claude Code CLI.
No backend, no database. Results land in Google Sheets. Designed for marketing
teams — no technical knowledge required.

## Installation

```bash
claude config add plugin-source https://github.com/kae-creative-apps/general-geo-plugin
claude /install-plugin geo
```

## First Use

After installing, run:

```
/geo-setup
```

This walks you through a 5-minute setup: brand configuration, Google Sheets
connection, prompt set selection, and optional Search Console connection.

## The Closed Loop

Run these four steps once a month:

```
1. /geo-site-audit           Audit your top and bottom pages for GEO readiness
2. /geo-fix [url]            Fix specific pages flagged in the audit
3. /geo-check                Measure Share of Model across AI engines
   /geo-gaps                 Find content gaps AI is answering without you
4. /geo-brief [topic]        Generate a content brief for each gap
```

Supporting skills:

```
/geo-facts                   Build a Fast Facts page to prevent misinformation
/geo-report                  Write a monthly performance summary to your brand sheet
```

## Google Sheets Setup

Each brand needs its own Google Sheet with an Apps Script webhook deployed.
Run `/geo-setup` and it will walk you through the full setup step by step —
creating the sheet, deploying the Apps Script, and saving the webhook URL.

The Apps Script code is in `apps-script/geo-webhook.gs`. During setup you will
paste it into your sheet's Apps Script editor and deploy it as a Web App.

## Requirements

- Claude Code CLI
- Google account (for Sheets and optionally Drive)
- Optional: Google Search Console access for smarter page audits
