# SocialMuse Studio — Premium Android Social Media Toolkit

SocialMuse Studio is a production-grade, offline-first mobile productivity application tailored for content creators, social media managers, and small businesses to generate, refine, organize, schedule, and export platform-tailored social media content.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed User Preferences (Phase 1 Alignment)**:
> - **Interface Mode**: Adaptive mobile shell with an optional simulated Android device frame toggle (enabling testing both within an authentic phone container with status/navigation bars and in an edge-to-edge responsive layout).
> - **Generation Engine**: Hybrid mode — an immediate, zero-latency local rule-and-template engine operating offline by default, seamlessly complemented by an optional server-side Gemini 3.8 Flash AI enhancement pipeline.
> - **Initial Starter Content**: Pre-seeded multi-niche starter pack featuring realistic brand profiles, templates, hashtags, and drafts across Business, Lifestyle, Tech, Fitness, and E-Commerce.

---

## 1. Overview & Core Concept

- **What It Does**: SocialMuse Studio empowers creators to craft platform-optimized social media posts (for Instagram, TikTok, LinkedIn, X, YouTube, Facebook, Threads, and Pinterest). It includes a multi-factor caption creator, smart hashtag discovery & grouping, reusable brand voice profiles, visual calendar planning, bulk generation, and multi-format exports (TXT, CSV, clipboard, and Web Sharesheet).
- **Target Audience**: Content creators, solo founders, social media managers, agency copywriters, and influencers needing rapid, brand-consistent content without subscription lock-ins or mandatory internet access.
- **Key Value**: 100% functional without an API key or account, with authentic Android Material 3 and glassmorphism styling, zero mock data, real local persistence, and honest engine labeling.

---

## 2. User Experience & Visual Design

### Visual Identity & Glassmorphism Design System
- **Color Palette**:
  - Neutral Canvas: Warm Ivory (`#F8F7FC`), Dark Slate Canvas (`#14131D`)
  - Primary Typography: Deep Obsidian (`#29283A`), Optical White (`#F3F2FA`)
  - Secondary Typography: Muted Heather (`#77758A`), Cool Slate (`#9D9AB4`)
  - Glass Pastel Accents:
    - Lavender: `#DCD5FA` (Primary brand accent, tabs, active states)
    - Soft Pink: `#F7DCE8` (Highlights, inspiration, consumer categories)
    - Mint: `#D7F0E3` (Published status, success, verified states)
    - Powder Blue: `#DCEBFA` (Tech, LinkedIn, professional tone)
    - Peach: `#F9E3D3` (Engagement hooks, calendar reminders)
- **Glassmorphism Spec**:
  - Translucent surfaces (`bg-white/75 dark:bg-[#1C1B2A]/75 backdrop-blur-md`)
  - Thin 1px translucent borders (`border border-white/60 dark:border-white/10`)
  - Soft ambient shadows (`shadow-sm` and `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`)
  - Consistent radius scale: `rounded-2xl` (16px) for item rows, `rounded-3xl` (24px) for cards/sheets, `rounded-full` for interactive pill controls
- **Anti-AI Slop & Restraint**:
  - Zero static pill badges for metadata (clean typographic separators `·` and `/`)
  - No fake AI scores or arbitrary percentages
  - Clear, honest engine tagging: `"Generated via Local Rule Engine"` vs `"Enhanced by Gemini 3.8 Flash"`
  - WCAG AA compliant contrast for all text over translucent glass surfaces

### Core Navigation (5 Primary Tabs)
1. **Home**: Daily productivity overview, quick action tiles, recent drafts, upcoming planned posts, active brand profile, and real local creation metrics.
2. **Create**: Dual-mode caption engine (single or bulk), platform selector with live character counters, tone/category matrix, length sliders, brand voice injection, and action toolbar (shorten, expand, hook boost, rewrite, translate, emoji toggle).
3. **Library**: Filterable & searchable drafts and templates with multi-select, favorites, tags, duplication, and bulk export.
4. **Calendar**: Monthly & weekly interactive planning calendar, status workflows (`Idea` -> `Draft` -> `Planned` -> `Published` -> `Archived`), and post detail sheet.
5. **Profile & Settings**: Brand Voice Profile manager, hashtag group manager, theme switcher (Light / Dark / System), accent picker, data import/export (JSON backup), and AI provider status.

---

## 3. Key Product Decisions & Trade-Offs

- **Persistence Layer**:
  - *Chosen Approach*: Robust browser persistence using a structured LocalStorage + IndexedDB repository pattern mirroring Android's Room DB and DataStore.
  - *Why*: Immediate zero-latency startup, full offline resilience, no mandatory backend login or user tracking, and seamless export/import backup capability.
- **Generation Architecture**:
  - *Chosen Approach*: Multi-tier generation pipeline.
    1. *Tier 1 (Instant Local)*: High-entropy combinatorial template engine utilizing platform rules, category lexicons, hook structures, and CTA libraries.
    2. *Tier 2 (Server-Side Gemini 3.8 Flash)*: When connected and requested, performs high-fidelity semantic rewriting, cross-language translation, and audience adaptation via a secure `/api/ai/*` Express route.
  - *Why*: The application is never broken when offline or when keys are absent, honoring the prompt's mandate.
- **Android Shell & Viewport**:
  - *Chosen Approach*: Adaptive container featuring an Android device chrome toggle (status bar with time/battery/signal + navigation gesture pill), gracefully expanding into a polished responsive touch app on widescreen devices.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SocialMuse Studio App Shell                     │
│  [Android Device Frame Toggle | Light/Dark Theme | Safe-Area Bars]     │
├────────────────────────────────────────────────────────────────────────┤
│                           Navigation Stack                             │
│  [Home]   [Create Engine]   [Drafts/Templates]   [Calendar]  [Profile] │
├────────────────────────────────────────────────────────────────────────┤
│                             Feature Views                              │
│  • HomeDashboard     • CaptionEditor       • HashtagToolkit            │
│  • BulkGenerator     • ContentCalendar     • BrandVoiceManager         │
│  • TemplateLibrary   • DraftManager        • SettingsScreen            │
├────────────────────────────────────────────────────────────────────────┤
│                      Domain & Repository Services                      │
│  ┌───────────────────────────┐      ┌───────────────────────────────┐  │
│  │ Local Generation Engine   │      │   Gemini API Server Proxy     │  │
│  │ (Rule/Lexicon/Templates)  │      │   (/api/ai/generate & refine) │  │
│  └─────────────┬─────────────┘      └──────────────┬────────────────┘  │
│                └──────────────┬────────────────────┘                   │
│                               ▼                                        │
│               Storage Engine (Room/DataStore Adapter)                  │
│       [Drafts] [Templates] [Brands] [Hashtags] [Calendar] [Settings]   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema (Core TypeScript Interfaces)
- `Draft`: `id`, `title`, `content`, `platform`, `category`, `tone`, `hashtags`, `brandProfileId`, `characterCount`, `isFavorite`, `status`, `createdAt`, `updatedAt`, `source` (`'local'` | `'ai'`).
- `BrandProfile`: `id`, `name`, `description`, `targetAudience`, `tone`, `vocabulary`, `wordsToAvoid`, `defaultCta`, `defaultPlatforms`, `brandHashtags`.
- `HashtagGroup`: `id`, `name`, `category`, `hashtags`, `isFavorite`, `brandProfileId`.
- `CalendarPost`: `id`, `draftId`, `scheduledDate`, `time`, `platform`, `status` (`'idea'` | `'draft'` | `'planned'` | `'published'` | `'archived'`), `campaign`, `notes`.
- `Template`: `id`, `title`, `category`, `description`, `templateText`, `suggestedTone`, `platforms`, `placeholders`, `isFavorite`, `isCustom`.
- `UserSettings`: `theme`, `accentColor`, `defaultPlatform`, `defaultTone`, `defaultLength`, `hapticsEnabled`, `deviceFrameEnabled`.

---

## 5. Implementation Sequence & Milestones

1. **Project Setup & Theming**: Configure Tailwind tokens for the pastel glassmorphic palette, typography, Android system icons, and base utility helpers.
2. **Storage & Data Layer**: Implement `storage.ts` with typed CRUD operations, pre-seeded comprehensive multi-niche database, and export/import validation.
3. **Local & AI Generation Engine**:
   - Build rule-based generator with realistic hooks, category vocabulary, and platform constraints.
   - Configure Express server endpoint for Gemini 3.8 Flash (`@google/genai`) with fallback handling.
4. **Core UI Modules**:
   - Home Dashboard with real local stats and quick actions.
   - Caption Creator with live character counters, variation generator, and adjustment tools.
   - Hashtag Discovery and Collection Manager.
   - Bulk Content Generator with table/card review and CSV/TXT export.
   - Content Calendar with month/week views, drag/click scheduling, and status pipeline.
   - Brand Voice Manager and Template Library.
5. **Documentation & Release Artifacts**: Create README.md, INSTALLATION.md, BUILD_AND_RELEASE.md, PRIVACY.md, CHANGELOG.md, and LICENSE.md.
6. **Quality Assurance & Verification**: Run linting, TypeScript compilation, verify offline behavior, responsive layout scaling, and ensure all buttons and transitions operate reliably.
