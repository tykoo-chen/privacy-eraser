---
name: privacy-eraser
description: |
  End-to-end privacy protection: discover exposed personal info, request removal politely, then escalate to formal reports if ignored.
  Orchestrates two sub-skills: personalized-outreach (friendly DM first) and privacy-report (formal complaint if no action).
  Use when: (1) user wants personal info removed from the internet, (2) found doxxing or data exposure, (3) data broker cleanup, (4) ongoing privacy monitoring.
  Triggers: "remove my info", "clean up my privacy", "privacy eraser", "someone posted my info", "删除我的信息", "隐私清理", "有人泄露了我的信息".
---

# Privacy Eraser

End-to-end privacy protection through a two-phase approach: **ask nicely first, escalate if ignored.**

## Core Philosophy

Most people will remove content when asked politely. Formal reports are slow, adversarial, and should be the last resort. This skill always tries diplomacy first.

## Orchestration Flow

```
[Discovery] → [Phase 1: Outreach] → [Wait] → [Phase 2: Report]
                    ↓                              ↓
           personalized-outreach              privacy-report
              (friendly DM)               (formal complaint)
```

### Phase 0: Discovery

Input: User provides one of:
- Their name / identifiers to scan for
- Specific URLs where their info is exposed
- A previous scan result

For each discovered exposure, create a case:

```json
{
  "case_id": "PE-001",
  "target_url": "https://...",
  "platform": "twitter",
  "violation_type": "personal_info_exposed",
  "content_owner": "@username or site admin",
  "discovered_at": "2026-03-12T14:00:00Z",
  "phase": "discovery",
  "status": "new"
}
```

Save all cases to `privacy-eraser-cases.json`.

### Phase 1: Friendly Outreach (personalized-outreach)

For each case, invoke `personalized-outreach` with this context:

**Goal:** Request content removal in a friendly, non-threatening way.

**Message strategy:**
- Acknowledge the person — don't be aggressive
- Explain what personal info is exposed and why it matters
- Make a clear, specific ask (remove X from Y)
- Offer to help (provide exact content to remove)
- Mention that formal channels exist, but you'd prefer to resolve it directly
- Set a soft deadline without being threatening

**Tone templates by platform:**

**Individual poster (Twitter/Reddit/etc):**
> "Hi — I noticed [specific post/content] contains my [personal info type]. I'd really appreciate if you could remove/redact that. Happy to help point out exactly what needs changing. Thanks!"

**Website/data broker:**
> "Hi, I'm writing to request removal of my personal information from [URL]. Under [GDPR Art.17 / CCPA / applicable law], I'd like to exercise my right to deletion. The specific data is: [list]. Please confirm removal within a reasonable timeframe."

**Company/organization:**
> "Hello, I'm reaching out regarding personal data published at [URL]. I'd like to request its removal. I believe this was unintentional, and I'd appreciate a quick resolution before I need to pursue formal channels."

After sending, update case:
```json
{
  "phase": "outreach_sent",
  "outreach_sent_at": "2026-03-12T14:30:00Z",
  "escalation_deadline": "2026-03-13T02:30:00Z",
  "message_sent": "..."
}
```

### Phase 2: Monitoring & Escalation

**Check at +12 hours** after outreach:

1. **Content removed?** → Mark case as `resolved`. Done.
2. **Response received, in progress?** → Extend deadline. Update notes.
3. **No response / refused?** → Escalate to Phase 3.

Use a cron job or heartbeat check to monitor:
```
For each case where phase == "outreach_sent":
  if now > escalation_deadline:
    check if content still exists
    if still exists → escalate
    if removed → mark resolved
```

### Phase 3: Formal Report (privacy-report)

For unresolved cases, invoke `privacy-report`:

- Generate formal complaint using platform's official reporting mechanism
- Include evidence: original URL, screenshot, outreach attempt record
- Reference the friendly outreach attempt (shows good faith)
- File under appropriate legal framework (GDPR/CCPA/platform ToS)

Update case:
```json
{
  "phase": "reported",
  "reported_at": "2026-03-13T03:00:00Z",
  "report_id": "PR-001",
  "report_method": "Google GDPR removal form"
}
```

### Phase 4: Follow-Up

After formal report:
- Check every 7 days if content is removed
- If platform provides a response, log it
- If no action after 30 days, notify user with options:
  - Re-file complaint
  - Contact data protection authority (DPA)
  - Consider legal action

## Case Lifecycle

```
new → outreach_sent → [resolved | escalated]
                          ↓
                      reported → [resolved | follow_up | dpa_complaint]
```

## Status Dashboard

When user asks for status, display:

```
Privacy Eraser — Active Cases
─────────────────────────────
PE-001  twitter.com/xxx/123    Phase 1 (DM sent 2h ago)     ⏳
PE-002  spokeo.com/john-doe    Phase 2 (reported to Spokeo)  📋
PE-003  reddit.com/r/xxx/456   Resolved (removed by user)    ✅
PE-004  example-blog.com/post  Escalation in 10h             ⏰
```

## Sub-Skill Dependencies

This skill requires two companion skills to be installed:
- `personalized-outreach` — handles Phase 1 friendly messaging
- `privacy-report` — handles Phase 3 formal reporting

If either is missing, Privacy Eraser will note which phase cannot execute and suggest installing the missing skill.
