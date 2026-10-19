import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Search,
  Copy,
  ExternalLink,
  Edit3,
  Filter,
  ArrowRight,
  X,
} from 'lucide-react';
import { ContentTemplate, ContentCategory, SocialPlatform } from '../types';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';

interface TemplatesScreenProps {
  templates: ContentTemplate[];
  onRefreshTemplates: () => void;
  onUseTemplate: (completedText: string, platform: SocialPlatform) => void;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({
  templates,
  onRefreshTemplates,
  onUseTemplate,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTemplateForFill, setActiveTemplateForFill] = useState<ContentTemplate | null>(null);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});

  const handleToggleFavorite = (id: string) => {
    storage.toggleFavoriteTemplate(id);
    onRefreshTemplates();
  };

  const handleOpenFillModal = (tpl: ContentTemplate) => {
    setActiveTemplateForFill(tpl);
    const initialMap: Record<string, string> = {};
    tpl.placeholders.forEach(ph => {
      initialMap[ph] = '';
    });
    setPlaceholderValues(initialMap);
  };

  const handleApplyFilledTemplate = () => {
    if (!activeTemplateForFill) return;

    let text = activeTemplateForFill.templateText;
    activeTemplateForFill.placeholders.forEach(ph => {
      const val = placeholderValues[ph]?.trim() || `[${ph}]`;
      const regex = new RegExp(`\\[${ph}\\]`, 'g');
      text = text.replace(regex, val);
    });

    const targetPlatform = activeTemplateForFill.platforms[0] || 'instagram';
    onUseTemplate(text, targetPlatform);
    setActiveTemplateForFill(null);
    showToast('Template populated into Caption Studio!');
  };

  const handleCopyRaw = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Template copied to clipboard!');
  };

  const filtered = templates.filter(t => {
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const categories = ['all', 'ecommerce', 'personal_branding', 'education', 'business', 'travel', 'fitness', 'food'];

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
          Template Library
        </h2>
        <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
          Tested copywriting formulas with interactive variable replacement.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search templates by concept or niche..."
            className="w-full text-xs pl-8 pr-3 py-2.5 rounded-2xl glass-panel border border-white/70 dark:border-white/10 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === c
                  ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] shadow-xs'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-white'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="space-y-3">
        {filtered.map(tpl => (
          <div
            key={tpl.id}
            className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 space-y-2.5 hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
                    {tpl.name}
                  </h3>
                  <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] capitalize">
                    · {tpl.category}
                  </span>
                </div>
                <p className="text-xs text-[#77758A] dark:text-[#C5C3D6] line-clamp-2 mt-0.5">
                  {tpl.description}
                </p>
              </div>
              <button
                onClick={() => handleToggleFavorite(tpl.id)}
                className="p-1 text-slate-400 hover:text-amber-400 shrink-0"
              >
                <Star
                  className={`w-4 h-4 ${
                    tpl.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
              </button>
            </div>

            {/* Template Preview Box */}
            <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 font-mono line-clamp-3 whitespace-pre-wrap leading-relaxed">
              {tpl.templateText}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] font-medium">
                {tpl.placeholders.length} customizable fields
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyRaw(tpl.templateText)}
                  className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Raw</span>
                </button>
                <button
                  onClick={() => handleOpenFillModal(tpl)}
                  className="px-3 py-1 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-[11px] font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
                >
                  <span>Fill & Use</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Placeholder Filler Modal */}
      {activeTemplateForFill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
                  Fill Template: {activeTemplateForFill.name}
                </h3>
                <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
                  Enter values for each placeholder variable.
                </p>
              </div>
              <button
                onClick={() => setActiveTemplateForFill(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 no-scrollbar text-xs">
              {activeTemplateForFill.placeholders.map(ph => (
                <div key={ph} className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {ph.replace(/_/g, ' ').toLowerCase()}
                  </label>
                  <input
                    type="text"
                    value={placeholderValues[ph] || ''}
                    onChange={e =>
                      setPlaceholderValues(prev => ({ ...prev, [ph]: e.target.value }))
                    }
                    placeholder={`Enter ${ph.toLowerCase()}...`}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/60 dark:border-white/10 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setActiveTemplateForFill(null)}
                className="px-4 py-2 rounded-xl text-slate-500 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilledTemplate}
                className="px-5 py-2 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-bold shadow-xs active:scale-95"
              >
                Populate Into Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
