# SocialMuse Studio 📱✨

**SocialMuse Studio** is a 100% free, open-source, offline-first mobile productivity application designed for content creators, social media managers, influencers, and small businesses to generate, refine, organize, plan, and export platform-tailored social media content without any paywalls, subscriptions, or fees.

---

## 🆓 100% Free & Unrestricted

- **Zero Subscriptions or Paywalls**: Every single tool, template, brand voice profile, export feature, and refinement is completely free and unlocked.
- **No Monetization Gates**: No artificial usage quotas or feature locks.
- **Local Engine**: The built-in rules & template generation engine is 100% free with unlimited runs, zero latency, and zero internet required.
- **Optional Gemini AI**: External AI inference via Gemini 3.8 Flash is available through the server-side proxy when configured with an API key (external usage follows Google's developer terms and quotas).

## 🎨 Premium Glassmorphism Design System

SocialMuse Studio is designed following Android's **Material 3** principles layered with a frosted-glass editorial aesthetic:

- **Neutral Canvas**: Warm Ivory (`#F8F7FC`) for light mode, Obsidian Slate (`#12111A`) for dark mode.
- **Glass Pastel Accents**:
  - **Lavender** (`#DCD5FA`): Primary brand accent, active tabs, and navigation anchors.
  - **Soft Pink** (`#F7DCE8`): Creative categories, lifestyle inspiration, and highlights.
  - **Mint** (`#D7F0E3`): Success feedback, published post badges, and hashtag collections.
  - **Powder Blue** (`#DCEBFA`): Professional tone, LinkedIn formatting, and bulk generator workflows.
  - **Peach** (`#F9E3D3`): Engagement hooks, reminders, and template placeholders.
- **Surface Geometry**: Frosted glass panels with `backdrop-blur-md`, subtle hairline borders (`border-white/60`), and rounded cards (`rounded-3xl` / 24dp).
- **Anti-AI Slop Discipline**: Zero static metadata pill boxes, no arbitrary fake percentage scores, and honest labeling of generation sources.

---

## 🚀 Core Features

### 1. ✍️ Multi-Platform Caption Studio
- Tailored presets for **Instagram, TikTok, LinkedIn, X (Twitter), YouTube, Facebook, Threads, and Pinterest**.
- Generates 3 distinct variations per concept:
  - *Direct & Impact-Driven*
  - *Story & Reflection*
  - *Community Conversation*
- Real-time character counters with platform-specific limit warnings.
- Instant 1-tap refinements:
  - **Make Shorter** / **Expand**
  - **Boost Hook** (Pattern-interrupt opening sentences)
  - **Improve CTA** (Community engagement prompts)
  - **Add / Remove Emojis**
  - **Tone Shifts** (Professional, Luxury, Casual, Inspirational)
  - **Language Adaptation** (Multilingual translations)

### 2. ⚡ Hybrid Generation Engine (100% Offline-Capable)
- **Local Rules & Combinatorial Engine**: High-entropy, offline-first generator that produces diverse, authentic copy without any internet connection, subscriptions, or API keys.
- **Optional Gemini 3.8 Flash AI Integration**: Full-stack server proxy (`/api/ai/generate` and `/api/ai/refine`) that connects to Gemini 3.8 Flash when keys are present.

### 3. #️⃣ Hashtag Discovery & Collection Toolkit
- Discover topic-based hashtags categorized into **Broad**, **Niche**, **Industry**, and **Campaign** buckets.
- Save custom hashtag packs and associate them with brand voice profiles.
- Automatic duplicate removal and formatting normalization.
- Multi-group merging into consolidated collections.
- Export to TXT and CSV.

### 4. 🗂️ Brand Voice Manager
- Create multiple brand profiles (e.g. *Aura Wellness*, *Apex Systems*, *Sol Modern*, *Roast & Relic*).
- Define audience, tone, signature vocabulary, words to avoid, default CTAs, and preferred platforms.
- Quickly switch the active brand voice from the top bar across any screen.

### 5. 📦 Bulk Content Generator
- Input batch topics (1 per line).
- Concurrently generate dozens of tailored posts with live progress feedback.
- Independently edit each generated post before saving.
- Bulk export directly to CSV or batch save into the Draft Library.

### 6. 📅 Publishing & Planning Calendar
- Monthly interactive planning calendar.
- Post status workflow: `Idea` ➔ `Draft` ➔ `Planned` ➔ `Published` ➔ `Archived`.
- Date and time pickers with campaign tagging and internal production notes.

### 7. 📚 Reusable Template Library
- 16+ pre-seeded templates across product launches, storytelling, testimonials, LinkedIn thought leadership, recipes, travel, and fitness.
- Interactive variable filler modal that replaces placeholders (e.g. `[PRODUCT_NAME]`) and loads ready-to-use copy into the editor.

### 8. 🔒 Privacy & Portability
- Local persistence using browser storage (mirroring Android Room DB and DataStore).
- Full JSON backup export and restore.
- CSV data export with RFC-4180 escaping.
- Zero tracking or telemetry.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend / Proxy**: Node.js, Express, tsx, `@google/genai` TypeScript SDK.
- **Mobile UX**: Android Material 3 container with toggleable phone casing, status bar, and navigation gesture pill.

---

## 📄 License

Distributed under the MIT License. See `LICENSE.md` for more information.
