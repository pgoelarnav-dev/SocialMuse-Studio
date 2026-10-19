import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { BottomNav, NavTab } from './components/BottomNav';

import { HomeScreen } from './screens/HomeScreen';
import { CreateScreen } from './screens/CreateScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { HashtagScreen } from './screens/HashtagScreen';
import { TemplatesScreen } from './screens/TemplatesScreen';
import { BrandVoiceScreen } from './screens/BrandVoiceScreen';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen';
import { BulkCreateModal } from './screens/BulkCreateModal';

import { storage } from './services/storage';
import {
  Draft,
  BrandProfile,
  HashtagGroup,
  CalendarPost,
  ContentTemplate,
  UserSettings,
  SocialPlatform,
} from './types';

export default function App() {
  return (
    <ToastProvider>
      <SocialMuseApp />
    </ToastProvider>
  );
}

function SocialMuseApp() {
  // State loaded from local storage
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const [brands, setBrands] = useState<BrandProfile[]>(() => storage.getBrandProfiles());
  const [drafts, setDrafts] = useState<Draft[]>(() => storage.getDrafts());
  const [hashtagGroups, setHashtagGroups] = useState<HashtagGroup[]>(() => storage.getHashtagGroups());
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>(() => storage.getCalendarPosts());
  const [templates, setTemplates] = useState<ContentTemplate[]>(() => storage.getTemplates());

  // Active navigation
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  // Secondary sub-views (overlay / stacked navigation)
  const [subView, setSubView] = useState<'none' | 'hashtags' | 'templates' | 'brands'>('none');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Draft currently being edited in CreateScreen
  const [draftToEdit, setDraftToEdit] = useState<Draft | null>(null);

  // Sync theme changes with DOM
  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Refresh helpers
  const refreshAllData = () => {
    setSettings(storage.getSettings());
    setBrands(storage.getBrandProfiles());
    setDrafts(storage.getDrafts());
    setHashtagGroups(storage.getHashtagGroups());
    setCalendarPosts(storage.getCalendarPosts());
    setTemplates(storage.getTemplates());
  };

  const activeBrand =
    brands.find(b => b.id === settings.activeBrandProfileId) || brands[0] || ({} as BrandProfile);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = storage.updateSettings(newSettings);
    setSettings(updated);
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({ theme: nextTheme });
  };

  const handleSelectDraftForEdit = (draft: Draft) => {
    setDraftToEdit(draft);
    setSubView('none');
    setActiveTab('create');
  };

  const handleSchedulePost = (title: string, content: string, platform: SocialPlatform) => {
    const newPost: CalendarPost = {
      id: `cal_${Date.now()}`,
      title,
      content,
      platform,
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: '12:00',
      status: 'planned',
      createdAt: new Date().toISOString(),
    };
    storage.saveCalendarPost(newPost);
    setCalendarPosts(storage.getCalendarPosts());
    setSubView('none');
    setActiveTab('calendar');
  };

  const handleUseTemplate = (completedText: string, platform: SocialPlatform) => {
    const newDraft: Draft = {
      id: `draft_from_tpl_${Date.now()}`,
      title: 'Template Draft',
      content: completedText,
      platform,
      category: 'general',
      tone: 'friendly',
      hashtags: [],
      brandProfileId: activeBrand?.id,
      isFavorite: false,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'local',
      characterCount: completedText.length,
    };
    setDraftToEdit(newDraft);
    setSubView('none');
    setActiveTab('create');
  };

  return (
    <AndroidFrame
      isFrameEnabled={settings.deviceFrameEnabled}
      onToggleFrame={() =>
        handleUpdateSettings({ deviceFrameEnabled: !settings.deviceFrameEnabled })
      }
    >
      {/* Top Application Bar */}
      <TopBar
        title={
          subView === 'hashtags'
            ? 'Hashtags'
            : subView === 'templates'
            ? 'Templates'
            : subView === 'brands'
            ? 'Brand Voices'
            : activeTab === 'home'
            ? 'SocialMuse Studio'
            : activeTab === 'create'
            ? 'Caption Studio'
            : activeTab === 'library'
            ? 'Drafts & Saved'
            : activeTab === 'calendar'
            ? 'Publishing Calendar'
            : 'Studio Settings'
        }
        brands={brands}
        activeBrandId={settings.activeBrandProfileId}
        onSelectBrand={id => handleUpdateSettings({ activeBrandProfileId: id })}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Subview Back Header (if currently in a subview like Hashtags or Templates) */}
      {subView !== 'none' && (
        <div className="sticky top-12 z-20 px-4 py-2 glass-panel-subtle flex items-center justify-between text-xs border-b border-white/40 dark:border-white/5">
          <button
            onClick={() => setSubView('none')}
            className="font-semibold text-[#6C5CE7] dark:text-[#DCD5FA] flex items-center gap-1"
          >
            ← Back to {activeTab}
          </button>
          <span className="text-slate-400 capitalize">{subView} Tool</span>
        </div>
      )}

      {/* Main View Switcher */}
      <main className="flex-1">
        {subView === 'hashtags' ? (
          <HashtagScreen
            hashtagGroups={hashtagGroups}
            brands={brands}
            onRefreshGroups={() => setHashtagGroups(storage.getHashtagGroups())}
          />
        ) : subView === 'templates' ? (
          <TemplatesScreen
            templates={templates}
            onRefreshTemplates={() => setTemplates(storage.getTemplates())}
            onUseTemplate={handleUseTemplate}
          />
        ) : subView === 'brands' ? (
          <BrandVoiceScreen
            brands={brands}
            activeBrandId={settings.activeBrandProfileId}
            onSelectActiveBrand={id => handleUpdateSettings({ activeBrandProfileId: id })}
            onRefreshBrands={() => setBrands(storage.getBrandProfiles())}
          />
        ) : activeTab === 'home' ? (
          <HomeScreen
            activeBrand={activeBrand}
            drafts={drafts}
            calendarPosts={calendarPosts}
            hashtagGroups={hashtagGroups}
            onNavigateTab={tab => {
              setSubView('none');
              setActiveTab(tab);
            }}
            onOpenHashtagToolkit={() => setSubView('hashtags')}
            onOpenBulkCreator={() => setIsBulkModalOpen(true)}
            onOpenTemplates={() => setSubView('templates')}
            onSelectDraftForEdit={handleSelectDraftForEdit}
            onToggleFavoriteDraft={id => {
              storage.toggleFavoriteDraft(id);
              setDrafts(storage.getDrafts());
            }}
          />
        ) : activeTab === 'create' ? (
          <CreateScreen
            activeBrand={activeBrand}
            brands={brands}
            initialDraft={draftToEdit}
            onClearInitialDraft={() => setDraftToEdit(null)}
            onSaveDraft={draft => {
              storage.saveDraft(draft);
              setDrafts(storage.getDrafts());
            }}
            onSchedulePost={handleSchedulePost}
          />
        ) : activeTab === 'library' ? (
          <LibraryScreen
            drafts={drafts}
            onRefreshDrafts={() => setDrafts(storage.getDrafts())}
            onEditDraft={handleSelectDraftForEdit}
            onScheduleDraft={handleSchedulePost}
          />
        ) : activeTab === 'calendar' ? (
          <CalendarScreen
            calendarPosts={calendarPosts}
            onRefreshCalendar={() => setCalendarPosts(storage.getCalendarPosts())}
          />
        ) : (
          <div className="space-y-4">
            {/* Quick Link to Brand Voice Manager */}
            <div className="p-4 mx-4 mt-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA]">
                  Brand Voice Profiles ({brands.length})
                </h4>
                <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
                  Manage custom tone presets & vocabulary
                </p>
              </div>
              <button
                onClick={() => setSubView('brands')}
                className="px-3 py-1.5 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] text-xs font-semibold"
              >
                Manage
              </button>
            </div>

            <ProfileSettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onDataRestored={refreshAllData}
            />
          </div>
        )}
      </main>

      {/* Bulk Content Generator Modal */}
      <BulkCreateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        activeBrand={activeBrand}
        onBulkDraftsSaved={() => setDrafts(storage.getDrafts())}
      />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={tab => {
          setSubView('none');
          setActiveTab(tab);
        }}
      />
    </AndroidFrame>
  );
}
