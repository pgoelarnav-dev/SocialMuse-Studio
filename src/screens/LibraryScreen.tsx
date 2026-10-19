import React, { useState } from 'react';
import {
  FolderHeart,
  Search,
  Filter,
  Copy,
  Edit2,
  Trash2,
  Share2,
  Star,
  Download,
  Calendar,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { Draft, SocialPlatform, PostStatus } from '../types';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';

interface LibraryScreenProps {
  drafts: Draft[];
  onRefreshDrafts: () => void;
  onEditDraft: (draft: Draft) => void;
  onScheduleDraft: (title: string, content: string, platform: SocialPlatform) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  drafts,
  onRefreshDrafts,
  onEditDraft,
  onScheduleDraft,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([]);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);

  const handleToggleFavorite = (id: string) => {
    storage.toggleFavoriteDraft(id);
    onRefreshDrafts();
  };

  const handleDuplicate = (id: string) => {
    const copy = storage.duplicateDraft(id);
    if (copy) {
      onRefreshDrafts();
      showToast('Draft duplicated!');
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('Copied to clipboard!');
  };

  const handleShare = async (draft: Draft) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: draft.title,
          text: draft.content,
        });
      } catch {
        handleCopy(draft.content);
      }
    } else {
      handleCopy(draft.content);
    }
  };

  const confirmSingleDelete = () => {
    if (deleteCandidateId) {
      storage.deleteDraft(deleteCandidateId);
      onRefreshDrafts();
      setDeleteCandidateId(null);
      showToast('Draft deleted');
    }
  };

  const confirmBatchDelete = () => {
    selectedDraftIds.forEach(id => storage.deleteDraft(id));
    onRefreshDrafts();
    setSelectedDraftIds([]);
    setIsBatchDeleteModalOpen(false);
    showToast(`Deleted ${selectedDraftIds.length} drafts`);
  };

  const handleExportCsv = () => {
    const targetDrafts = selectedDraftIds.length > 0
      ? drafts.filter(d => selectedDraftIds.includes(d.id))
      : drafts;
    const csv = storage.exportDraftsToCsv(targetDrafts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `socialmuse_drafts_${Date.now()}.csv`;
    link.click();
    showToast(`Exported ${targetDrafts.length} drafts to CSV`);
  };

  const toggleSelectAll = () => {
    if (selectedDraftIds.length === filteredDrafts.length) {
      setSelectedDraftIds([]);
    } else {
      setSelectedDraftIds(filteredDrafts.map(d => d.id));
    }
  };

  const filteredDrafts = drafts.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hashtags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'all' || d.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || d.status === selectedStatus;
    const matchesFav = !onlyFavorites || d.isFavorite;

    return matchesSearch && matchesPlatform && matchesStatus && matchesFav;
  });

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
            Draft Library
          </h2>
          <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
            Organize, search, filter, and export your saved social copy.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportCsv}
            className="p-2 rounded-2xl glass-panel text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 hover:bg-white flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search saved drafts by keywords or title..."
            className="w-full text-xs pl-8 pr-3 py-2.5 rounded-2xl glass-panel border border-white/70 dark:border-white/10 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            className="p-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-300 capitalize text-xs"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="x">X (Twitter)</option>
            <option value="threads">Threads</option>
            <option value="facebook">Facebook</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="p-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-300 capitalize text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="idea">Idea</option>
            <option value="draft">Draft</option>
            <option value="planned">Planned</option>
            <option value="published">Published</option>
          </select>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 shrink-0 transition-colors ${
              onlyFavorites
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'glass-panel text-slate-600 dark:text-slate-400 hover:bg-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Batch Action Toolbar */}
      {selectedDraftIds.length > 0 && (
        <div className="p-2.5 rounded-2xl glass-panel border border-white/80 dark:border-white/10 flex items-center justify-between text-xs animate-in fade-in">
          <span className="font-semibold text-[#29283A] dark:text-[#F3F2FA]">
            {selectedDraftIds.length} drafts selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-slate-800 dark:text-white font-medium"
            >
              Export Selected
            </button>
            <button
              onClick={() => setIsBatchDeleteModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <div className="p-8 rounded-3xl glass-panel text-center space-y-2">
          <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">No drafts found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 text-xs">
            <button
              onClick={toggleSelectAll}
              className="text-[#6C5CE7] dark:text-[#DCD5FA] font-medium"
            >
              {selectedDraftIds.length === filteredDrafts.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-[#77758A] dark:text-[#9D9AB4] font-mono">
              {filteredDrafts.length} drafts
            </span>
          </div>

          {filteredDrafts.map(draft => {
            const isSelected = selectedDraftIds.includes(draft.id);

            return (
              <div
                key={draft.id}
                className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 space-y-2.5 hover:shadow-xs transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedDraftIds(prev =>
                          prev.includes(draft.id)
                            ? prev.filter(id => id !== draft.id)
                            : [...prev, draft.id]
                        );
                      }}
                      className="rounded border-slate-300 text-[#6C5CE7] focus:ring-0 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA] truncate">
                        {draft.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
                        <span className="capitalize">{draft.platform}</span>
                        <span>·</span>
                        <span className="capitalize">{draft.tone}</span>
                        <span>·</span>
                        <span className="font-mono">{draft.characterCount} chars</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(draft.id)}
                    className="p-1 text-slate-400 hover:text-amber-400 shrink-0"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        draft.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Content preview */}
                <p className="text-xs text-[#77758A] dark:text-[#C5C3D6] line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {draft.content}
                </p>

                {/* Hashtag tags */}
                {draft.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {draft.hashtags.slice(0, 4).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions row */}
                <div className="flex items-center justify-between pt-2 border-t border-white/60 dark:border-white/10 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(draft.content)}
                      className="p-1.5 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(draft.id)}
                      className="p-1.5 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Duplicate"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        onScheduleDraft(draft.title, draft.content, draft.platform)
                      }
                      className="p-1.5 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Plan in Calendar"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidateId(draft.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onEditDraft(draft)}
                    className="px-3 py-1 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-[11px] font-semibold flex items-center gap-1 shadow-xs active:scale-95"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Open in Editor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCandidateId}
        title="Delete Draft"
        message="Are you sure you want to permanently delete this draft?"
        confirmLabel="Delete Draft"
        onConfirm={confirmSingleDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />

      {/* Batch Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBatchDeleteModalOpen}
        title="Delete Multiple Drafts"
        message={`Are you sure you want to permanently delete ${selectedDraftIds.length} selected drafts?`}
        confirmLabel="Delete Selected"
        onConfirm={confirmBatchDelete}
        onCancel={() => setIsBatchDeleteModalOpen(false)}
      />
    </div>
  );
};
