import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Save,
  Share2,
  Calendar,
  Smile,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Check,
  AlertCircle,
  Eye,
  Edit3,
} from 'lucide-react';
import {
  SocialPlatform,
  ContentCategory,
  Tone,
  CaptionLength,
  BrandProfile,
  CaptionVariation,
  Draft,
} from '../types';
import { PLATFORM_CONFIGS } from '../services/platformConfigs';
import { generateCaptions, refineCaption } from '../services/aiClient';
import { useToast } from '../components/Toast';

interface CreateScreenProps {
  activeBrand?: BrandProfile;
  brands: BrandProfile[];
  initialDraft?: Draft | null;
  onClearInitialDraft: () => void;
  onSaveDraft: (draft: Draft) => void;
  onSchedulePost: (title: string, content: string, platform: SocialPlatform) => void;
}

const ALL_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'tiktok',
  'linkedin',
  'x',
  'youtube',
  'facebook',
  'threads',
  'pinterest',
];

const ALL_TONES: Tone[] = [
  'friendly',
  'professional',
  'casual',
  'educational',
  'inspirational',
  'humorous',
  'luxury',
  'minimal',
  'promotional',
  'storytelling',
];

const ALL_CATEGORIES: ContentCategory[] = [
  'business',
  'lifestyle',
  'technology',
  'fashion',
  'beauty',
  'fitness',
  'food',
  'travel',
  'education',
  'personal_branding',
  'ecommerce',
  'entertainment',
  'general',
];

export const CreateScreen: React.FC<CreateScreenProps> = ({
  activeBrand,
  brands,
  initialDraft,
  onClearInitialDraft,
  onSaveDraft,
  onSchedulePost,
}) => {
  const { showToast } = useToast();

  // Inputs
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [category, setCategory] = useState<ContentCategory>('lifestyle');
  const [tone, setTone] = useState<Tone>('friendly');
  const [captionLength, setCaptionLength] = useState<CaptionLength>('medium');
  const [ctaPreference, setCtaPreference] = useState('');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(activeBrand?.id || '');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [useAiIfAvailable, setUseAiIfAvailable] = useState(true);

  // Advanced filters accordion
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<CaptionVariation[]>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [editableText, setEditableText] = useState('');
  const [generationSource, setGenerationSource] = useState<'local' | 'gemini-3.8-flash'>('local');

  // Preview mode toggle
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  // Load initial draft if editing
  useEffect(() => {
    if (initialDraft) {
      setTopic(initialDraft.title);
      setPlatform(initialDraft.platform);
      setCategory(initialDraft.category);
      setTone(initialDraft.tone);
      setEditableText(initialDraft.content);
      setSelectedBrandId(initialDraft.brandProfileId || '');
      setVariations([
        {
          id: `edit_${initialDraft.id}`,
          title: 'Current Draft',
          text: initialDraft.content,
          hook: '',
          callToAction: '',
          suggestedHashtags: initialDraft.hashtags,
          source: initialDraft.source,
        },
      ]);
      setSelectedVariationIndex(0);
      onClearInitialDraft();
    }
  }, [initialDraft]);

  const platformConfig = PLATFORM_CONFIGS[platform];
  const charCount = editableText.length;
  const isOverLimit = charCount > platformConfig.maxCharacters;

  // Primary generate handler
  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Please enter a topic or concept for your post', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedBrand = brands.find(b => b.id === selectedBrandId) || activeBrand;
      const result = await generateCaptions(
        {
          topic: topic.trim(),
          platform,
          category,
          tone,
          captionLength,
          audience: targetAudience.trim(),
          keywords: keywords.trim(),
          brandVoice: selectedBrand,
          ctaPreference: ctaPreference.trim(),
          includeEmojis,
        },
        !useAiIfAvailable
      );

      setVariations(result.variations);
      setSelectedVariationIndex(0);
      setGenerationSource(result.source);
      if (result.variations.length > 0) {
        setEditableText(result.variations[0].text);
      }
      showToast(
        result.source === 'gemini-3.8-flash'
          ? 'Generated with Gemini 3.8 Flash!'
          : 'Generated with Local Rule Engine'
      );
    } catch (err: any) {
      showToast('Generation encountered an issue, used local engine', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectVariation = (idx: number) => {
    setSelectedVariationIndex(idx);
    if (variations[idx]) {
      setEditableText(variations[idx].text);
    }
  };

  // Refinement handler
  const handleRefine = async (
    action: 'shorten' | 'expand' | 'hook' | 'cta' | 'rewrite_tone' | 'translate' | 'remove_emojis' | 'add_emojis',
    customTone?: Tone
  ) => {
    if (!editableText.trim()) return;

    setIsGenerating(true);
    try {
      const result = await refineCaption(
        {
          caption: editableText,
          action,
          targetTone: customTone || tone,
          targetLanguage,
          platform,
        },
        !useAiIfAvailable
      );

      setEditableText(result.refinedCaption);
      showToast(result.explanation);
    } catch (err) {
      showToast('Refinement failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    showToast('Caption copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: topic || 'Social Media Post',
          text: editableText,
        });
        showToast('Shared successfully!');
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleSave = () => {
    if (!editableText.trim()) {
      showToast('Cannot save an empty caption', 'error');
      return;
    }

    const draftTitle = topic.trim() || editableText.slice(0, 32);
    const hashMatches = editableText.match(/#[a-zA-Z0-9_]+/g) || [];
    const cleanTags = hashMatches.map(t => t.replace('#', ''));

    const newDraft: Draft = {
      id: `draft_${Date.now()}`,
      title: draftTitle,
      content: editableText,
      platform,
      category,
      tone,
      hashtags: cleanTags,
      brandProfileId: selectedBrandId || activeBrand?.id,
      isFavorite: false,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: generationSource,
      characterCount: editableText.length,
    };

    onSaveDraft(newDraft);
    showToast('Draft saved to library!');
  };

  const handleSchedule = () => {
    if (!editableText.trim()) {
      showToast('Cannot schedule an empty caption', 'error');
      return;
    }
    const title = topic.trim() || editableText.slice(0, 32);
    onSchedulePost(title, editableText, platform);
  };

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Top Header & View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
            Caption Studio
          </h2>
          <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
            Compose, tune, and polish platform-ready social posts.
          </p>
        </div>

        {/* Editor vs Preview segmented buttons */}
        <div className="flex items-center p-1 rounded-2xl glass-panel border border-white/60 dark:border-white/10">
          <button
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'editor'
                ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'preview'
                ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Platform Horizontal Scroll Carousel */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4] px-1">
          Select Target Platform
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {ALL_PLATFORMS.map(p => {
            const isSelected = platform === p;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold capitalize whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] shadow-sm scale-100'
                    : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-white/90 border border-white/60 dark:border-white/10'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === 'editor' ? (
        <div className="space-y-4">
          {/* Main Topic Input Box */}
          <div className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-xs space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">
                What are you posting about?
              </label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Announcing our new sustainable linen capsule collection, focusing on zero-waste packaging..."
                rows={3}
                className="w-full text-xs p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 focus:outline-hidden focus:ring-2 focus:ring-[#DCD5FA] placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            {/* Quick Core Controls */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as Tone)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-hidden capitalize"
                >
                  {ALL_TONES.map(t => (
                    <option key={t} value={t} className="capitalize dark:bg-[#1E1D2E]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ContentCategory)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-hidden capitalize"
                >
                  {ALL_CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize dark:bg-[#1E1D2E]">
                      {c.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Collapsible Advanced Parameters */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6C5CE7] dark:text-[#DCD5FA] pt-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Advanced Options' : 'Tune Audience, Length & CTA'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>

              {showAdvanced && (
                <div className="pt-3 space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                        Keywords (optional)
                      </label>
                      <input
                        type="text"
                        value={keywords}
                        onChange={e => setKeywords(e.target.value)}
                        placeholder="linen, slow fashion, ootd"
                        className="w-full text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={e => setTargetAudience(e.target.value)}
                        placeholder="e.g. Minimalist professionals"
                        className="w-full text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                        Caption Length
                      </label>
                      <div className="flex items-center gap-1 bg-white/50 dark:bg-white/5 p-1 rounded-xl">
                        {(['short', 'medium', 'long'] as CaptionLength[]).map(l => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setCaptionLength(l)}
                            className={`flex-1 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                              captionLength === l
                                ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-500'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                        Include Emojis
                      </label>
                      <button
                        type="button"
                        onClick={() => setIncludeEmojis(!includeEmojis)}
                        className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                          includeEmojis
                            ? 'bg-[#F7DCE8]/60 dark:bg-[#482D3D] text-[#29283A] dark:text-[#F7DCE8] border-[#F7DCE8]'
                            : 'bg-white/50 dark:bg-white/5 text-slate-500 border-transparent'
                        }`}
                      >
                        <Smile className="w-3.5 h-3.5" />
                        <span>{includeEmojis ? 'Tasteful Emojis: ON' : 'Emojis: OFF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI toggle */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Optional Gemini 3.8 Flash Cloud AI
                      </span>
                      <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
                        Uses server API key if available. The built-in local engine is always free, unlimited, and offline.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUseAiIfAvailable(!useAiIfAvailable)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        useAiIfAvailable ? 'bg-[#6C5CE7]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          useAiIfAvailable ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full py-3 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-bold shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating variations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#DCD5FA] dark:text-[#6C5CE7]" />
                  <span>Generate 3 Variations</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Variations Tabs */}
          {variations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4]">
                  Generated Variations
                </span>
                <span className="text-[10px] font-mono text-[#77758A] dark:text-[#9D9AB4]">
                  Source: {generationSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Local Rule Engine'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {variations.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVariation(i)}
                    className={`p-2.5 rounded-2xl text-left border transition-all ${
                      selectedVariationIndex === i
                        ? 'bg-[#DCD5FA]/70 dark:bg-[#34324D] border-[#DCD5FA] text-[#29283A] dark:text-white shadow-xs'
                        : 'glass-panel border-white/60 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/80'
                    }`}
                  >
                    <span className="block text-[11px] font-bold truncate">Var {i + 1}</span>
                    <span className="block text-[10px] text-[#77758A] dark:text-[#9D9AB4] truncate mt-0.5">
                      {v.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Caption Editor Area */}
          <div className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">
                Editable Caption Text
              </label>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className={isOverLimit ? 'text-rose-500 font-bold' : 'text-slate-500'}>
                  {charCount}
                </span>
                <span className="text-slate-400">/ {platformConfig.maxCharacters}</span>
              </div>
            </div>

            {isOverLimit && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Caption exceeds {platformConfig.name}&apos;s limit of {platformConfig.maxCharacters} chars.
                </span>
              </div>
            )}

            <textarea
              value={editableText}
              onChange={e => setEditableText(e.target.value)}
              placeholder="Your generated or drafted caption will appear here for fine-tuning..."
              rows={8}
              className="w-full text-xs p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 focus:outline-hidden focus:ring-2 focus:ring-[#DCD5FA] placeholder-slate-400 text-slate-800 dark:text-slate-100 leading-relaxed font-sans"
            />

            {/* Quick Refinement Action Toolbar */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4]">
                Instant Refinements
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRefine('shorten')}
                  disabled={isGenerating || !editableText}
                  className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-[11px] font-medium text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 shadow-xs"
                >
                  Make Shorter
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine('expand')}
                  disabled={isGenerating || !editableText}
                  className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-[11px] font-medium text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 shadow-xs"
                >
                  Expand
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine('hook')}
                  disabled={isGenerating || !editableText}
                  className="px-2.5 py-1 rounded-xl bg-[#F7DCE8]/70 dark:bg-[#482D3D] text-[11px] font-medium text-[#29283A] dark:text-[#F7DCE8] border border-white/60 dark:border-white/10 shadow-xs"
                >
                  Boost Hook
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine('cta')}
                  disabled={isGenerating || !editableText}
                  className="px-2.5 py-1 rounded-xl bg-[#D7F0E3]/70 dark:bg-[#204231] text-[11px] font-medium text-[#29283A] dark:text-[#D7F0E3] border border-white/60 dark:border-white/10 shadow-xs"
                >
                  Improve CTA
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine(includeEmojis ? 'remove_emojis' : 'add_emojis')}
                  disabled={isGenerating || !editableText}
                  className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-[11px] font-medium text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 shadow-xs"
                >
                  {includeEmojis ? 'Strip Emojis' : 'Add Emojis'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine('rewrite_tone', 'professional')}
                  disabled={isGenerating || !editableText}
                  className="px-2.5 py-1 rounded-xl bg-[#DCEBFA]/70 dark:bg-[#24354C] text-[11px] font-medium text-[#29283A] dark:text-[#DCEBFA] border border-white/60 dark:border-white/10 shadow-xs"
                >
                  Professional
                </button>
              </div>
            </div>

            {/* Bottom Actions Row (Copy, Save, Share, Schedule) */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!editableText}
                className="py-2.5 rounded-2xl glass-panel text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!editableText}
                className="py-2.5 rounded-2xl bg-[#DCD5FA] text-[#29283A] dark:bg-[#34324D] dark:text-[#DCD5FA] font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={!editableText}
                className="py-2.5 rounded-2xl glass-panel text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={handleSchedule}
                disabled={!editableText}
                className="py-2.5 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Plan</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Platform Simulation Preview Card */
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-white dark:bg-[#1E1D2E] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
            {/* Platform mock user lockup */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#DCD5FA] to-[#F7DCE8] flex items-center justify-center font-bold text-xs text-[#29283A]">
                  {activeBrand?.name?.slice(0, 2).toUpperCase() || 'SM'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeBrand?.name || 'SocialMuse Studio'}
                  </h4>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {platform} preview · Just now
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Approximate
              </span>
            </div>

            {/* Platform media placeholder */}
            <div className="w-full aspect-video rounded-2xl bg-gradient-to-tr from-[#F8F7FC] via-[#EFF2FA] to-[#DCD5FA]/30 dark:from-[#171626] dark:to-[#222036] flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Media Asset Attachment
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Optimized for {platformConfig.name} ({platform === 'x' ? '16:9' : '4:5 / 9:16'})
              </span>
            </div>

            {/* Rendered Caption Content */}
            <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
              {editableText || 'Your caption text will preview here...'}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>{charCount} characters</span>
              <span className="text-[11px] text-[#6C5CE7] dark:text-[#DCD5FA] font-medium">
                {platformConfig.toneTip}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Ready Caption</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
