---
name: personalized-outreach
description: |
  Analyze a person's public content across platforms and craft personalized DMs/messages.
  Reads their posts, interests, writing style, and recent activity to generate contextually relevant outreach messages.
  Use when: (1) sending cold DMs to potential partners/investors/collaborators, (2) personalized outreach campaigns, (3) BD/sales messaging, (4) recruiting outreach.
  Triggers: "send DM", "write a message to", "reach out to", "cold outreach", "personalized message", "私信", "发消息给", "定制化私信".
---

# Personalized Outreach Skill

Craft hyper-personalized messages by analyzing a target's public content. No generic templates — every message is tailored.

## Workflow

### Step 1: Profile Analysis

Given a target (URL, username, or name + platform):

1. **Gather content** — Fetch recent public posts, bio, pinned content
2. **Extract signals**:
   - Topics they care about (what they post/repost)
   - Writing style (formal/casual, emoji usage, language)
   - Recent activity (what they're working on NOW)
   - Pain points or interests expressed
   - Mutual connections or shared interests with sender
3. **Build profile summary**:

```
TARGET PROFILE:
- Name: [name]
- Platform: [platform]
- Role/Bio: [extracted from profile]
- Key interests: [top 3-5 topics]
- Recent focus: [what they've been posting about lately]
- Style: [formal/casual/technical/meme-heavy]
- Language: [primary language]
- Best hook: [specific post/topic to reference]
```

### Step 2: Message Generation

Generate 2-3 message variants based on the profile:

**Principles:**
- Open with something specific to THEM (not you)
- Reference a recent post or shared interest — show you actually looked
- Keep it short (3-5 sentences max for DMs)
- One clear ask or value proposition
- Match their communication style
- No cringe corporate speak
- No "I hope this message finds you well"

**Message Structure:**
```
[Hook — reference their specific content/interest]
[Bridge — connect to why you're reaching out]
[Value — what's in it for them]
[CTA — one simple, low-friction ask]
```

**Example:**

Target posted about AI agents in crypto:
> "看到你之前写的那篇关于 AI agent 自动交易的分析，特别是关于风控那部分，跟我们在做的方向很像。我们刚上线了一个隐私保护工具，想聊聊有没有合作的可能？方便的话这周 15 分钟 call？"

### Step 3: Review & Send

1. Present drafts to user for review
2. User picks/edits preferred version
3. Send via platform (if API available) or copy for manual send
4. Log outreach in tracking file

## Platform-Specific Notes

| Platform | DM Limits | Tips |
|----------|-----------|------|
| Twitter/X | Must follow or have open DMs | Check DM settings first; consider reply + DM combo |
| LinkedIn | InMail or connection request + note | Keep connection note under 300 chars |
| Instagram | May land in "requests" folder | Follow first, engage with a post, then DM |
| 小红书 | Limited DM for new accounts | Comment first to warm up |
| Telegram | Need username | Direct DM works if privacy settings allow |
| Email | No hard limit | Subject line is everything |

## Anti-Spam Guidelines

- **Max 10-15 personalized DMs per day** per platform — more = spam behavior
- **Space them out** — not all at once
- **Never copy-paste the same message** — that's what this skill prevents
- **Don't follow up more than twice** — respect silence
- **Stop if someone says no** — obvious but important

## Tracking

Log all outreach to `outreach-log.json`:

```json
{
  "outreach": [
    {
      "id": "OUT-001",
      "date": "2026-03-12",
      "target": "@username",
      "platform": "twitter",
      "message_sent": "...",
      "status": "sent",
      "response": null,
      "follow_up_date": "2026-03-15"
    }
  ]
}
```

## Batch Mode

For campaigns targeting multiple people:

1. Provide a list of targets (URLs or usernames)
2. Skill analyzes each profile in sequence
3. Generates personalized messages for each
4. Presents all drafts for review
5. Sends approved messages with spacing

Always present drafts for human review before sending — no auto-fire.
