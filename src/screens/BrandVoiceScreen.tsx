import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Check,
  X,
  Volume2,
  Smile,
  ShieldAlert,
} from 'lucide-react';
import { BrandProfile, Tone, SocialPlatform } from '../types';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';

interface BrandVoiceScreenProps {
  brands: BrandProfile[];
  activeBrandId?: string;
  onSelectActiveBrand: (id: string) => void;
  onRefreshBrands: () => void;
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

export const BrandVoiceScreen: React.FC<BrandVoiceScreenProps> = ({
  brands,
  activeBrandId,
  onSelectActiveBrand,
  onRefreshBrands,
}) => {
  const { showToast } = useToast();

  const [editingBrand, setEditingBrand] = useState<BrandProfile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAudience, setFormAudience] = useState('');
  const [formTone, setFormTone] = useState<Tone>('friendly');
  const [formLang, setFormLang] = useState('English');
  const [formVocab, setFormVocab] = useState('');
  const [formWordsToAvoid, setFormWordsToAvoid] = useState('');
  const [formEmoji, setFormEmoji] = useState<'abundant' | 'tasteful' | 'none'>('tasteful');
  const [formDefaultCta, setFormDefaultCta] = useState('');
  const [formPlatforms, setFormPlatforms] = useState<SocialPlatform[]>(['instagram', 'threads']);
  const [formHashtags, setFormHashtags] = useState('');

  const handleOpenNew = () => {
    setEditingBrand(null);
    setFormName('');
    setFormDesc('');
    setFormAudience('');
    setFormTone('friendly');
    setFormLang('English');
    setFormVocab('');
    setFormWordsToAvoid('');
    setFormEmoji('tasteful');
    setFormDefaultCta('');
    setFormPlatforms(['instagram', 'threads']);
    setFormHashtags('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (brand: BrandProfile) => {
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormDesc(brand.description);
    setFormAudience(brand.targetAudience);
    setFormTone(brand.tone);
    setFormLang(brand.language);
    setFormVocab(brand.vocabulary.join(', '));
    setFormWordsToAvoid(brand.wordsToAvoid.join(', '));
    setFormEmoji(brand.emojiPreference);
    setFormDefaultCta(brand.defaultCta);
    setFormPlatforms(brand.defaultPlatforms);
    setFormHashtags(brand.brandHashtags.join(', '));
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Brand name is required', 'error');
      return;
    }

    const vocabArray = formVocab
      .split(',')
      .map(w => w.trim())
      .filter(Boolean);

    const avoidArray = formWordsToAvoid
      .split(',')
      .map(w => w.trim())
      .filter(Boolean);

    const tagArray = formHashtags
      .split(',')
      .map(t => t.replace('#', '').trim())
      .filter(Boolean);

    const updated: BrandProfile = {
      id: editingBrand ? editingBrand.id : `brand_${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim(),
      targetAudience: formAudience.trim(),
      tone: formTone,
      language: formLang,
      vocabulary: vocabArray,
      wordsToAvoid: avoidArray,
      emojiPreference: formEmoji,
      defaultCta: formDefaultCta.trim(),
      defaultPlatforms: formPlatforms,
      brandHashtags: tagArray,
      createdAt: editingBrand ? editingBrand.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveBrandProfile(updated);
    onRefreshBrands();
    setIsFormOpen(false);
    showToast(editingBrand ? 'Brand voice updated!' : 'Brand voice profile created!');
  };

  const handleDuplicate = (brand: BrandProfile) => {
    const copy: BrandProfile = {
      ...brand,
      id: `brand_${Date.now()}`,
      name: `${brand.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveBrandProfile(copy);
    onRefreshBrands();
    showToast('Brand profile duplicated');
  };

  const confirmDelete = () => {
    if (deleteCandidateId) {
      storage.deleteBrandProfile(deleteCandidateId);
      onRefreshBrands();
      setDeleteCandidateId(null);
      showToast('Brand profile deleted');
    }
  };

  const togglePlatform = (p: SocialPlatform) => {
    setFormPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
            Brand Voice Manager
          </h2>
          <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
            Define distinct tonal archetypes, vocabulary, and preferred channels.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-3.5 py-2 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Profile</span>
        </button>
      </div>

      {/* Brand Profiles List */}
      <div className="space-y-3">
        {brands.map(brand => {
          const isActive = brand.id === activeBrandId;
          return (
            <div
              key={brand.id}
              className={`p-4 rounded-3xl border transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-[#DCD5FA]/50 via-white/80 to-[#F7DCE8]/40 dark:from-[#2B2745] dark:via-[#1E1D2E] dark:to-[#35273C] border-[#DCD5FA] dark:border-white/20 shadow-sm'
                  : 'glass-panel border-white/70 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA] truncate">
                      {brand.name}
                    </h3>
                    {isActive && (
                      <span className="text-[10px] font-bold text-[#6C5CE7] dark:text-[#DCD5FA] bg-[#DCD5FA]/60 dark:bg-[#34324D] px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#77758A] dark:text-[#C5C3D6] line-clamp-2 mt-1">
                    {brand.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleDuplicate(brand)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(brand)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {brands.length > 1 && (
                    <button
                      onClick={() => setDeleteCandidateId(brand.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Badges and Parameters */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/60 dark:border-white/10 mt-3">
                <div>
                  <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] uppercase tracking-wider block">
                    Tone & Persona
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {brand.tone}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] uppercase tracking-wider block">
                    Audience
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 truncate block">
                    {brand.targetAudience || 'General public'}
                  </span>
                </div>
              </div>

              {brand.vocabulary.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] uppercase tracking-wider block mb-1">
                    Signature Vocabulary
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {brand.vocabulary.slice(0, 5).map((w, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Set Active Button */}
              {!isActive && (
                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectActiveBrand(brand.id);
                      showToast(`Switched active brand to ${brand.name}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-xs font-semibold text-slate-800 dark:text-slate-200 border border-white/60 dark:border-white/10 shadow-xs"
                  >
                    Set as Active Brand
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit / Create Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
                {editingBrand ? 'Edit Brand Voice' : 'New Brand Voice Profile'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-4 flex-1 overflow-y-auto space-y-3.5 no-scrollbar text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Brand / Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Aura Wellness Studio"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Short Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  rows={2}
                  placeholder="What is your mission or core offering?"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formAudience}
                    onChange={e => setFormAudience(e.target.value)}
                    placeholder="e.g. Conscious urbanites 25-40"
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Primary Tone
                  </label>
                  <select
                    value={formTone}
                    onChange={e => setFormTone(e.target.value as Tone)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 capitalize"
                  >
                    {ALL_TONES.map(t => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Preferred Vocabulary (comma-separated)
                </label>
                <input
                  type="text"
                  value={formVocab}
                  onChange={e => setFormVocab(e.target.value)}
                  placeholder="serene, intentional, grounding, ritual"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Words or Clichés to Avoid</span>
                </label>
                <input
                  type="text"
                  value={formWordsToAvoid}
                  onChange={e => setFormWordsToAvoid(e.target.value)}
                  placeholder="hustle, crazy cheap, buy now or regret"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Default Call To Action
                </label>
                <input
                  type="text"
                  value={formDefaultCta}
                  onChange={e => setFormDefaultCta(e.target.value)}
                  placeholder="Save this post for your quiet morning ritual 🌿"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Brand Hashtags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formHashtags}
                  onChange={e => setFormHashtags(e.target.value)}
                  placeholder="aurawellness, mindfulmornings"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Primary Social Channels
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ALL_PLATFORMS.map(p => {
                    const isSelected = formPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlatform(p)}
                        className={`px-2.5 py-1 rounded-xl text-xs capitalize transition-all ${
                          isSelected
                            ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] font-semibold'
                            : 'bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] font-bold shadow-xs active:scale-95"
                >
                  Save Brand Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCandidateId}
        title="Delete Brand Profile"
        message="Are you sure you want to delete this brand voice profile? This action cannot be undone."
        confirmLabel="Delete Profile"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />
    </div>
  );
};
