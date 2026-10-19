import React, { useState } from 'react';
import {
  X,
  Layers,
  Sparkles,
  RefreshCw,
  Save,
  Download,
  Copy,
  Check,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  SocialPlatform,
  Tone,
  BrandProfile,
  BulkItemInput,
  Draft,
} from '../types';
import { generateCaptions } from '../services/aiClient';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';

interface BulkCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrand: BrandProfile;
  onBulkDraftsSaved: () => void;
}

export const BulkCreateModal: React.FC<BulkCreateModalProps> = ({
  isOpen,
  onClose,
  activeBrand,
  onBulkDraftsSaved,
}) => {
  const { showToast } = useToast();

  const [rawTopicsText, setRawTopicsText] = useState(
    '5 common mistakes in morning routines\nWhy our linen shirt is built to last 10 years\nBehind the scenes: roasting our Ethiopian batch\n3 lessons learned after scaling to 10k users'
  );
  const [bulkPlatform, setBulkPlatform] = useState<SocialPlatform>('instagram');
  const [bulkTone, setBulkTone] = useState<Tone>('friendly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Generated items
  const [items, setItems] = useState<BulkItemInput[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartBulkGeneration = async () => {
    const lines = rawTopicsText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      showToast('Please enter at least one topic line', 'error');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const initialList: BulkItemInput[] = lines.map((topic, i) => ({
      id: `bulk_${i}_${Date.now()}`,
      topic,
      platform: bulkPlatform,
      tone: bulkTone,
      status: 'pending',
    }));
    setItems(initialList);

    const updatedList = [...initialList];

    for (let i = 0; i < initialList.length; i++) {
      const item = initialList[i];
      try {
        const result = await generateCaptions({
          topic: item.topic,
          platform: bulkPlatform,
          category: 'general',
          tone: bulkTone,
          captionLength: 'medium',
          brandVoice: activeBrand,
          includeEmojis: true,
        });

        if (result.variations.length > 0) {
          updatedList[i] = {
            ...item,
            status: 'generated',
            result: result.variations[0],
          };
        } else {
          updatedList[i] = { ...item, status: 'failed' };
        }
      } catch {
        updatedList[i] = { ...item, status: 'failed' };
      }
      setProgress(Math.round(((i + 1) / initialList.length) * 100));
      setItems([...updatedList]);
    }

    setIsProcessing(false);
    setSelectedItemIds(updatedList.filter(it => it.status === 'generated').map(it => it.id));
    showToast(`Generated ${lines.length} captions in bulk!`);
  };

  const handleSaveAllSelected = () => {
    const selected = items.filter(it => selectedItemIds.includes(it.id) && it.result);
    if (selected.length === 0) {
      showToast('No generated posts selected to save', 'error');
      return;
    }

    selected.forEach(it => {
      const draft: Draft = {
        id: `draft_bulk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: it.topic,
        content: it.result!.text,
        platform: it.platform,
        category: 'general',
        tone: it.tone,
        hashtags: it.result!.suggestedHashtags,
        brandProfileId: activeBrand?.id,
        isFavorite: false,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: it.result!.source,
        characterCount: it.result!.text.length,
      };
      storage.saveDraft(draft);
    });

    onBulkDraftsSaved();
    showToast(`Saved ${selected.length} posts to Draft Library!`);
    onClose();
  };

  const handleExportCsv = () => {
    const selected = items.filter(it => selectedItemIds.includes(it.id) && it.result);
    if (selected.length === 0) return;

    const headers = ['Topic', 'Platform', 'Tone', 'Caption', 'Hashtags'];
    const rows = selected.map(it => [
      `"${it.topic.replace(/"/g, '""')}"`,
      `"${it.platform}"`,
      `"${it.tone}"`,
      `"${it.result!.text.replace(/"/g, '""')}"`,
      `"${it.result!.suggestedHashtags.map(t => `#${t}`).join(' ')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `socialmuse_bulk_export_${Date.now()}.csv`;
    link.click();
    showToast('Exported selected items to CSV');
  };

  const handleCopySelected = () => {
    const selected = items.filter(it => selectedItemIds.includes(it.id) && it.result);
    if (selected.length === 0) return;

    const combined = selected
      .map((it, idx) => `=== Post ${idx + 1}: ${it.topic} ===\n\n${it.result!.text}\n\n`)
      .join('\n');
    navigator.clipboard.writeText(combined);
    showToast(`Copied ${selected.length} captions to clipboard!`);
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map(it => it.id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCEBFA] dark:bg-[#24354C] flex items-center justify-center text-[#29283A] dark:text-[#DCEBFA]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
                Bulk Content Generator
              </h3>
              <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
                Generate multiple drafts simultaneously from an idea list.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {items.length === 0 ? (
            /* Input Phase */
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#29283A] dark:text-[#F3F2FA]">
                  Enter Topics or Angles (1 per line)
                </label>
                <textarea
                  value={rawTopicsText}
                  onChange={e => setRawTopicsText(e.target.value)}
                  rows={6}
                  placeholder="Topic 1&#10;Topic 2&#10;Topic 3..."
                  className="w-full text-xs p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                    Target Platform
                  </label>
                  <select
                    value={bulkPlatform}
                    onChange={e => setBulkPlatform(e.target.value as SocialPlatform)}
                    className="w-full text-xs p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 capitalize"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    <option value="x">X (Twitter)</option>
                    <option value="threads">Threads</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
                    Desired Tone
                  </label>
                  <select
                    value={bulkTone}
                    onChange={e => setBulkTone(e.target.value as Tone)}
                    className="w-full text-xs p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 capitalize"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="inspirational">Inspirational</option>
                    <option value="educational">Educational</option>
                    <option value="luxury">Luxury</option>
                    <option value="humorous">Humorous</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#DCD5FA]/30 dark:bg-white/5 border border-white/60 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
                Applying brand voice: <strong className="text-slate-900 dark:text-white">{activeBrand?.name}</strong>.
              </div>

              <button
                onClick={handleStartBulkGeneration}
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#DCD5FA]" />
                <span>Start Batch Generation</span>
              </button>
            </div>
          ) : (
            /* Results Review Phase */
            <div className="space-y-3">
              {isProcessing && (
                <div className="p-3 rounded-2xl glass-panel space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Batch Generation in Progress</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-[#6C5CE7] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs px-1">
                <button
                  onClick={toggleSelectAll}
                  className="font-semibold text-[#6C5CE7] dark:text-[#DCD5FA]"
                >
                  {selectedItemIds.length === items.length ? 'Deselect All' : 'Select All'} (
                  {selectedItemIds.length}/{items.length})
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySelected}
                    className="p-1.5 rounded-lg glass-panel hover:bg-white flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleExportCsv}
                    className="p-1.5 rounded-lg glass-panel hover:bg-white flex items-center gap-1 text-[11px] font-medium"
                  >
                    <FileSpreadsheet className="w-3 h-3" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {items.map((item, idx) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  const isEditing = editingItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl glass-panel border border-white/70 dark:border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedItemIds(prev =>
                                prev.includes(item.id)
                                  ? prev.filter(id => id !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                            className="rounded border-slate-300 text-[#6C5CE7] focus:ring-0"
                          />
                          <span className="font-bold text-[#29283A] dark:text-[#F3F2FA]">
                            Post #{idx + 1}: {item.topic}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10">
                          {item.status}
                        </span>
                      </div>

                      {item.result && (
                        <div>
                          {isEditing ? (
                            <textarea
                              value={item.result.text}
                              onChange={e => {
                                const newText = e.target.value;
                                setItems(prev =>
                                  prev.map(it =>
                                    it.id === item.id
                                      ? { ...it, result: { ...it.result!, text: newText } }
                                      : it
                                  )
                                );
                              }}
                              rows={4}
                              className="w-full text-xs p-2 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10"
                            />
                          ) : (
                            <p className="text-xs text-[#77758A] dark:text-[#C5C3D6] line-clamp-3 leading-relaxed">
                              {item.result.text}
                            </p>
                          )}
                          <div className="flex items-center justify-end gap-2 pt-1 text-[11px]">
                            <button
                              onClick={() => setEditingItemId(isEditing ? null : item.id)}
                              className="text-[#6C5CE7] dark:text-[#DCD5FA] font-medium"
                            >
                              {isEditing ? 'Done Editing' : 'Edit Text'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/60 dark:border-white/10 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                setItems([]);
                setSelectedItemIds([]);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Start New Batch
            </button>
            <button
              onClick={handleSaveAllSelected}
              disabled={selectedItemIds.length === 0}
              className="px-5 py-2.5 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-bold shadow-md hover:opacity-95 active:scale-95 disabled:opacity-50"
            >
              Save Selected to Drafts ({selectedItemIds.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
