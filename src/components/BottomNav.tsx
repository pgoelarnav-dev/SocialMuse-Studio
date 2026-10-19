import React from 'react';
import { Home, Plus, FolderHeart, Calendar, Sliders } from 'lucide-react';

export type NavTab = 'home' | 'create' | 'library' | 'calendar' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'create' as NavTab, label: 'Create', icon: Plus, isPrimary: true },
    { id: 'library' as NavTab, label: 'Library', icon: FolderHeart },
    { id: 'calendar' as NavTab, label: 'Calendar', icon: Calendar },
    { id: 'profile' as NavTab, label: 'Profile', icon: Sliders },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-40 w-full glass-panel border-t border-white/60 dark:border-white/10 px-2 py-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.03)]"
    >
      <div className="grid grid-cols-5 items-center max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="flex flex-col items-center justify-center min-h-[48px] py-1 transition-transform active:scale-95 group"
                aria-label="Create New Content"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                    isActive
                      ? 'bg-[#29283A] text-white dark:bg-white dark:text-[#12111A]'
                      : 'bg-[#DCD5FA] text-[#29283A] dark:bg-[#34324D] dark:text-[#DCD5FA] group-hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                    isActive
                      ? 'text-[#29283A] dark:text-white font-semibold'
                      : 'text-[#77758A] dark:text-[#9D9AB4]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center min-h-[48px] py-1 transition-transform active:scale-95 group"
            >
              <div
                className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#DCD5FA]/70 dark:bg-white/15 text-[#29283A] dark:text-white'
                    : 'text-[#77758A] dark:text-[#9D9AB4] group-hover:text-slate-900 dark:group-hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive
                    ? 'text-[#29283A] dark:text-white font-bold'
                    : 'text-[#77758A] dark:text-[#9D9AB4] font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
