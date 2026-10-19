import React from 'react';
import {
  Sparkles,
  Hash,
  Layers,
  FileText,
  Calendar as CalendarIcon,
  ArrowRight,
  Clock,
  CheckCircle2,
  Copy,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Draft, CalendarPost, BrandProfile, HashtagGroup } from '../types';
import { useToast } from '../components/Toast';

interface HomeScreenProps {
  activeBrand: BrandProfile;
  drafts: Draft[];
  calendarPosts: CalendarPost[];
  hashtagGroups: HashtagGroup[];
  onNavigateTab: (tab: 'home' | 'create' | 'library' | 'calendar' | 'profile') => void;
  onOpenHashtagToolkit: () => void;
  onOpenBulkCreator: () => void;
  onOpenTemplates: () => void;
  onSelectDraftForEdit: (draft: Draft) => void;
  onToggleFavoriteDraft: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeBrand,
  drafts,
  calendarPosts,
  hashtagGroups,
  onNavigateTab,
  onOpenHashtagToolkit,
  onOpenBulkCreator,
  onOpenTemplates,
  onSelectDraftForEdit,
  onToggleFavoriteDraft,
}) => {
  const { showToast } = useToast();

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const recentDrafts = [...drafts].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 4);
  const upcomingPosts = [...calendarPosts]
    .filter(p => p.status === 'planned' || p.status === 'draft')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 3);

  // Real local stats
  const totalDrafts = drafts.length;
  const plannedCount = calendarPosts.filter(p => p.status === 'planned').length;
  const publishedCount = calendarPosts.filter(p => p.status === 'published').length;
  const hashtagCount = hashtagGroups.length;

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Caption copied to clipboard!');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header Greeting & Date */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#77758A] dark:text-[#9D9AB4] tracking-wide">
            {todayStr}
          </span>
          <span className="text-xs font-semibold text-[#6C5CE7] dark:text-[#DCD5FA] bg-[#DCD5FA]/40 dark:bg-[#34324D] px-2.5 py-0.5 rounded-full">
            {activeBrand?.name || 'Studio Mode'}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
          {getGreeting()}, Creator.
        </h2>
        <p className="text-sm text-[#77758A] dark:text-[#9D9AB4]">
          Ready to compose brand-aligned content across your social channels.
        </p>
      </div>

      {/* Primary Hero CTA Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#DCD5FA]/90 via-[#F7DCE8]/70 to-[#DCEBFA]/80 dark:from-[#2B2745] dark:via-[#35273C] dark:to-[#223247] border border-white/80 dark:border-white/10 shadow-sm">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 dark:bg-white/10 text-xs font-semibold text-[#29283A] dark:text-[#F3F2FA]">
            <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7] dark:text-[#DCD5FA]" />
            <span>Caption Engine Ready</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#29283A] dark:text-[#F3F2FA]">
              Create New Social Content
            </h3>
            <p className="text-xs text-[#77758A] dark:text-[#C5C3D6] max-w-xs mt-1">
              Craft multi-platform captions with tone tuning, hook variations, and tailored hashtags.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-semibold shadow-md active:scale-95 transition-transform"
          >
            <span>Open Creator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Matrix (4 functional tiles) */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4] px-1">
          Quick Workflows
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('create')}
            className="p-3.5 rounded-2xl glass-panel text-left flex items-start gap-3 hover:shadow-sm active:scale-[0.98] transition-all border border-white/70 dark:border-white/10"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F7DCE8] dark:bg-[#482D3D] flex items-center justify-center text-[#29283A] dark:text-[#F7DCE8] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">Captions</h4>
              <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4] truncate mt-0.5">
                Single post creation
              </p>
            </div>
          </button>

          <button
            onClick={onOpenHashtagToolkit}
            className="p-3.5 rounded-2xl glass-panel text-left flex items-start gap-3 hover:shadow-sm active:scale-[0.98] transition-all border border-white/70 dark:border-white/10"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D7F0E3] dark:bg-[#204231] flex items-center justify-center text-[#29283A] dark:text-[#D7F0E3] shrink-0">
              <Hash className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">Hashtags</h4>
              <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4] truncate mt-0.5">
                Discover & collections
              </p>
            </div>
          </button>

          <button
            onClick={onOpenBulkCreator}
            className="p-3.5 rounded-2xl glass-panel text-left flex items-start gap-3 hover:shadow-sm active:scale-[0.98] transition-all border border-white/70 dark:border-white/10"
          >
            <div className="w-9 h-9 rounded-xl bg-[#DCEBFA] dark:bg-[#24354C] flex items-center justify-center text-[#29283A] dark:text-[#DCEBFA] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">Bulk Create</h4>
              <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4] truncate mt-0.5">
                Batch multi-post generator
              </p>
            </div>
          </button>

          <button
            onClick={onOpenTemplates}
            className="p-3.5 rounded-2xl glass-panel text-left flex items-start gap-3 hover:shadow-sm active:scale-[0.98] transition-all border border-white/70 dark:border-white/10"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F9E3D3] dark:bg-[#463124] flex items-center justify-center text-[#29283A] dark:text-[#F9E3D3] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">Templates</h4>
              <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4] truncate mt-0.5">
                Reusable proven formulas
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Content Creation Overview Statistics */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4] px-1">
          Content Metrics
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-2xl glass-panel text-center">
            <span className="block text-xl font-bold font-mono text-[#29283A] dark:text-[#F3F2FA]">
              {totalDrafts}
            </span>
            <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] font-medium">Drafts</span>
          </div>
          <div className="p-3 rounded-2xl glass-panel text-center">
            <span className="block text-xl font-bold font-mono text-[#6C5CE7] dark:text-[#DCD5FA]">
              {plannedCount}
            </span>
            <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] font-medium">Planned</span>
          </div>
          <div className="p-3 rounded-2xl glass-panel text-center">
            <span className="block text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {publishedCount}
            </span>
            <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] font-medium">Published</span>
          </div>
          <div className="p-3 rounded-2xl glass-panel text-center">
            <span className="block text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {hashtagCount}
            </span>
            <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] font-medium">Hashtags</span>
          </div>
        </div>
      </div>

      {/* Recent Drafts Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4]">
            Recent Drafts
          </h3>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-medium text-[#6C5CE7] dark:text-[#DCD5FA] hover:underline"
          >
            View all
          </button>
        </div>

        {recentDrafts.length === 0 ? (
          <div className="p-6 rounded-3xl glass-panel text-center space-y-2">
            <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">No drafts created yet.</p>
            <button
              onClick={() => onNavigateTab('create')}
              className="text-xs font-semibold text-[#6C5CE7] dark:text-[#DCD5FA]"
            >
              + Create your first caption
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentDrafts.map(draft => (
              <div
                key={draft.id}
                className="p-3.5 rounded-2xl glass-panel border border-white/70 dark:border-white/10 space-y-2 hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#29283A] dark:text-[#F3F2FA] truncate max-w-[180px]">
                      {draft.title}
                    </span>
                    <span className="text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
                      · {draft.platform}
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleFavoriteDraft(draft.id)}
                    className="p-1 text-slate-400 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        draft.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-[#77758A] dark:text-[#C5C3D6] line-clamp-2 leading-relaxed">
                  {draft.content}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4] font-mono">
                    {draft.characterCount} chars
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyDraft(draft.content)}
                      className="px-2.5 py-1 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => onSelectDraftForEdit(draft)}
                      className="px-2.5 py-1 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-[11px] font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Planned Posts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#9D9AB4]">
            Upcoming Schedule
          </h3>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-medium text-[#6C5CE7] dark:text-[#DCD5FA] hover:underline"
          >
            Calendar
          </button>
        </div>

        {upcomingPosts.length === 0 ? (
          <div className="p-4 rounded-2xl glass-panel text-center">
            <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">No posts scheduled for this week.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingPosts.map(post => (
              <div
                key={post.id}
                className="p-3 rounded-2xl glass-panel flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#DCD5FA]/60 dark:bg-[#34324D] flex items-center justify-center text-[#29283A] dark:text-[#DCD5FA] shrink-0">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-[#29283A] dark:text-[#F3F2FA] truncate">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
                      <span>{post.scheduledDate}</span>
                      <span>·</span>
                      <span className="capitalize">{post.platform}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shrink-0">
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
