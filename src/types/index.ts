export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'x'
  | 'youtube'
  | 'facebook'
  | 'threads'
  | 'pinterest';

export type ContentCategory =
  | 'business'
  | 'fashion'
  | 'beauty'
  | 'fitness'
  | 'food'
  | 'travel'
  | 'technology'
  | 'education'
  | 'lifestyle'
  | 'personal_branding'
  | 'ecommerce'
  | 'entertainment'
  | 'general';

export type Tone =
  | 'professional'
  | 'friendly'
  | 'casual'
  | 'educational'
  | 'inspirational'
  | 'humorous'
  | 'luxury'
  | 'minimal'
  | 'promotional'
  | 'storytelling';

export type CaptionLength = 'short' | 'medium' | 'long';

export type GenerationSource = 'local' | 'gemini-3.8-flash';

export type PostStatus = 'idea' | 'draft' | 'planned' | 'published' | 'archived';

export interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  maxCharacters: number;
  recommendedLength: string;
  hashtagLimit: number;
  bestHashtagCount: number;
  tagPlacement: 'end' | 'inline' | 'first_comment';
  toneTip: string;
  iconName: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  tone: Tone;
  language: string;
  vocabulary: string[];
  wordsToAvoid: string[];
  emojiPreference: 'abundant' | 'tasteful' | 'none';
  defaultCta: string;
  defaultPlatforms: SocialPlatform[];
  brandHashtags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Draft {
  id: string;
  title: string;
  content: string;
  platform: SocialPlatform;
  category: ContentCategory;
  tone: Tone;
  hashtags: string[];
  brandProfileId?: string;
  isFavorite: boolean;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  source: GenerationSource;
  characterCount: number;
  notes?: string;
}

export interface HashtagGroup {
  id: string;
  name: string;
  category: ContentCategory;
  hashtags: string[];
  isFavorite: boolean;
  brandProfileId?: string;
  createdAt: string;
}

export interface CalendarPost {
  id: string;
  draftId?: string;
  title: string;
  content: string;
  platform: SocialPlatform;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: PostStatus;
  campaign?: string;
  notes?: string;
  createdAt: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  category: ContentCategory;
  description: string;
  templateText: string;
  suggestedTone: Tone;
  platforms: SocialPlatform[];
  placeholders: string[]; // e.g. ["PRODUCT_NAME", "BENEFIT_1"]
  isFavorite: boolean;
  isCustom: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: 'lavender' | 'pink' | 'mint' | 'blue' | 'peach';
  defaultPlatform: SocialPlatform;
  defaultTone: Tone;
  defaultLength: CaptionLength;
  emojiPreference: 'tasteful' | 'abundant' | 'none';
  hapticsEnabled: boolean;
  deviceFrameEnabled: boolean;
  activeBrandProfileId: string;
}

export interface CaptionVariation {
  id: string;
  title: string;
  text: string;
  hook: string;
  callToAction: string;
  suggestedHashtags: string[];
  source: GenerationSource;
}

export interface BulkItemInput {
  id: string;
  topic: string;
  platform: SocialPlatform;
  tone: Tone;
  status: 'pending' | 'generated' | 'failed';
  result?: CaptionVariation;
}
