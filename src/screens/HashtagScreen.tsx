import React, { useState } from 'react';
import {
  Hash,
  Sparkles,
  Copy,
  Plus,
  Trash2,
  FolderPlus,
  Download,
  Filter,
  Check,
  Search,
  Star,
  ExternalLink,
  GitMerge,
} from 'lucide-react';
import { HashtagGroup, ContentCategory, SocialPlatform, BrandProfile } from '../types';
import { discoverHashtags } from '../services/aiClient';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';

interface HashtagScreenProps {
  hashtagGroups: HashtagGroup[];
  brands: BrandProfile[];
  onRefreshGroups: () => void;
  onInsertIntoCaption?: (tags: string[]) => void;
}

export const HashtagScreen: React.FC<HashtagScreenProps> = ({
  hashtagGroups,
  brands,
  onRefreshGroups,
  onInsertIntoCaption,
}) => {
  const { showToast } = useToast();

  // Search & Discover
  const [topicInput, setTopicInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>('lifestyle');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [isSearching, setIsSearching] = useState(false);
  const [discoveredTags, setDiscoveredTags] = useState<{
    broad: string[];
    niche: string[];
    industry: string[];
    campaign: string[];
    all: string[];
  }>({
    broad: [],
    niche: [],
    industry: [],
    campaign: [],
    all: [],
  });
  const [selectedTagsForCollection, setSelectedTagsForCollection] = useState<string[]>([]);

  // Filter existing groups
  const [filterText, setFilterText] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Group selection for merge
  const [selectedGroupIdsForMerge, setSelectedGroupIdsForMerge] = useState<string[]>([]);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergedGroupName, setMergedGroupName] = useState('');

  const handleDiscover = async () => {
    if (!topicInput.trim()) {
      showToast('Please enter a topic to discover hashtags', 'error');
      return;
    }

    setIsSearching(true);
    try {
      const result = await discoverHashtags(topicInput.trim(), selectedCategory, selectedPlatform);
      setDiscoveredTags(result);
      setSelectedTagsForCollection(result.all.slice(0, 8));
      showToast(`Discovered ${result.all.length} hashtags!`);
    } catch {
      showToast('Failed to discover hashtags', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelectTag = (tag: string) => {
    setSelectedTagsForCollection(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCopySelected = () => {
    if (selectedTagsForCollection.length === 0) return;
    const formatted = selectedTagsForCollection.map(t => `#${t}`).join(' ');
    navigator.clipboard.writeText(formatted);
    showToast(`Copied ${selectedTagsForCollection.length} hashtags!`);
  };

  const handleSaveDiscoveredAsGroup = () => {
    if (selectedTagsForCollection.length === 0) {
      showToast('Select at least one hashtag to save', 'error');
      return;
    }
    const name = newGroupName.trim() || `${topicInput || selectedCategory} Pack`;
    const newGroup: HashtagGroup = {
      id: `hash_${Date.now()}`,
      name,
      category: selectedCategory,
      hashtags: Array.from(new Set(selectedTagsForCollection.map(t => t.replace('#', '').toLowerCase()))),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
    storage.saveHashtagGroup(newGroup);
    onRefreshGroups();
    setNewGroupName('');
    setIsCreatingGroup(false);
    showToast(`Saved collection "${name}"!`);
  };

  const handleDeleteGroup = (id: string) => {
    storage.deleteHashtagGroup(id);
    onRefreshGroups();
    showToast('Hashtag collection deleted');
  };

  const handleExportCsv = () => {
    const csvData = storage.exportHashtagsToCsv(hashtagGroups);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `socialmuse_hashtags_${Date.now()}.csv`;
    link.click();
    showToast('Exported collections to CSV');
  };

  const handleExportTxt = (group: HashtagGroup) => {
    const txtData = group.hashtags.map(t => `#${t}`).join(' ');
    const blob = new Blob([txtData], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${group.name.replace(/\s+/g, '_')}_hashtags.txt`;
    link.click();
    showToast(`Exported ${group.name} to TXT`);
  };

  const handleMergeGroups = () => {
    if (selectedGroupIdsForMerge.length < 2) {
      showToast('Select at least 2 groups to merge', 'error');
      return;
    }
    const merged = storage.mergeHashtagGroups(
      selectedGroupIdsForMerge[0],
      selectedGroupIdsForMerge[1],
      mergedGroupName.trim() || 'Merged Collection'
    );
    if (merged) {
      onRefreshGroups();
      setSelectedGroupIdsForMerge([]);
      setIsMergeModalOpen(false);
      setMergedGroupName('');
      showToast('Collections merged and deduplicated successfully!');
    }
  };

  const filteredGroups = hashtagGroups.filter(
    g =>
      g.name.toLowerCase().includes(filterText.toLowerCase()) ||
      g.category.toLowerCase().includes(filterText.toLowerCase()) ||
      g.hashtags.some(t => t.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="p-4 space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
            Hashtag Discovery & Collections
          </h2>
          <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
            Generate keyword-based tags, organize packs, and eliminate duplicates.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="p-2 rounded-2xl glass-panel text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 hover:bg-white flex items-center gap-1.5 text-xs font-semibold shadow-xs"
          title="Export All to CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV</span>
        </button>
      </div>

      {/* Discovery Tool Box */}
      <div className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#D7F0E3] dark:bg-[#204231] flex items-center justify-center text-[#29283A] dark:text-[#D7F0E3]">
            <Hash className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">
            Discover Relevant Hashtags
          </h3>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            placeholder="Enter niche or topic (e.g., specialty coffee, home barista)..."
            className="w-full text-xs p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 focus:outline-hidden focus:ring-2 focus:ring-[#DCD5FA] placeholder-slate-400 text-slate-800 dark:text-slate-100"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as ContentCategory)}
              className="text-xs p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 capitalize"
            >
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="technology">Technology</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="fitness">Fitness</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
            </select>

            <button
              onClick={handleDiscover}
              disabled={isSearching || !topicInput.trim()}
              className="py-2.5 px-4 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSearching ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#DCD5FA]" />
                  <span>Discover Tags</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Discovered tags render */}
        {discoveredTags.all.length > 0 && (
          <div className="pt-3 border-t border-white/60 dark:border-white/10 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Selected: {selectedTagsForCollection.length} of {discoveredTags.all.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTagsForCollection(discoveredTags.all)}
                  className="text-[11px] font-medium text-[#6C5CE7] dark:text-[#DCD5FA]"
                >
                  Select All
                </button>
                <span>·</span>
                <button
                  onClick={handleCopySelected}
                  className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Tag Buckets */}
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar p-1">
              {discoveredTags.all.map(tag => {
                const isSelected = selectedTagsForCollection.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleSelectTag(tag)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] shadow-xs'
                        : 'bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-white'
                    }`}
                  >
                    <span>#{tag}</span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>

            {/* Save as collection trigger */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="Collection name (e.g., Pour Over Pack)..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
              />
              <button
                onClick={handleSaveDiscoveredAsGroup}
                className="px-3 py-2 rounded-xl bg-[#DCD5FA] text-[#29283A] dark:bg-[#34324D] dark:text-[#DCD5FA] text-xs font-semibold shrink-0"
              >
                Save Collection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved Collections Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4]">
            Saved Collections ({filteredGroups.length})
          </h3>
          {selectedGroupIdsForMerge.length >= 2 && (
            <button
              onClick={() => setIsMergeModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-[#6C5CE7] text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Merge ({selectedGroupIdsForMerge.length})</span>
            </button>
          )}
        </div>

        {/* Search input for saved collections */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Search saved hashtag packs..."
            className="w-full text-xs pl-8 pr-3 py-2.5 rounded-2xl glass-panel border border-white/70 dark:border-white/10 text-slate-800 dark:text-slate-100"
          />
        </div>

        {filteredGroups.length === 0 ? (
          <div className="p-6 rounded-3xl glass-panel text-center">
            <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">No hashtag collections match your query.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredGroups.map(group => {
              const isSelectedForMerge = selectedGroupIdsForMerge.includes(group.id);
              return (
                <div
                  key={group.id}
                  className="p-3.5 rounded-2xl glass-panel border border-white/70 dark:border-white/10 space-y-2.5 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelectedForMerge}
                        onChange={() => {
                          setSelectedGroupIdsForMerge(prev =>
                            prev.includes(group.id)
                              ? prev.filter(id => id !== group.id)
                              : [...prev, group.id]
                          );
                        }}
                        className="rounded border-slate-300 text-[#6C5CE7] focus:ring-0"
                        title="Select for merge"
                      />
                      <h4 className="font-bold text-[#29283A] dark:text-[#F3F2FA]">
                        {group.name}
                      </h4>
                      <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] capitalize">
                        · {group.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleExportTxt(group)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Download TXT"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Hashtag chips */}
                  <div className="flex flex-wrap gap-1">
                    {group.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/60 dark:border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-[#77758A] dark:text-[#9D9AB4]">
                      {group.hashtags.length} hashtags
                    </span>
                    <button
                      onClick={() => {
                        const str = group.hashtags.map(t => `#${t}`).join(' ');
                        navigator.clipboard.writeText(str);
                        showToast(`Copied ${group.name} hashtags!`);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy All</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Merge Modal */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl p-5 glass-panel border border-white/70 dark:border-white/10 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
              Merge Hashtag Collections
            </h3>
            <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
              Selected {selectedGroupIdsForMerge.length} groups will be combined and duplicate hashtags automatically removed.
            </p>
            <input
              type="text"
              value={mergedGroupName}
              onChange={e => setMergedGroupName(e.target.value)}
              placeholder="Name for merged group..."
              className="w-full text-xs p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsMergeModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleMergeGroups}
                className="px-4 py-1.5 rounded-xl bg-[#6C5CE7] text-white text-xs font-semibold shadow-xs"
              >
                Merge & Deduplicate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
