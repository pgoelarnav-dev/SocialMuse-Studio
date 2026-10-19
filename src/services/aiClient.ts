import {
  CaptionVariation,
  SocialPlatform,
  ContentCategory,
  Tone,
  CaptionLength,
  BrandProfile,
} from '../types';
import { generateLocalCaptions, refineLocalCaption, generateHashtagSet } from './localEngine';

export interface GenerateRequestParams {
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

export interface RefineRequestParams {
  caption: string;
  action: 'shorten' | 'expand' | 'hook' | 'cta' | 'rewrite_tone' | 'translate' | 'remove_emojis' | 'add_emojis';
  targetTone?: Tone;
  targetLanguage?: string;
  platform?: SocialPlatform;
}

export async function checkAiAvailability(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.aiAvailable;
  } catch {
    return false;
  }
}

/**
 * Generate 3 caption variations using Gemini 3.8 Flash if available, with immediate offline local fallback
 */
export async function generateCaptions(
  params: GenerateRequestParams,
  forceLocal = false
): Promise<{ variations: CaptionVariation[]; source: 'gemini-3.8-flash' | 'local' }> {
  if (forceLocal) {
    const localVars = generateLocalCaptions(params);
    return { variations: localVars, source: 'local' };
  }

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data?.captions && Array.isArray(result.data.captions)) {
        const variations: CaptionVariation[] = result.data.captions.map((item: any, idx: number) => ({
          id: `gemini_var_${idx}_${Date.now()}`,
          title: item.title || `Variation ${idx + 1}`,
          text: item.text || '',
          hook: item.hook || '',
          callToAction: item.callToAction || '',
          suggestedHashtags: item.suggestedHashtags || [],
          source: 'gemini-3.8-flash',
        }));
        return { variations, source: 'gemini-3.8-flash' };
      }
    }
  } catch (err) {
    console.warn('Gemini API call failed, switching to local rules engine:', err);
  }

  // Graceful fallback to local rule-and-template engine
  const localVars = generateLocalCaptions(params);
  return { variations: localVars, source: 'local' };
}

/**
 * Refine caption with Gemini or Local Engine fallback
 */
export async function refineCaption(
  params: RefineRequestParams,
  forceLocal = false
): Promise<{ refinedCaption: string; explanation: string; source: 'gemini-3.8-flash' | 'local' }> {
  if (forceLocal) {
    const res = refineLocalCaption(params.caption, params.action, params.targetTone, params.targetLanguage);
    return { refinedCaption: res.refinedText, explanation: res.explanation, source: 'local' };
  }

  try {
    const response = await fetch('/api/ai/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data?.refinedCaption) {
        return {
          refinedCaption: result.data.refinedCaption,
          explanation: result.data.explanation || 'Refined with Gemini AI',
          source: 'gemini-3.8-flash',
        };
      }
    }
  } catch (err) {
    console.warn('Gemini refine failed, using local rules:', err);
  }

  const res = refineLocalCaption(params.caption, params.action, params.targetTone, params.targetLanguage);
  return { refinedCaption: res.refinedText, explanation: res.explanation, source: 'local' };
}

/**
 * Discover and categorize hashtags
 */
export async function discoverHashtags(
  topic: string,
  category: ContentCategory,
  platform: SocialPlatform,
  forceLocal = false
): Promise<{
  broad: string[];
  niche: string[];
  industry: string[];
  campaign: string[];
  all: string[];
  source: 'gemini-3.8-flash' | 'local';
}> {
  if (!forceLocal) {
    try {
      const response = await fetch('/api/ai/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category, platform }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.all) {
          return {
            broad: result.data.broad || [],
            niche: result.data.niche || [],
            industry: result.data.industry || [],
            campaign: result.data.campaign || [],
            all: result.data.all || [],
            source: 'gemini-3.8-flash',
          };
        }
      }
    } catch (e) {
      console.warn('AI hashtags unavailable, fallback to local discovery:', e);
    }
  }

  // Local fallback
  const allTags = generateHashtagSet(topic, category, [], undefined, 20);
  return {
    broad: allTags.slice(0, 5),
    niche: allTags.slice(5, 12),
    industry: allTags.slice(12, 16),
    campaign: allTags.slice(16, 20),
    all: allTags,
    source: 'local',
  };
}
