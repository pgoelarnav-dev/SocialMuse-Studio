import React, { useState } from 'react';
import {
  Sliders,
  Moon,
  Sun,
  Palette,
  Smartphone,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Info,
  Check,
  ExternalLink,
} from 'lucide-react';
import { UserSettings, SocialPlatform, Tone, CaptionLength } from '../types';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';

interface ProfileSettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onDataRestored: () => void;
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

const ACCENT_COLORS = [
  { id: 'lavender', label: 'Lavender', hex: '#DCD5FA' },
  { id: 'pink', label: 'Soft Pink', hex: '#F7DCE8' },
  { id: 'mint', label: 'Mint', hex: '#D7F0E3' },
  { id: 'blue', label: 'Powder Blue', hex: '#DCEBFA' },
  { id: 'peach', label: 'Peach', hex: '#F9E3D3' },
];

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onDataRestored,
}) => {
  const { showToast } = useToast();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleExportBackup = () => {
    const jsonStr = storage.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `socialmuse_backup_${Date.now()}.json`;
    link.click();
    showToast('Backup JSON exported successfully!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const result = storage.importBackupJson(content);
        if (result.success) {
          onDataRestored();
          showToast(result.message);
        } else {
          showToast(result.message, 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    storage.resetToDefaultSeeds();
    onDataRestored();
    setIsResetConfirmOpen(false);
    showToast('App reset to clean multi-niche starter data');
  };

  return (
    <div className="p-4 space-y-6 pb-28">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA]">
          Studio Settings
        </h2>
        <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
          Personalize your appearance, defaults, and local data persistence.
        </p>
      </div>

      {/* Visual Identity & Theme */}
      <div className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-xs space-y-3.5">
        <h3 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#6C5CE7] dark:text-[#DCD5FA]" />
          <span>Appearance & Theme</span>
        </h3>

        {/* Theme mode buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
            Theme Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map(m => (
              <button
                key={m}
                onClick={() => onUpdateSettings({ theme: m })}
                className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  settings.theme === m
                    ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] shadow-xs'
                    : 'bg-white/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Pastel Accent Palette */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
            Glassmorphic Pastel Accent
          </label>
          <div className="flex items-center gap-2.5">
            {ACCENT_COLORS.map(acc => (
              <button
                key={acc.id}
                onClick={() => onUpdateSettings({ accentColor: acc.id as any })}
                className={`w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center ${
                  settings.accentColor === acc.id
                    ? 'border-[#29283A] dark:border-white scale-110 shadow-xs'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: acc.hex }}
                title={acc.label}
              >
                {settings.accentColor === acc.id && (
                  <Check className="w-3.5 h-3.5 text-[#29283A]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Device frame switch */}
        <div className="flex items-center justify-between pt-2 border-t border-white/60 dark:border-white/10 text-xs">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Android Phone Frame View
            </span>
            <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
              Simulates real device status bars, notch, and gesture pills.
            </p>
          </div>
          <button
            onClick={() => onUpdateSettings({ deviceFrameEnabled: !settings.deviceFrameEnabled })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              settings.deviceFrameEnabled ? 'bg-[#6C5CE7]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.deviceFrameEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Default Presets */}
      <div className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#6C5CE7] dark:text-[#DCD5FA]" />
          <span>Default Caption Preferences</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
              Default Platform
            </label>
            <select
              value={settings.defaultPlatform}
              onChange={e => onUpdateSettings({ defaultPlatform: e.target.value as SocialPlatform })}
              className="w-full p-2 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 capitalize"
            >
              {ALL_PLATFORMS.map(p => (
                <option key={p} value={p} className="capitalize">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
              Default Tone
            </label>
            <select
              value={settings.defaultTone}
              onChange={e => onUpdateSettings({ defaultTone: e.target.value as Tone })}
              className="w-full p-2 rounded-xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 capitalize"
            >
              {ALL_TONES.map(t => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4]">
            Default Length
          </label>
          <div className="flex items-center gap-2">
            {(['short', 'medium', 'long'] as CaptionLength[]).map(l => (
              <button
                key={l}
                onClick={() => onUpdateSettings({ defaultLength: l })}
                className={`flex-1 py-1.5 rounded-xl capitalize font-medium transition-all ${
                  settings.defaultLength === l
                    ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A]'
                    : 'bg-white/60 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#29283A] dark:text-[#F3F2FA] flex items-center gap-2">
          <Download className="w-4 h-4 text-[#6C5CE7] dark:text-[#DCD5FA]" />
          <span>Data Backup & Portability</span>
        </h3>
        <p className="text-xs text-[#77758A] dark:text-[#9D9AB4]">
          All your content is stored locally in your browser storage. Export a full backup or restore existing data.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="flex-1 py-2 px-3 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-xs font-semibold text-slate-800 dark:text-slate-200 border border-white/60 dark:border-white/10 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex-1 py-2 px-3 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white text-xs font-semibold text-slate-800 dark:text-slate-200 border border-white/60 dark:border-white/10 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-white/60 dark:border-white/10 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              Reset Local Database
            </span>
            <p className="text-[11px] text-[#77758A] dark:text-[#9D9AB4]">
              Restores initial starter templates and sample drafts.
            </p>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-900"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 100% Free & Open Architecture Disclosure */}
      <div className="p-4 rounded-3xl glass-panel border border-[#D7F0E3] dark:border-white/10 shadow-xs space-y-2.5 text-xs bg-gradient-to-br from-[#D7F0E3]/30 via-white/60 to-[#DCD5FA]/20 dark:from-[#1A2E24] dark:to-[#1E1D2E]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <h3 className="font-bold text-slate-900 dark:text-white">
            100% Free & Completely Unrestricted
          </h3>
        </div>
        <p className="text-[#77758A] dark:text-[#C5C3D6] leading-relaxed">
          SocialMuse Studio is completely free. There are no subscriptions, paywalls, premium tiers, trial limits, or locked features.
        </p>
        <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
          <p>
            • <strong>Local Engine</strong>: 100% free, unlimited runs, zero network required, and runs entirely in your device storage.
          </p>
          <p>
            • <strong>Optional Gemini AI</strong>: Connects via your secure server environment. Note that external Google Gemini API usage is subject to Google developer quotas/terms if you connect your own API key.
          </p>
        </div>
      </div>

      {/* About & Privacy */}
      <div className="p-4 rounded-3xl glass-panel border border-white/70 dark:border-white/10 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#6C5CE7] dark:text-[#DCD5FA]" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              SocialMuse Studio
            </span>
          </div>
          <span className="font-mono text-slate-400 text-[11px]">v1.0.0 (Free & Open)</span>
        </div>
        <p className="text-[#77758A] dark:text-[#9D9AB4] leading-relaxed">
          Free, offline-first social media productivity toolkit built for Android and modern web runtimes. No tracking, zero third-party telemetry, 100% private.
        </p>
        <div className="pt-1 flex items-center gap-3 text-[11px] font-semibold text-[#6C5CE7] dark:text-[#DCD5FA]">
          <button onClick={() => setIsPrivacyModalOpen(true)}>
            Privacy Guarantee
          </button>
          <span>·</span>
          <span>MIT License</span>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Application Data"
        message="This will replace all your current drafts, brand profiles, and calendar posts with the starter multi-niche pack. Are you sure?"
        confirmLabel="Reset Everything"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Privacy Guarantee Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl p-6 glass-panel border border-white/70 dark:border-white/10 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Privacy Architecture
              </h3>
            </div>
            <p className="text-[#77758A] dark:text-[#C5C3D6] leading-relaxed">
              SocialMuse Studio stores all drafts, brand voices, hashtags, and schedules directly on your device.
            </p>
            <p className="text-[#77758A] dark:text-[#C5C3D6] leading-relaxed">
              When Gemini AI is invoked, only the prompt context is sent to the server-side API proxy. Your personal drafts and profiles are never retained or logged.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#29283A] text-white dark:bg-white dark:text-[#12111A] font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
