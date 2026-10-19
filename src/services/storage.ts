import {
  Draft,
  BrandProfile,
  HashtagGroup,
  CalendarPost,
  ContentTemplate,
  UserSettings,
  PostStatus,
} from '../types';

const STORAGE_KEYS = {
  DRAFTS: 'socialmuse_drafts_v1',
  BRANDS: 'socialmuse_brands_v1',
  HASHTAGS: 'socialmuse_hashtags_v1',
  CALENDAR: 'socialmuse_calendar_v1',
  TEMPLATES: 'socialmuse_templates_v1',
  SETTINGS: 'socialmuse_settings_v1',
};

// Initial Seed Data - Comprehensive Multi-Niche Pack
const SEED_BRANDS: BrandProfile[] = [
  {
    id: 'brand_aura',
    name: 'Aura Wellness Studio',
    description: 'Holistic health, mindful morning rituals, and sustainable living for conscious urbanites.',
    targetAudience: 'Conscious professionals and creatives aged 24-42 seeking calm and balance.',
    tone: 'inspirational',
    language: 'English',
    vocabulary: ['intentional', 'grounding', 'nourishing', 'serene', 'mindful', 'radiance'],
    wordsToAvoid: ['hustle', 'grind', 'crazy cheap', 'urgent', 'buy now or cry'],
    emojiPreference: 'tasteful',
    defaultCta: 'Save this post for your quiet morning ritual, or share with someone needing peace today. 🌿',
    defaultPlatforms: ['instagram', 'pinterest', 'threads'],
    brandHashtags: ['aurawellness', 'mindfulliving', 'groundedroutines'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'brand_apex',
    name: 'Apex Systems',
    description: 'B2B developer productivity platform enabling rapid cloud engineering and zero-friction CI/CD.',
    targetAudience: 'Senior software engineers, CTOs, tech leads, and DevOps practitioners.',
    tone: 'professional',
    language: 'English',
    vocabulary: ['throughput', 'latency', 'resilience', 'developer velocity', 'architecture', 'scalability'],
    wordsToAvoid: ['easy peasy', 'magical', 'super duper', 'cheap'],
    emojiPreference: 'none',
    defaultCta: 'How is your team reducing deployment bottlenecks? Read the full engineering breakdown in our bio.',
    defaultPlatforms: ['linkedin', 'x'],
    brandHashtags: ['apexsystems', 'devops', 'softwareengineering'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'brand_sol',
    name: 'Sol Modern',
    description: 'Minimalist sustainable apparel and capsule wardrobe essentials crafted in organic linen and wool.',
    targetAudience: 'Design-forward minimalists and fashion enthusiasts investing in high-longevity garments.',
    tone: 'luxury',
    language: 'English',
    vocabulary: ['sculptural', 'capsule', 'organic texture', 'understated', 'distinction', 'heritage'],
    wordsToAvoid: ['fire sale', 'mass production', 'hype beast', 'insane discount'],
    emojiPreference: 'tasteful',
    defaultCta: 'Explore the autumn capsule release via the link in our bio.',
    defaultPlatforms: ['instagram', 'pinterest', 'tiktok'],
    brandHashtags: ['solmodern', 'minimalfashion', 'capsulewardrobe'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'brand_roast',
    name: 'Roast & Relic Coffee',
    description: 'Single-origin specialty micro-roastery delivering ethically sourced beans with distinct terroir notes.',
    targetAudience: 'Coffee geeks, home baristas, and brunch lovers obsessed with tasting notes.',
    tone: 'friendly',
    language: 'English',
    vocabulary: ['tasting notes', 'clarity', 'washed process', 'natural sweetness', 'morning brew', 'crema'],
    wordsToAvoid: ['instant coffee', 'bitter sludge', 'corporate blend'],
    emojiPreference: 'tasteful',
    defaultCta: 'What is currently in your hopper? Tell us your daily brew method below! ☕',
    defaultPlatforms: ['instagram', 'tiktok', 'facebook'],
    brandHashtags: ['roastandrelic', 'specialtycoffee', 'singleorigin'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SEED_TEMPLATES: ContentTemplate[] = [
  {
    id: 'tpl_launch',
    name: 'Product Launch Announcement',
    category: 'ecommerce',
    description: 'High-converting announcement framework with clear problem-solution contrast and bio CTA.',
    templateText: `It is officially here. Meet [PRODUCT_NAME]. ✨\n\nFor the past [MONTHS] months, we have been obsessed with solving one major problem: [CORE_PROBLEM].\n\nMost existing solutions [LIMITATION_OF_COMPETITORS]. That is why we engineered [PRODUCT_NAME] with:\n• [KEY_FEATURE_1]: [BENEFIT_1]\n• [KEY_FEATURE_2]: [BENEFIT_2]\n• [KEY_FEATURE_3]: [BENEFIT_3]\n\nThe first limited batch is now live. Tap the link in our bio to claim yours with launch perks.\n\n#[BRAND_NAME] #productlaunch #newarrival`,
    suggestedTone: 'promotional',
    platforms: ['instagram', 'linkedin', 'facebook', 'x'],
    placeholders: ['PRODUCT_NAME', 'MONTHS', 'CORE_PROBLEM', 'LIMITATION_OF_COMPETITORS', 'KEY_FEATURE_1', 'BENEFIT_1', 'KEY_FEATURE_2', 'BENEFIT_2', 'KEY_FEATURE_3', 'BENEFIT_3', 'BRAND_NAME'],
    isFavorite: true,
    isCustom: false,
  },
  {
    id: 'tpl_personal_story',
    name: 'Vulnerable Founder Story',
    category: 'personal_branding',
    description: 'Emotional storytelling arc detailing a failure, a turning point, and a core takeaway.',
    templateText: `Three years ago, [CHALLENGE_OR_FAILURE] almost made me walk away completely.\n\nI was staring at [STRESSFUL_SITUATION], convinced that [NEGATIVE_BELIEF].\n\nThen a mentor shared one sentence that completely reframed my perspective:\n"[PIVOTAL_QUOTE]"\n\nHere is what I learned that changed the entire trajectory of [COMPANY_OR_PROJECT]:\n1. [LESSON_1]\n2. [LESSON_2]\n3. [LESSON_3]\n\nIf you are currently in the messy middle of your own journey, remember: [INSPIRING_CLOSING].\n\nWhat is a lesson you learned the hard way that you now cherish? Drop it below.\n\n#founderjourney #entrepreneurship #lessonslearned`,
    suggestedTone: 'storytelling',
    platforms: ['linkedin', 'instagram', 'threads'],
    placeholders: ['CHALLENGE_OR_FAILURE', 'STRESSFUL_SITUATION', 'NEGATIVE_BELIEF', 'PIVOTAL_QUOTE', 'COMPANY_OR_PROJECT', 'LESSON_1', 'LESSON_2', 'LESSON_3', 'INSPIRING_CLOSING'],
    isFavorite: true,
    isCustom: false,
  },
  {
    id: 'tpl_educational_breakdown',
    name: '3-Step Framework Breakdown',
    category: 'education',
    description: 'Educational carousel or text post explaining how to master a tricky concept.',
    templateText: `Stop overcomplicating [TOPIC]. Here is the exact 3-step system we use:\n\nStep 1: [STEP_1_NAME]\n[STEP_1_ACTIONABLE_ADVICE]\n\nStep 2: [STEP_2_NAME]\n[STEP_2_ACTIONABLE_ADVICE]\n\nStep 3: [STEP_3_NAME]\n[STEP_3_ACTIONABLE_ADVICE]\n\nThe secret is not doing more; it is eliminating [COMMON_MISTAKE].\n\nSave this post for your next session, and tell me: which step do you struggle with most?\n\n#educational #framework #productivity #learning`,
    suggestedTone: 'educational',
    platforms: ['linkedin', 'instagram', 'threads', 'x'],
    placeholders: ['TOPIC', 'STEP_1_NAME', 'STEP_1_ACTIONABLE_ADVICE', 'STEP_2_NAME', 'STEP_2_ACTIONABLE_ADVICE', 'STEP_3_NAME', 'STEP_3_ACTIONABLE_ADVICE', 'COMMON_MISTAKE'],
    isFavorite: true,
    isCustom: false,
  },
  {
    id: 'tpl_testimonial',
    name: 'Customer Success Spotlight',
    category: 'business',
    description: 'Authentic social proof spotlight highlighting before/after results with quotes.',
    templateText: `"Before finding [PRODUCT_NAME], our team was wasting [HOURS_OR_RESOURCE] every single week on [FRUSTRATION]. Now, everything is automated."\n— [CLIENT_NAME], [CLIENT_TITLE]\n\nSeeing results like this is why we built [PRODUCT_NAME].\n\nIn just [TIMEFRAME], [CLIENT_NAME] was able to:\n✔ [RESULT_METRIC_1]\n✔ [RESULT_METRIC_2]\n✔ [RESULT_METRIC_3]\n\nReady to see what this looks like for your workflow? Link in bio to schedule a walkthrough.\n\n#socialproof #clientsuccess #results #caseStudy`,
    suggestedTone: 'professional',
    platforms: ['linkedin', 'instagram', 'facebook'],
    placeholders: ['PRODUCT_NAME', 'HOURS_OR_RESOURCE', 'FRUSTRATION', 'CLIENT_NAME', 'CLIENT_TITLE', 'TIMEFRAME', 'RESULT_METRIC_1', 'RESULT_METRIC_2', 'RESULT_METRIC_3'],
    isFavorite: false,
    isCustom: false,
  },
  {
    id: 'tpl_travel',
    name: 'Hidden Gems Travel Guide',
    category: 'travel',
    description: 'Inspiring travel guide format with spot recommendations and local etiquette.',
    templateText: `Beyond the tourist crowds in [DESTINATION]: 4 hidden spots you cannot skip.\n\n1. [SPOT_1]: [WHY_VISIT_1]\n2. [SPOT_2]: [WHY_VISIT_2]\n3. [SPOT_3]: [WHY_VISIT_3]\n4. [SPOT_4]: [WHY_VISIT_4]\n\nPro tip for visiting: [INSIDER_TIP].\n\nSave this for your next trip to [DESTINATION]! Which spot would you head to first? ✈️\n\n#travelguide #hiddengems #wanderlust #travelinspo`,
    suggestedTone: 'inspirational',
    platforms: ['instagram', 'tiktok', 'pinterest'],
    placeholders: ['DESTINATION', 'SPOT_1', 'WHY_VISIT_1', 'SPOT_2', 'WHY_VISIT_2', 'SPOT_3', 'WHY_VISIT_3', 'SPOT_4', 'WHY_VISIT_4', 'INSIDER_TIP'],
    isFavorite: false,
    isCustom: false,
  },
  {
    id: 'tpl_fitness_routine',
    name: 'Workout Circuit & Cues',
    category: 'fitness',
    description: 'Form cues, sets/reps, and motivation for physical training sessions.',
    templateText: `Save this [TARGET_MUSCLE] routine for your next gym session: 🔥\n\nWarm-up: 5 mins [WARMUP_EXERCISE]\n\n1. [EXERCISE_1]: [SETS_REPS_1]\nForm cue: [FORM_CUE_1]\n\n2. [EXERCISE_2]: [SETS_REPS_2]\nForm cue: [FORM_CUE_2]\n\n3. [EXERCISE_3]: [SETS_REPS_3]\nForm cue: [FORM_CUE_3]\n\nFocus on progressive overload and controlled eccentrics. You do not need to max out every day—you just need consistency.\n\nDrop a 💪 if you are hitting the gym today!\n\n#fitnessroutine #workoutguide #fitfam #strengthtraining`,
    suggestedTone: 'inspirational',
    platforms: ['instagram', 'tiktok', 'youtube'],
    placeholders: ['TARGET_MUSCLE', 'WARMUP_EXERCISE', 'EXERCISE_1', 'SETS_REPS_1', 'FORM_CUE_1', 'EXERCISE_2', 'SETS_REPS_2', 'FORM_CUE_2', 'EXERCISE_3', 'SETS_REPS_3', 'FORM_CUE_3'],
    isFavorite: false,
    isCustom: false,
  },
  {
    id: 'tpl_food_recipe',
    name: 'Quick Artisanal Recipe',
    category: 'food',
    description: 'Mouth-watering step-by-step culinary post with key secrets.',
    templateText: `The [MINUTES]-minute [DISH_NAME] you will be making all weekend long. 🍳\n\nIngredients:\n• [INGREDIENT_1]\n• [INGREDIENT_2]\n• [INGREDIENT_3]\n• [INGREDIENT_4]\n\nThe secret step? [SECRET_COOKING_STEP]. It creates that unbeatable [FLAVOR_OR_TEXTURE].\n\nFull recipe details in the caption below. Save this so you do not lose it before grocery shopping!\n\n#homecooking #quickrecipes #foodie #comfortfood`,
    suggestedTone: 'friendly',
    platforms: ['instagram', 'tiktok', 'pinterest', 'facebook'],
    placeholders: ['MINUTES', 'DISH_NAME', 'INGREDIENT_1', 'INGREDIENT_2', 'INGREDIENT_3', 'INGREDIENT_4', 'SECRET_COOKING_STEP', 'FLAVOR_OR_TEXTURE'],
    isFavorite: false,
    isCustom: false,
  },
  {
    id: 'tpl_linkedin_contrarian',
    name: 'LinkedIn Thought Leadership',
    category: 'business',
    description: 'High-dwell-time LinkedIn essay challenging common industry misconceptions.',
    templateText: `Unpopular opinion in [INDUSTRY]:\n\n[CONTRARIAN_OPINION]\n\nFor years, standard playbooks recommended [CONVENTIONAL_PRACTICE]. But here is what happens when you actually audit the results:\n\n1. [UNINTENDED_CONSEQUENCE_1]\n2. [UNINTENDED_CONSEQUENCE_2]\n3. [UNINTENDED_CONSEQUENCE_3]\n\nInstead, top performers are shifting toward [ALTERNATIVE_STRATEGY]. It is simpler, more resilient, and builds real long-term advantage.\n\nAgree or disagree? I welcome open debate in the comments.\n\n#thoughtleadership #industryinsights #leadership #strategy`,
    suggestedTone: 'professional',
    platforms: ['linkedin', 'x'],
    placeholders: ['INDUSTRY', 'CONTRARIAN_OPINION', 'CONVENTIONAL_PRACTICE', 'UNINTENDED_CONSEQUENCE_1', 'UNINTENDED_CONSEQUENCE_2', 'UNINTENDED_CONSEQUENCE_3', 'ALTERNATIVE_STRATEGY'],
    isFavorite: true,
    isCustom: false,
  },
];

const SEED_HASHTAGS: HashtagGroup[] = [
  {
    id: 'hash_b2b',
    name: 'B2B Tech & Dev Ecosystem',
    category: 'technology',
    hashtags: ['softwareengineering', 'devops', 'cloudnative', 'techleadership', 'developerproductivity', 'buildinpublic', 'saasgrowth'],
    isFavorite: true,
    brandProfileId: 'brand_apex',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hash_wellness',
    name: 'Mindful Living & Wellness',
    category: 'lifestyle',
    hashtags: ['slowliving', 'mindfulness', 'morningroutine', 'intentionality', 'wellnessjourney', 'groundedliving', 'holistichealth'],
    isFavorite: true,
    brandProfileId: 'brand_aura',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hash_fashion',
    name: 'Capsule Wardrobe & Aesthetics',
    category: 'fashion',
    hashtags: ['minimaliststyle', 'capsulewardrobe', 'sustainablefashion', 'ootd', 'outfitinspiration', 'effortlesschic'],
    isFavorite: false,
    brandProfileId: 'brand_sol',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hash_coffee',
    name: 'Specialty Coffee Culture',
    category: 'food',
    hashtags: ['specialtycoffee', 'singleorigin', 'pourover', 'coffeegeek', 'thirdwavecoffee', 'baristadaily'],
    isFavorite: false,
    brandProfileId: 'brand_roast',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hash_fitness',
    name: 'Strength & Conditioning',
    category: 'fitness',
    hashtags: ['strengthtraining', 'workoutmotivation', 'progressiveoverload', 'fitlife', 'gymcommunity', 'trainsmart'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
];

const SEED_DRAFTS: Draft[] = [
  {
    id: 'draft_1',
    title: 'The Real Bottleneck in Developer Velocity',
    content: `Most engineering leaders think velocity is about hiring more developers.\n\nIn reality, adding more hands to an inefficient CI/CD pipeline only increases coordination tax.\n\nWhat truly unlocked velocity for our team:\n• Automated preview environments for every PR\n• Strict test isolation\n• Removing manual approval gates\n\nWhat is your biggest roadblock to shipping faster? Let us discuss below.\n\n---\n#devops #softwareengineering #developerproductivity`,
    platform: 'linkedin',
    category: 'technology',
    tone: 'professional',
    hashtags: ['devops', 'softwareengineering', 'developerproductivity'],
    brandProfileId: 'brand_apex',
    isFavorite: true,
    status: 'draft',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    source: 'local',
    characterCount: 450,
  },
  {
    id: 'draft_2',
    title: 'Morning Routine: Stillness Before Screens',
    content: `✨ A gentle reminder for your morning:\n\nThe world can wait 20 minutes.\n\nBefore opening notifications, checking emails, or absorbing everyone else's priorities, give yourself the gift of an unhurried breath.\n\nMake your tea. Feel the warm cup in your hands. Look out the window. Ground yourself in the present.\n\nSave this for tomorrow morning 🤍\n\n.\n.\n#mindfulliving #morningroutine #slowliving #aurawellness`,
    platform: 'instagram',
    category: 'lifestyle',
    tone: 'inspirational',
    hashtags: ['mindfulliving', 'morningroutine', 'slowliving', 'aurawellness'],
    brandProfileId: 'brand_aura',
    isFavorite: true,
    status: 'planned',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    source: 'local',
    characterCount: 420,
  },
  {
    id: 'draft_3',
    title: 'Capsule Wardrobe Fall Transition',
    content: `Why having only 14 core pieces transformed my daily style:\n\nNo decision fatigue. Every top pairs seamlessly with every bottom. And each piece feels luxurious because quality was never compromised for quantity.\n\nDrop your favorite capsule essential below 👇\n\n#capsulewardrobe #minimalfashion #solmodern`,
    platform: 'threads',
    category: 'fashion',
    tone: 'luxury',
    hashtags: ['capsulewardrobe', 'minimalfashion', 'solmodern'],
    brandProfileId: 'brand_sol',
    isFavorite: false,
    status: 'idea',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: 'local',
    characterCount: 310,
  },
];

const SEED_CALENDAR: CalendarPost[] = [
  {
    id: 'cal_1',
    draftId: 'draft_2',
    title: 'Morning Routine: Stillness Before Screens',
    content: 'A gentle reminder for your morning: The world can wait 20 minutes...',
    platform: 'instagram',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    scheduledTime: '09:00',
    status: 'planned',
    campaign: 'Fall Mindfulness Series',
    notes: 'Post alongside high-contrast tea brewing photo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cal_2',
    draftId: 'draft_1',
    title: 'Developer Velocity Pipeline Breakdown',
    content: 'Most engineering leaders think velocity is about hiring more developers...',
    platform: 'linkedin',
    scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    scheduledTime: '11:30',
    status: 'draft',
    campaign: 'Apex Q4 Engineering Playbook',
    notes: 'Engage with comments in the first 60 minutes',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cal_3',
    title: 'Product Teaser: Organic Wool Overcoat',
    content: 'Understated elegance. Hand-finished seams. Coming this Friday.',
    platform: 'instagram',
    scheduledDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    scheduledTime: '17:00',
    status: 'idea',
    campaign: 'Winter Warmth Drop',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cal_4',
    title: 'Ethiopian Yirgacheffe Tasting Notes Carousel',
    content: 'Bergamot, jasmine blossom, and candied lemon notes. Meet our new harvest.',
    platform: 'instagram',
    scheduledDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    scheduledTime: '10:00',
    status: 'published',
    campaign: 'Single Origin Harvest',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  accentColor: 'lavender',
  defaultPlatform: 'instagram',
  defaultTone: 'friendly',
  defaultLength: 'medium',
  emojiPreference: 'tasteful',
  hapticsEnabled: true,
  deviceFrameEnabled: true,
  activeBrandProfileId: 'brand_aura',
};

class StorageService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Failed to load ${key} from storage:`, e);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to storage:`, e);
    }
  }

  // --- DRAFTS ---
  getDrafts(): Draft[] {
    return this.getItem<Draft[]>(STORAGE_KEYS.DRAFTS, SEED_DRAFTS);
  }

  saveDraft(draft: Draft): Draft {
    const drafts = this.getDrafts();
    const existingIndex = drafts.findIndex(d => d.id === draft.id);
    const updatedDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
      characterCount: draft.content.length,
    };

    if (existingIndex >= 0) {
      drafts[existingIndex] = updatedDraft;
    } else {
      drafts.unshift(updatedDraft);
    }

    this.setItem(STORAGE_KEYS.DRAFTS, drafts);
    return updatedDraft;
  }

  deleteDraft(id: string): void {
    const drafts = this.getDrafts().filter(d => d.id !== id);
    this.setItem(STORAGE_KEYS.DRAFTS, drafts);
  }

  toggleFavoriteDraft(id: string): void {
    const drafts = this.getDrafts().map(d => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
    this.setItem(STORAGE_KEYS.DRAFTS, drafts);
  }

  duplicateDraft(id: string): Draft | null {
    const drafts = this.getDrafts();
    const target = drafts.find(d => d.id === id);
    if (!target) return null;

    const copy: Draft = {
      ...target,
      id: `draft_${Date.now()}_copy`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    };
    drafts.unshift(copy);
    this.setItem(STORAGE_KEYS.DRAFTS, drafts);
    return copy;
  }

  // --- BRAND PROFILES ---
  getBrandProfiles(): BrandProfile[] {
    return this.getItem<BrandProfile[]>(STORAGE_KEYS.BRANDS, SEED_BRANDS);
  }

  saveBrandProfile(brand: BrandProfile): BrandProfile {
    const brands = this.getBrandProfiles();
    const idx = brands.findIndex(b => b.id === brand.id);
    const updated = { ...brand, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      brands[idx] = updated;
    } else {
      brands.push(updated);
    }
    this.setItem(STORAGE_KEYS.BRANDS, brands);
    return updated;
  }

  deleteBrandProfile(id: string): void {
    const brands = this.getBrandProfiles().filter(b => b.id !== id);
    this.setItem(STORAGE_KEYS.BRANDS, brands);
  }

  // --- HASHTAG GROUPS ---
  getHashtagGroups(): HashtagGroup[] {
    return this.getItem<HashtagGroup[]>(STORAGE_KEYS.HASHTAGS, SEED_HASHTAGS);
  }

  saveHashtagGroup(group: HashtagGroup): HashtagGroup {
    const groups = this.getHashtagGroups();
    const idx = groups.findIndex(g => g.id === group.id);
    if (idx >= 0) {
      groups[idx] = group;
    } else {
      groups.unshift(group);
    }
    this.setItem(STORAGE_KEYS.HASHTAGS, groups);
    return group;
  }

  deleteHashtagGroup(id: string): void {
    const groups = this.getHashtagGroups().filter(g => g.id !== id);
    this.setItem(STORAGE_KEYS.HASHTAGS, groups);
  }

  mergeHashtagGroups(group1Id: string, group2Id: string, newName: string): HashtagGroup | null {
    const groups = this.getHashtagGroups();
    const g1 = groups.find(g => g.id === group1Id);
    const g2 = groups.find(g => g.id === group2Id);
    if (!g1 || !g2) return null;

    const mergedTags = Array.from(new Set([...g1.hashtags, ...g2.hashtags]));
    const newGroup: HashtagGroup = {
      id: `hash_merged_${Date.now()}`,
      name: newName,
      category: g1.category,
      hashtags: mergedTags,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
    groups.unshift(newGroup);
    this.setItem(STORAGE_KEYS.HASHTAGS, groups);
    return newGroup;
  }

  // --- CALENDAR POSTS ---
  getCalendarPosts(): CalendarPost[] {
    return this.getItem<CalendarPost[]>(STORAGE_KEYS.CALENDAR, SEED_CALENDAR);
  }

  saveCalendarPost(post: CalendarPost): CalendarPost {
    const posts = this.getCalendarPosts();
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      posts[idx] = post;
    } else {
      posts.unshift(post);
    }
    this.setItem(STORAGE_KEYS.CALENDAR, posts);
    return post;
  }

  deleteCalendarPost(id: string): void {
    const posts = this.getCalendarPosts().filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.CALENDAR, posts);
  }

  updatePostStatus(id: string, status: PostStatus): void {
    const posts = this.getCalendarPosts().map(p => (p.id === id ? { ...p, status } : p));
    this.setItem(STORAGE_KEYS.CALENDAR, posts);
  }

  // --- TEMPLATES ---
  getTemplates(): ContentTemplate[] {
    return this.getItem<ContentTemplate[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
  }

  saveTemplate(tpl: ContentTemplate): ContentTemplate {
    const tpls = this.getTemplates();
    const idx = tpls.findIndex(t => t.id === tpl.id);
    if (idx >= 0) {
      tpls[idx] = tpl;
    } else {
      tpls.unshift(tpl);
    }
    this.setItem(STORAGE_KEYS.TEMPLATES, tpls);
    return tpl;
  }

  deleteTemplate(id: string): void {
    const tpls = this.getTemplates().filter(t => t.id !== id);
    this.setItem(STORAGE_KEYS.TEMPLATES, tpls);
  }

  toggleFavoriteTemplate(id: string): void {
    const tpls = this.getTemplates().map(t => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
    this.setItem(STORAGE_KEYS.TEMPLATES, tpls);
  }

  // --- SETTINGS ---
  getSettings(): UserSettings {
    return this.getItem<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  updateSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- DATA EXPORT / IMPORT / RESET ---
  exportBackupJson(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      drafts: this.getDrafts(),
      brands: this.getBrandProfiles(),
      hashtags: this.getHashtagGroups(),
      calendar: this.getCalendarPosts(),
      templates: this.getTemplates(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  }

  importBackupJson(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid backup structure.' };
      }
      if (Array.isArray(data.drafts)) this.setItem(STORAGE_KEYS.DRAFTS, data.drafts);
      if (Array.isArray(data.brands)) this.setItem(STORAGE_KEYS.BRANDS, data.brands);
      if (Array.isArray(data.hashtags)) this.setItem(STORAGE_KEYS.HASHTAGS, data.hashtags);
      if (Array.isArray(data.calendar)) this.setItem(STORAGE_KEYS.CALENDAR, data.calendar);
      if (Array.isArray(data.templates)) this.setItem(STORAGE_KEYS.TEMPLATES, data.templates);
      if (data.settings && typeof data.settings === 'object') this.setItem(STORAGE_KEYS.SETTINGS, data.settings);

      return { success: true, message: 'Data imported successfully!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to parse JSON backup.' };
    }
  }

  resetToDefaultSeeds(): void {
    this.setItem(STORAGE_KEYS.DRAFTS, SEED_DRAFTS);
    this.setItem(STORAGE_KEYS.BRANDS, SEED_BRANDS);
    this.setItem(STORAGE_KEYS.HASHTAGS, SEED_HASHTAGS);
    this.setItem(STORAGE_KEYS.CALENDAR, SEED_CALENDAR);
    this.setItem(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
    this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  // CSV Helpers
  exportDraftsToCsv(drafts: Draft[]): string {
    const headers = ['Title', 'Platform', 'Category', 'Tone', 'Status', 'Content', 'Hashtags', 'Created At'];
    const rows = drafts.map(d => [
      escapeCsvField(d.title),
      escapeCsvField(d.platform),
      escapeCsvField(d.category),
      escapeCsvField(d.tone),
      escapeCsvField(d.status),
      escapeCsvField(d.content),
      escapeCsvField(d.hashtags.join(', ')),
      escapeCsvField(d.createdAt),
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  exportHashtagsToCsv(groups: HashtagGroup[]): string {
    const headers = ['Group Name', 'Category', 'Hashtags Count', 'Hashtags'];
    const rows = groups.map(g => [
      escapeCsvField(g.name),
      escapeCsvField(g.category),
      escapeCsvField(String(g.hashtags.length)),
      escapeCsvField(g.hashtags.map(t => `#${t}`).join(' ')),
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

function escapeCsvField(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export const storage = new StorageService();
