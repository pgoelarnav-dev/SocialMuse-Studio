import React, { useState } from 'react';
import { Sparkles, Moon, Sun, ChevronDown, Check } from 'lucide-react';
import { BrandProfile } from '../types';

interface TopBarProps {
  title?: string;
  brands: BrandProfile[];
  activeBrandId?: string;
  onSelectBrand: (brandId: string) => void;
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  brands,
  activeBrandId,
  onSelectBrand,
  theme,
  onToggleTheme,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const activeBrand = brands.find(b => b.id === activeBrandId) || brands[0];

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/60 dark:border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 shadow-xs">
      {/* Zone 1: Brand title / Screen title */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#DCD5FA] to-[#F7DCE8] dark:from-[#34324D] dark:to-[#443859] flex items-center justify-center shadow-xs shrink-0">
          <Sparkles className="w-4 h-4 text-[#29283A] dark:text-[#DCD5FA]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold tracking-tight text-[#29283A] dark:text-[#F3F2FA] truncate">
            {title || 'SocialMuse'}
          </h1>
        </div>
      </div>

      {/* Zone 2: Brand Voice Switcher */}
      <div className="relative shrink-0">
        {brands.length > 0 && (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-white/60 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all max-w-[160px]"
          >
            <span className="truncate">{activeBrand?.name || 'Select Brand'}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          </button>
        )}

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-1.5 w-56 rounded-2xl glass-panel border border-white/70 dark:border-white/10 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-[#77758A] dark:text-[#9D9AB4] uppercase tracking-wider">
                Active Brand Voice
              </div>
              <div className="space-y-0.5">
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSelectBrand(b.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-colors ${
                      b.id === activeBrand?.id
                        ? 'bg-[#DCD5FA]/60 dark:bg-white/15 font-semibold text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    {b.id === activeBrand?.id && (
                      <Check className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Zone 3: Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 transition-colors shrink-0"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  );
};
