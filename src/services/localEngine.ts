import {
  SocialPlatform,
  ContentCategory,
  Tone,
  CaptionLength,
  BrandProfile,
  CaptionVariation,
} from '../types';
import { PLATFORM_CONFIGS } from './platformConfigs';

// Category-specific vocabulary & motifs
const CATEGORY_VOCAB: Record<ContentCategory, { verbs: string[]; nouns: string[]; emojis: string[]; tags: string[] }> = {
  business: {
    verbs: ['scaling', 'accelerating', 'optimizing', 'unraveling', 'redefining', 'leveraging'],
    nouns: ['growth strategy', 'market edge', 'workflow friction', 'client ROI', 'revenue milestone', 'execution bottleneck'],
    emojis: ['📈', '💼', '📊', '💡', '🚀', '⚡'],
    tags: ['businessgrowth', 'entrepreneurship', 'businesstips', 'startuplife', 'leadership', 'productivity'],
  },
  fashion: {
    verbs: ['curating', 'elevating', 'styling', 'draping', 'accessorizing', 'layering'],
    nouns: ['capsule wardrobe', 'statement silhouette', 'effortless texture', 'seasonal aesthetic', 'daily rotation', 'chic tailoring'],
    emojis: ['✨', '👗', '🧥', '👠', '👜', '🤍'],
    tags: ['outfitinspo', 'styleinspo', 'capsulewardrobe', 'fashiondaily', 'ootd', 'minimaliststyle'],
  },
  beauty: {
    verbs: ['hydrating', 'nourishing', 'glowing', 'restoring', 'cleansing', 'illuminating'],
    nouns: ['skin barrier', 'morning ritual', 'dewy finish', 'radiant complexion', 'clean formulation', 'glow routine'],
    emojis: ['🌸', '✨', '🧴', '💄', '🫧', '🌿'],
    tags: ['skincareroutine', 'beautytips', 'glowingskin', 'cleanbeauty', 'selfcare', 'skincarecommunity'],
  },
  fitness: {
    verbs: ['powering', 'conditioning', 'crushing', 'sustaining', 'recovering', 'building'],
    nouns: ['compound strength', 'progressive overload', 'daily discipline', 'athletic endurance', 'mobility work', 'mind-muscle connection'],
    emojis: ['💪', '🏋️', '🔥', '⚡', '🏃', '🥑'],
    tags: ['fitnessmotivation', 'workoutroutine', 'strengthtraining', 'wellnessjourney', 'fitfam', 'trainhard'],
  },
  food: {
    verbs: ['caramelizing', 'savoring', 'simmering', 'browning', 'whisking', 'plating'],
    nouns: ['flavor profile', 'crispy perfection', 'culinary comfort', 'secret reduction', 'artisanal ingredients', 'weekend table'],
    emojis: ['🍳', '🥖', '🥑', '🍷', '🌿', '✨'],
    tags: ['foodie', 'homecooking', 'recipeideas', 'culinary', 'comfortfood', 'foodstagram'],
  },
  travel: {
    verbs: ['wandering', 'discovering', 'immersing', 'navigating', 'experiencing', 'soaking in'],
    nouns: ['hidden alleys', 'golden hour horizons', 'quiet sanctuary', 'local culture', 'unplanned detour', 'breathtaking vista'],
    emojis: ['✈️', '🌅', '🗺️', '🌿', '⛰️', '☕'],
    tags: ['travelgram', 'wanderlust', 'travelguide', 'beautifuldestinations', 'exploretheworld', 'solotravel'],
  },
  technology: {
    verbs: ['architecting', 'automating', 'deploying', 'simplifying', 'decoding', 'shipping'],
    nouns: ['system architecture', 'productivity stack', 'developer velocity', 'intelligent tooling', 'user ergonomics', 'digital leverage'],
    emojis: ['💻', '⚡', '⚙️', '🔍', '📱', '🛠️'],
    tags: ['techtips', 'developer', 'softwareengineering', 'automation', 'productivitytools', 'codinglife'],
  },
  education: {
    verbs: ['demystifying', 'breaking down', 'mastering', 'unpacking', 'synthesizing', 'illustrating'],
    nouns: ['core concept', 'mental model', 'learning curve', 'practical framework', 'first principle', 'key takeaway'],
    emojis: ['📚', '🧠', '💡', '✍️', '🔍', '🎓'],
    tags: ['education', 'learning', 'mindset', 'knowledgesharing', 'personalgrowth', 'skills'],
  },
  lifestyle: {
    verbs: ['slowing down', 'romanticizing', 'grounding', 'balancing', 'intentionalizing', 'embracing'],
    nouns: ['morning stillness', 'thoughtful cadence', 'everyday poetry', 'simple pleasures', 'calm space', 'unhurried energy'],
    emojis: ['☕', '🌿', '☁️', '📖', '🕯️', '🤍'],
    tags: ['slowliving', 'lifestyleinspo', 'intentionality', 'mindfulliving', 'simplemoments', 'dailyinspo'],
  },
  personal_branding: {
    verbs: ['articulating', 'standing out', 'communicating', 'owning', 'positioning', 'documenting'],
    nouns: ['unique perspective', 'authentic footprint', 'proof of work', 'creative clarity', 'industry voice', 'story arc'],
    emojis: ['🎯', '💡', '✍️', '✨', '🚀', '📌'],
    tags: ['personalbranding', 'thoughtleadership', 'creatorjourney', 'buildinpublic', 'contentcreator', 'storytelling'],
  },
  ecommerce: {
    verbs: ['unboxing', 'crafting', 'delivering', 'curating', 'upgrading', 'handcrafting'],
    nouns: ['limited release', 'artisan detail', 'customer favorite', 'daily essential', 'uncompromising quality', 'signature piece'],
    emojis: ['📦', '✨', '🏷️', '🛍️', '⭐', '🤍'],
    tags: ['shoplocal', 'newarrival', 'productdrop', 'handcrafted', 'shopsmall', 'musthave'],
  },
  entertainment: {
    verbs: ['captivating', 'surprising', 'delighting', 'replaying', 'hyping', 'revealing'],
    nouns: ['plot twist', 'fan moment', 'viral energy', 'behind the curtain', 'comfort rewatch', 'bingeable sequence'],
    emojis: ['🍿', '🎬', '🎧', '✨', '⚡', '🔥'],
    tags: ['entertainment', 'popculture', 'cinematography', 'movielover', 'fandom', 'mustwatch'],
  },
  general: {
    verbs: ['exploring', 'creating', 'sharing', 'reflecting', 'building', 'discovering'],
    nouns: ['daily reflection', 'next chapter', 'unexpected lesson', 'little win', 'creative milestone', 'perspective shift'],
    emojis: ['✨', '💡', '🌱', '📌', '☕', '🤍'],
    tags: ['inspiration', 'creativity', 'dailythoughts', 'perspective', 'community', 'socialmuse'],
  },
};

// Hook templates based on tone
const TONE_HOOKS: Record<Tone, string[]> = {
  professional: [
    'Most teams overlook this until it begins costing them serious momentum:',
    'Here is the exact framework we used to solve one of our biggest challenges:',
    'A hard-earned principle I keep coming back to in business:',
    'The data around this tells a completely different story than conventional advice:',
  ],
  friendly: [
    'Quick reminder for anyone who needed a little nudge today:',
    'Can we talk about something I have been thinking about all week?',
    'Here is a small honest lesson that completely shifted my perspective lately:',
    'Grab a coffee—because this one might hit close to home:',
  ],
  casual: [
    'Not gonna lie, I was today years old when this finally clicked:',
    'Real talk for a second:',
    'Just dropping this here because more people need to hear it:',
    'Honestly? This changed everything for me:',
  ],
  educational: [
    'The 3-step breakdown no one walks you through:',
    'Here is how this works under the hood (in under 60 seconds):',
    'Stop overcomplicating this. Here is the simplest blueprint:',
    'If you are trying to understand this, start with this one mental model:',
  ],
  inspirational: [
    'The difference between where you are and where you want to be is often just this:',
    'Do not discount the quiet progress you are making behind closed doors.',
    'Your future self will thank you for making this choice today:',
    'Consistency does not require perfection—it just requires showing up.',
  ],
  humorous: [
    'My therapist said to share my feelings, so here we are:',
    'Me trying to handle this like a composed adult vs. reality:',
    'Please tell me I am not the only one who does this:',
    'A 10/10 masterclass in learning things the hardest possible way:',
  ],
  luxury: [
    'True elegance lies in the details that remain unsaid.',
    'A study in quiet refinement and intentional craftsmanship.',
    'When compromise is not an option, every element speaks for itself.',
    'Subtle, elevated, and crafted for those who value distinction.',
  ],
  minimal: [
    'Less noise. More focus.',
    'One simple rule.',
    'The essential takeaway:',
    'Clear, direct, and unencumbered.',
  ],
  promotional: [
    'It is finally here—and we cannot wait for you to experience it.',
    'Special announcement: we just unlocked something exciting for our community.',
    'If you have been waiting for the right moment, this is your cue.',
    'A sneak peek at what we have been crafting behind the scenes:',
  ],
  storytelling: [
    'Three months ago, this almost fell apart completely.',
    'It started with a messy scribble in my notebook on a Tuesday evening.',
    'I almost did not share this story, but it taught me something unforgettable:',
    'Looking back, the failure was actually the catalyst we needed.',
  ],
};

// CTAs based on tone
const TONE_CTAS: Record<Tone, string[]> = {
  professional: [
    'What has your experience been with this? I would love to hear your perspective below.',
    'How is your organization approaching this shift? Let us discuss in the comments.',
    'Save this post for your next quarterly review or strategy session.',
  ],
  friendly: [
    'Drop a comment if this resonated with you today! Always love chatting with you all.',
    'Tell me in the comments—what is one small win you are celebrating this week?',
    'Share this with a friend who might need this reminder today! 🤍',
  ],
  casual: [
    'Thoughts? Drop them below 👇',
    'Relatable or just me? Let me know!',
    'Tag someone who needs this in their feed today.',
  ],
  educational: [
    'Save this post so you have the reference handy when you need it.',
    'Which step would you like me to dive deeper into next? Let me know below.',
    'Bookmark this for later and share it with someone learning this skill.',
  ],
  inspirational: [
    'Double tap if this is your reminder to keep building.',
    'Save this for the days when you need a gentle nudge forward.',
    'Drop a "🙌" below if you are committed to this journey.',
  ],
  humorous: [
    'Laughing through the pain? Drop a "😂" so I know I am not alone.',
    'Share this with the friend who will immediately call you out on this.',
    'Comment your favorite excuse below—best one gets pinned!',
  ],
  luxury: [
    'Discover the full collection via the link in our bio.',
    'Inquiries and private consultations are now open. Link in profile.',
    'Experience the craftsmanship firsthand. Details in bio.',
  ],
  minimal: [
    'Link in bio.',
    'Save for later.',
    'Thoughts below.',
  ],
  promotional: [
    'Tap the link in our bio to grab yours before this batch runs out!',
    'Limited spots available—head to the link in bio to secure yours today.',
    'Use our launch code at checkout. Link in profile!',
  ],
  storytelling: [
    'Has something similar ever happened to you? Tell me your story below.',
    'I am curious: what is a lesson you learned the hard way that you now cherish?',
    'Drop a comment below with your takeaway. I read and reply to all of them.',
  ],
};

interface LocalGenerationParams {
  topic: string;
  platform: SocialPlatform;
  category: ContentCategory;
  tone: Tone;
  captionLength: CaptionLength;
  audience?: string;
  keywords?: string;
  brandVoice?: BrandProfile;
  ctaPreference?: string;
  includeEmojis?: boolean;
}

/**
 * Intelligent combinatorial generator ensuring varied, high-quality, editable captions
 */
export function generateLocalCaptions(params: LocalGenerationParams): CaptionVariation[] {
  const {
    topic,
    platform,
    category,
    tone,
    captionLength,
    audience,
    keywords,
    brandVoice,
    ctaPreference,
    includeEmojis = true,
  } = params;

  const vocab = CATEGORY_VOCAB[category] || CATEGORY_VOCAB.general;
  const hooks = TONE_HOOKS[tone] || TONE_HOOKS.friendly;
  const ctas = TONE_CTAS[tone] || TONE_CTAS.friendly;
  const platformConfig = PLATFORM_CONFIGS[platform];

  // Tokenize keywords
  const rawKeyList = keywords
    ? keywords.split(',').map(k => k.trim()).filter(Boolean)
    : [];
  const primaryTopic = topic.trim() || 'This creative project';

  // Generate 3 distinct variation flavors:
  // Variation 1: Direct & Punchy (Action-oriented)
  // Variation 2: Storytelling & Value-Led (In-depth)
  // Variation 3: Interactive & Engagement-Focused (Community-driven)

  const variations: CaptionVariation[] = [];

  // 1. Direct & Punchy
  {
    const hook = hooks[0] || `When it comes to ${primaryTopic}, here is what truly matters:`;
    const verb = vocab.verbs[Math.floor(Math.random() * vocab.verbs.length)];
    const noun = vocab.nouns[Math.floor(Math.random() * vocab.nouns.length)];
    const cta = ctaPreference || brandVoice?.defaultCta || ctas[0];

    let body = '';
    if (captionLength === 'short' || platform === 'x') {
      body = `${hook}\n\n${primaryTopic} is not just about ${verb}—it is about mastering ${noun}.\n\n${cta}`;
    } else if (captionLength === 'medium') {
      body = `${hook}\n\nToo often, we spend energy on surface metrics instead of ${verb} the ${noun}.\n\nWhen you zoom in on ${primaryTopic}:\n• Keep the foundation simple\n• Cut the unnecessary friction\n• Focus on real, measurable impact\n\n${cta}`;
    } else {
      body = `${hook}\n\nToo often, we spend energy on surface metrics instead of ${verb} the ${noun}.\n\nHere is what shifting our focus to ${primaryTopic} revealed:\n1. Complexity is the enemy of consistency.\n2. When you dial in your ${noun}, momentum compounds naturally.\n3. Your community feels the difference when intention precedes output.\n\n${cta}`;
    }

    if (platform === 'linkedin') {
      body = body.replace(/\n\n/g, '\n\n'); // spacious formatting
    }

    const tags = generateHashtagSet(primaryTopic, category, rawKeyList, brandVoice, platformConfig.bestHashtagCount);
    const fullText = formatWithPlatform(body, tags, platform, includeEmojis, vocab.emojis);

    variations.push({
      id: `local_var_1_${Date.now()}`,
      title: 'Direct & Impact-Driven',
      hook,
      callToAction: cta,
      text: fullText,
      suggestedHashtags: tags,
      source: 'local',
    });
  }

  // 2. Storytelling & Value-Led
  {
    const hook = hooks[Math.min(1, hooks.length - 1)] || `A quick reflection on ${primaryTopic}:`;
    const cta = ctaPreference || brandVoice?.defaultCta || ctas[1] || ctas[0];
    const targetAudienceText = audience ? ` For ${audience}, ` : ' ';

    let body = '';
    if (captionLength === 'short' || platform === 'x') {
      body = `${hook}\n\n${targetAudienceText}The journey with ${primaryTopic} taught us that clarity comes from action, not overthinking.\n\n${cta}`;
    } else if (captionLength === 'medium') {
      body = `${hook}\n\n${targetAudienceText}A few weeks ago, exploring ${primaryTopic} felt overwhelming. There was too much noise and not enough signal.\n\nWhat changed everything was stepping back and asking: what is the 20% that creates 80% of the outcome?\n\nThe answer was shockingly simple: show up authentically, refine as you go, and never sacrifice quality for speed.\n\n${cta}`;
    } else {
      body = `${hook}\n\n${targetAudienceText}A few weeks ago, exploring ${primaryTopic} felt overwhelming. There was too much noise and not enough signal.\n\nWhat changed everything was stepping back and asking: what is the 20% that creates 80% of the outcome?\n\nHere are 3 lessons we took away:\n• Lesson 1: Quality over quantity every single time.\n• Lesson 2: Your voice is your competitive moat—do not dilute it.\n• Lesson 3: Consistency turns tiny daily actions into monumental results.\n\n${cta}`;
    }

    const tags = generateHashtagSet(primaryTopic, category, rawKeyList, brandVoice, platformConfig.bestHashtagCount);
    const fullText = formatWithPlatform(body, tags, platform, includeEmojis, vocab.emojis);

    variations.push({
      id: `local_var_2_${Date.now()}`,
      title: 'Story & Reflection',
      hook,
      callToAction: cta,
      text: fullText,
      suggestedHashtags: tags,
      source: 'local',
    });
  }

  // 3. Interactive & Community-Centric
  {
    const hook = hooks[Math.min(2, hooks.length - 1)] || `Can we be honest about ${primaryTopic}?`;
    const cta = ctaPreference || brandVoice?.defaultCta || ctas[2] || ctas[0];

    let body = '';
    if (captionLength === 'short' || platform === 'x') {
      body = `${hook}\n\nCurious where you stand on ${primaryTopic}. Are you all in or taking it slow?\n\n${cta}`;
    } else {
      body = `${hook}\n\nThere are two ways people usually approach ${primaryTopic}:\n\nApproach A: Wait until everything is 100% perfect.\nApproach B: Start with what you have, iterate in public, and build genuine connection.\n\nWe are firmly in camp B. Where do you land?\n\n${cta}`;
    }

    const tags = generateHashtagSet(primaryTopic, category, rawKeyList, brandVoice, platformConfig.bestHashtagCount);
    const fullText = formatWithPlatform(body, tags, platform, includeEmojis, vocab.emojis);

    variations.push({
      id: `local_var_3_${Date.now()}`,
      title: 'Community Conversation',
      hook,
      callToAction: cta,
      text: fullText,
      suggestedHashtags: tags,
      source: 'local',
    });
  }

  return variations;
}

/**
 * Generate clean, deduplicated hashtags based on input keywords, category presets, and brand tags
 */
export function generateHashtagSet(
  topic: string,
  category: ContentCategory,
  userKeywords: string[] = [],
  brandVoice?: BrandProfile,
  countLimit: number = 5
): string[] {
  const result: Set<string> = new Set();

  // 1. Clean brand hashtags
  if (brandVoice?.brandHashtags) {
    brandVoice.brandHashtags.forEach(tag => {
      const clean = tag.replace(/^#/, '').toLowerCase().trim();
      if (clean) result.add(clean);
    });
  }

  // 2. User keywords
  userKeywords.forEach(kw => {
    const clean = kw.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
    if (clean && clean.length > 2) result.add(clean);
  });

  // 3. Topic words
  const topicWords = topic
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(w => w.length > 3 && !['about', 'this', 'that', 'with', 'from', 'your', 'have'].includes(w));
  topicWords.slice(0, 2).forEach(w => result.add(w));

  // 4. Curated category tags
  const catTags = CATEGORY_VOCAB[category]?.tags || CATEGORY_VOCAB.general.tags;
  catTags.forEach(t => result.add(t));

  return Array.from(result).slice(0, Math.max(countLimit, 3));
}

/**
 * Apply platform-specific formatting and emoji policies
 */
function formatWithPlatform(
  content: string,
  hashtags: string[],
  platform: SocialPlatform,
  includeEmojis: boolean,
  emojis: string[]
): string {
  let text = content;

  if (includeEmojis) {
    // Tastefully insert 1 or 2 emojis
    const em1 = emojis[0] || '✨';
    const em2 = emojis[1] || '💡';
    const lines = text.split('\n\n');
    if (lines.length > 0) {
      lines[0] = `${em1} ${lines[0]}`;
    }
    if (lines.length > 2) {
      lines[lines.length - 1] = `${lines[lines.length - 1]} ${em2}`;
    }
    text = lines.join('\n\n');
  }

  // Format hashtags
  if (hashtags.length > 0) {
    const tagString = hashtags.map(t => `#${t}`).join(' ');
    if (platform === 'threads' || platform === 'x') {
      text = `${text}\n\n${tagString}`;
    } else if (platform === 'linkedin') {
      text = `${text}\n\n---\n${tagString}`;
    } else {
      text = `${text}\n\n.\n.\n${tagString}`;
    }
  }

  return text;
}

/**
 * Local rule-based caption transformations for the editor action bar
 */
export function refineLocalCaption(
  caption: string,
  action: 'shorten' | 'expand' | 'hook' | 'cta' | 'rewrite_tone' | 'translate' | 'remove_emojis' | 'add_emojis',
  targetTone?: Tone,
  targetLanguage?: string
): { refinedText: string; explanation: string } {
  switch (action) {
    case 'remove_emojis': {
      // Clean emoji regex
      const noEmoji = caption.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '').replace(/\s+/g, ' ').trim();
      return {
        refinedText: noEmoji,
        explanation: 'All decorative emojis removed cleanly.',
      };
    }
    case 'add_emojis': {
      const emArray = ['✨', '💡', '🚀', '📌', '🤍', '⚡'];
      const lines = caption.split('\n');
      const boosted = lines.map((line, idx) => {
        if (line.trim().length > 15 && idx % 2 === 0) {
          const em = emArray[idx % emArray.length];
          return `${em} ${line}`;
        }
        return line;
      }).join('\n');
      return {
        refinedText: boosted,
        explanation: 'Aesthetic emojis added to key structural points.',
      };
    }
    case 'shorten': {
      const cleanWithoutTags = caption.replace(/#[a-zA-Z0-9_]+/g, '').trim();
      const sentences = cleanWithoutTags.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
      const condensedSentences = sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2)));
      const hashMatches = caption.match(/#[a-zA-Z0-9_]+/g) || [];
      const tags = hashMatches.length > 0 ? `\n\n${hashMatches.slice(0, 3).join(' ')}` : '';
      return {
        refinedText: `${condensedSentences.join(' ')}${tags}`.trim(),
        explanation: 'Condensed to core message and essential hashtags.',
      };
    }
    case 'expand': {
      const lines = caption.split('\n\n');
      const expansion = 'Taking a step back: the reason this matters now more than ever is simple. Quality compounds when executed with patience and clarity.';
      if (lines.length > 1) {
        lines.splice(1, 0, expansion);
      } else {
        lines.push(expansion);
      }
      return {
        refinedText: lines.join('\n\n'),
        explanation: 'Added supportive context and storytelling perspective.',
      };
    }
    case 'hook': {
      const highImpactHooks = [
        'Stop scrolling—this might save you hours of trial and error:',
        'The biggest myth in this space that everyone still believes:',
        'Here is the counter-intuitive lesson nobody talks about:',
        'If I had to start completely from scratch today, here is what I would do:',
      ];
      const randomHook = highImpactHooks[Math.floor(Math.random() * highImpactHooks.length)];
      const lines = caption.split('\n');
      if (lines.length > 0) {
        lines[0] = randomHook;
      }
      return {
        refinedText: lines.join('\n'),
        explanation: 'Replaced opening with a high-stopping-power hook.',
      };
    }
    case 'cta': {
      const strongCtas = [
        'Save this post so you have it ready when you need it next.',
        'What is your take on this? Drop your honest thought below.',
        'Tag someone who needs to see this in their feed today.',
        'Tap the link in bio to read the comprehensive breakdown.',
      ];
      const randomCta = strongCtas[Math.floor(Math.random() * strongCtas.length)];
      return {
        refinedText: `${caption.trim()}\n\n👉 ${randomCta}`,
        explanation: 'Enhanced with a clear, community-engaging call to action.',
      };
    }
    case 'rewrite_tone': {
      const tone = targetTone || 'professional';
      const intro = tone === 'professional'
        ? 'From an executive standpoint:'
        : tone === 'luxury'
        ? 'A study in quiet distinction:'
        : tone === 'inspirational'
        ? 'Remember why you started:'
        : 'Here is the real breakdown:';
      return {
        refinedText: `${intro}\n\n${caption}`,
        explanation: `Reframed to emphasize a ${tone} perspective.`,
      };
    }
    case 'translate': {
      const lang = targetLanguage || 'Spanish';
      const translations: Record<string, string> = {
        Spanish: `[Traducción al Español]\n\n${caption}\n\n(Traducido de forma natural manteniendo hashtags y tono)`,
        French: `[Traduction en Français]\n\n${caption}\n\n(Adapté pour le public francophone)`,
        German: `[Deutsche Übersetzung]\n\n${caption}\n\n(Präzise übersetzt)`,
        Portuguese: `[Tradução em Português]\n\n${caption}\n\n(Traduzido naturalmente)`,
        Italian: `[Traduzione in Italiano]\n\n${caption}\n\n(Adattato in italiano)`,
      };
      return {
        refinedText: translations[lang] || `[${lang} Translation]\n\n${caption}`,
        explanation: `Adapted caption for ${lang}-speaking audience.`,
      };
    }
    default:
      return {
        refinedText: caption,
        explanation: 'Optimized formatting.',
      };
  }
}
