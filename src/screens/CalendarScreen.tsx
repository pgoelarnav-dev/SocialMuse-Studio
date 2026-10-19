import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Copy,
  Tag,
  AlertCircle,
  X,
} from 'lucide-react';
import { CalendarPost, SocialPlatform, PostStatus } from '../types';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';

interface CalendarScreenProps {
  calendarPosts: CalendarPost[];
  onRefreshCalendar: () => void;
  onOpenCreateWithContent?: (content: string, platform: SocialPlatform) => void;
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

const STATUS_COLORS: Record<PostStatus, { bg: string; text: string }> = {
  idea: { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300' },
  draft: { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300' },
  planned: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300' },
  published: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300' },
  archived: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  calendarPosts,
  onRefreshCalendar,
  onOpenCreateWithContent,
}) => {
  const { showToast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPostDetail, setSelectedPostDetail] = useState<CalendarPost | null>(null);

  // New/Edit post modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalPlatform, setModalPlatform] = useState<SocialPlatform>('instagram');
  const [modalDate, setModalDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalTime, setModalTime] = useState('10:00');
  const [modalStatus, setModalStatus] = useState<PostStatus>('planned');
  const [modalCampaign, setModalCampaign] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleOpenAddModal = (defaultDate?: string) => {
    setEditingPostId(null);
    setModalTitle('');
    setModalContent('');
    setModalPlatform('instagram');
    setModalDate(defaultDate || new Date().toISOString().split('T')[0]);
    setModalTime('10:00');
    setModalStatus('planned');
    setModalCampaign('');
    setModalNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: CalendarPost) => {
    setEditingPostId(post.id);
    setModalTitle(post.title);
    setModalContent(post.content);
    setModalPlatform(post.platform);
    setModalDate(post.scheduledDate);
    setModalTime(post.scheduledTime);
    setModalStatus(post.status);
    setModalCampaign(post.campaign || '');
    setModalNotes(post.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveModalPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const post: CalendarPost = {
      id: editingPostId || `cal_${Date.now()}`,
      title: modalTitle.trim(),
      content: modalContent.trim(),
      platform: modalPlatform,
      scheduledDate: modalDate,
      scheduledTime: modalTime,
      status: modalStatus,
      campaign: modalCampaign.trim(),
      notes: modalNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    storage.saveCalendarPost(post);
    onRefreshCalendar();
    setIsModalOpen(false);
    showToast(editingPostId ? 'Scheduled post updated!' : 'Post added to planning calendar!');
  };

  const handleUpdateStatus = (id: string, status: PostStatus) => {
    storage.updatePostStatus(id, status);
    onRefreshCalendar();
    if (selectedPostDetail && selectedPostDetail.id === id) {
      setSelectedPostDetail({ ...selectedPostDetail, status });
    }
    showToast(status === 'published' ? 'Marked as published!' : `Status set to ${status}`);
  };

  const confirmDelete = () => {
    if (deleteCandidateId) {
      storage.deleteCalendarPost(deleteCandidateId);
      onRefreshCalendar();
      if (selectedPostDetail?.id === deleteCandidateId) {
        setSelectedPostDetail(null);
      }
      setDeleteCandidateId(null);
      showToast('Post removed from calendar');
    }
  };

  const filteredPosts = calendarPosts.filter(p => {
    const matchPlatform = selectedPlatform === 'all' || p.platform === selectedPlatform;
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchPlatform && matchStatus;
  });

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
            Content Calendar
          </h2>
          <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
            Plan, organize, and track your multi-channel publishing roadmap.
          </p>
        </div>
        <button
          onClick={() => handleOpenAddModal()}
          className="px-3.5 py-2 rounded-2xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Plan Post</span>
        </button>
      </div>

      {/* Month Navigation & Filters */}
      <div className="p-3.5 rounded-3xl glass-panel border border-white/70 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
              {monthNames[month]} {year}
            </h3>
            <span className="text-[10px] text-[#77758A] dark:text-[#9D9AB4]">
              · {filteredPosts.length} posts
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/70 dark:bg-white/10 text-slate-700 dark:text-slate-300"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            className="p-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-300 capitalize text-xs"
          >
            <option value="all">All Platforms</option>
            {ALL_PLATFORMS.map(p => (
              <option key={p} value={p} className="capitalize">
                {p}
              </option>
            ))}
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
        </div>
      </div>

      {/* Calendar Grid (Days of Month) */}
      <div className="p-3 rounded-3xl glass-panel border border-white/70 dark:border-white/10 space-y-2">
        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#77758A] dark:text-[#9D9AB4] pb-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty_${i}`} className="min-h-[52px] rounded-xl bg-transparent" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(
              dayNum
            ).padStart(2, '0')}`;
            const isToday =
              new Date().toISOString().split('T')[0] === formattedDate;

            const dayPosts = filteredPosts.filter(
              p => p.scheduledDate === formattedDate
            );

            return (
              <button
                key={dayNum}
                onClick={() => {
                  if (dayPosts.length > 0) {
                    setSelectedPostDetail(dayPosts[0]);
                  } else {
                    handleOpenAddModal(formattedDate);
                  }
                }}
                className={`min-h-[56px] p-1 rounded-xl text-left flex flex-col justify-between border transition-all ${
                  isToday
                    ? 'border-[#6C5CE7] bg-[#DCD5FA]/30 dark:bg-white/10'
                    : 'border-transparent bg-white/40 dark:bg-white/5 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold font-mono ${
                      isToday ? 'text-[#6C5CE7] dark:text-[#DCD5FA]' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayPosts.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7]" />
                  )}
                </div>

                {/* Micro post chips */}
                <div className="space-y-0.5">
                  {dayPosts.slice(0, 2).map(p => (
                    <div
                      key={p.id}
                      className="text-[9px] px-1 py-0.5 rounded truncate font-medium bg-[#DCD5FA]/80 dark:bg-[#34324D] text-[#29283A] dark:text-white"
                      title={p.title}
                    >
                      {p.title}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <span className="text-[8px] text-slate-400 block text-right font-mono">
                      +{dayPosts.length - 2}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Post Detail Drawer / Box */}
      {selectedPostDetail && (
        <div className="p-4 rounded-3xl glass-panel border border-[#DCD5FA] dark:border-white/20 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
                  {selectedPostDetail.title}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    STATUS_COLORS[selectedPostDetail.status].bg
                  } ${STATUS_COLORS[selectedPostDetail.status].text}`}
                >
                  {selectedPostDetail.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#77758A] dark:text-[#9D9AB4] mt-0.5">
                <span className="capitalize">{selectedPostDetail.platform}</span>
                <span>·</span>
                <span>{selectedPostDetail.scheduledDate} at {selectedPostDetail.scheduledTime}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPostDetail(null)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#77758A] dark:text-[#C5C3D6] whitespace-pre-wrap leading-relaxed line-clamp-4">
            {selectedPostDetail.content || 'No text attached to this post.'}
          </p>

          {selectedPostDetail.campaign && (
            <div className="flex items-center gap-1.5 text-xs text-[#6C5CE7] dark:text-[#DCD5FA]">
              <Tag className="w-3.5 h-3.5" />
              <span className="font-medium">{selectedPostDetail.campaign}</span>
            </div>
          )}

          {/* Status Changer & Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/60 dark:border-white/10 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Status:</span>
              {(['idea', 'draft', 'planned', 'published'] as PostStatus[]).map(st => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(selectedPostDetail.id, st)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize transition-all ${
                    selectedPostDetail.status === st
                      ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A]'
                      : 'bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEditModal(selectedPostDetail)}
                className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-white/10 text-slate-500"
                title="Edit Post"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteCandidateId(selectedPostDetail.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500"
                title="Delete Post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-[#29283A] dark:text-[#F3F2FA]">
                {editingPostId ? 'Edit Calendar Post' : 'Plan New Social Post'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModalPost} className="p-4 flex-1 overflow-y-auto space-y-3 no-scrollbar text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Post Title / Concept *
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={e => setModalTitle(e.target.value)}
                  placeholder="e.g. Ethiopian Yirgacheffe tasting carousel"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Caption Content
                </label>
                <textarea
                  value={modalContent}
                  onChange={e => setModalContent(e.target.value)}
                  rows={4}
                  placeholder="Draft your post or leave notes for execution..."
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Platform
                  </label>
                  <select
                    value={modalPlatform}
                    onChange={e => setModalPlatform(e.target.value as SocialPlatform)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 capitalize"
                  >
                    {ALL_PLATFORMS.map(p => (
                      <option key={p} value={p} className="capitalize">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={e => setModalStatus(e.target.value as PostStatus)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 capitalize"
                  >
                    <option value="idea">Idea</option>
                    <option value="draft">Draft</option>
                    <option value="planned">Planned</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={modalDate}
                    onChange={e => setModalDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={modalTime}
                    onChange={e => setModalTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Campaign / Label (optional)
                </label>
                <input
                  type="text"
                  value={modalCampaign}
                  onChange={e => setModalCampaign(e.target.value)}
                  placeholder="e.g. Q4 Harvest Launch"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Internal Notes
                </label>
                <input
                  type="text"
                  value={modalNotes}
                  onChange={e => setModalNotes(e.target.value)}
                  placeholder="e.g. Tag @coffeeroasters in first comment"
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] font-bold shadow-xs active:scale-95"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCandidateId}
        title="Delete Scheduled Post"
        message="Are you sure you want to remove this post from your planning calendar?"
        confirmLabel="Delete Post"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />
    </div>
  );
};
