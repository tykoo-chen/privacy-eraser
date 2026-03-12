---
name: privacy-report
description: |
  Cross-platform privacy violation reporting tool for Privacy Eraser.
  Automate reporting/flagging of privacy-violating content across platforms (Google, Twitter/X, Facebook/Meta, Instagram, LinkedIn, Reddit, TikTok, YouTube, data broker sites).
  Use when: (1) user wants to report content that exposes personal info, (2) file DMCA/GDPR/privacy takedown requests, (3) bulk report across multiple platforms, (4) track report status.
  Triggers: "report this", "take down", "remove my info", "file complaint", "privacy report", "举报", "删除我的信息", "隐私投诉".
---

# Privacy Report Skill

Automate privacy violation reporting across platforms. Designed to work with Privacy Eraser as a nested skill.

## Workflow

1. **Identify** — Receive URL(s) or content containing privacy violations
2. **Classify** — Determine platform and violation type
3. **Generate** — Create platform-specific report/complaint
4. **Submit** — File the report via platform's reporting mechanism
5. **Track** — Log submission and follow up

## Supported Platforms & Methods

| Platform | Method | Violation Types |
|----------|--------|----------------|
| Google Search | [Removal Request Form](https://support.google.com/websearch/troubleshooter/9685456) | Personal info in search results |
| Google (GDPR) | [GDPR Removal](https://support.google.com/legal/troubleshooter/1114905) | Right to be forgotten |
| Twitter/X | [Privacy Report](https://help.twitter.com/en/forms/privacy) | Unauthorized personal info |
| Facebook/Meta | [Privacy Violation Report](https://www.facebook.com/help/contact/144059062408922) | Photos, personal data exposure |
| Instagram | [Privacy Report](https://help.instagram.com/contact/504521742987441) | Unauthorized images/info |
| LinkedIn | [Privacy Report](https://www.linkedin.com/help/linkedin/ask/TS-NAPR) | Profile impersonation, data misuse |
| Reddit | [Report via /report](https://www.reddit.com/report) | Doxxing, personal info exposure |
| TikTok | [Privacy Report](https://www.tiktok.com/legal/report/privacy) | Unauthorized recording/info |
| YouTube | [Privacy Complaint](https://support.google.com/youtube/answer/142443) | Face/personal info in videos |
| Data Brokers | Direct opt-out per broker | Personal data listings |

## Report Generation

For each platform, generate a report containing:

```
REPORT TEMPLATE:
- Platform: [platform name]
- URL(s): [violating content URLs]
- Violation type: [personal info / unauthorized image / doxxing / other]
- Affected person: [name]
- Description: [clear, factual description of the violation]
- Requested action: [remove content / delist from search / delete account data]
- Legal basis: [GDPR Art.17 / CCPA / Platform ToS / DMCA if applicable]
```

### Key Principles

- Be factual and specific — vague reports get ignored
- Reference the correct legal framework for the user's jurisdiction
- Include screenshot evidence when possible (use browser to capture)
- One report per URL for better tracking
- Follow up if no response within platform's stated SLA

## Data Broker Opt-Out

For data broker removals, use direct opt-out links:

| Broker | Opt-Out |
|--------|---------|
| Spokeo | spokeo.com/optout |
| BeenVerified | beenverified.com/app/optout/search |
| Whitepages | whitepages.com/suppression-requests |
| PeopleFinder | peoplefinder.com/optout |
| Intelius | intelius.com/opt-out |

Procedure: Search for the person → find their listing → submit opt-out with verification email.

## Tracking

Log all submissions to `privacy-reports.json`:

```json
{
  "reports": [
    {
      "id": "PR-001",
      "date": "2026-03-12",
      "platform": "Google",
      "url": "https://...",
      "status": "submitted",
      "method": "GDPR Art.17",
      "response_deadline": "2026-04-12",
      "notes": ""
    }
  ]
}
```

## Integration with Privacy Eraser

This skill is designed to be called by Privacy Eraser after scanning discovers exposed personal information. The flow:

1. Privacy Eraser scans → finds exposed URLs
2. This skill receives the URL list
3. Classifies each by platform
4. Generates and submits reports
5. Returns tracking IDs to Privacy Eraser
