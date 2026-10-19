import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFrameEnabled: boolean;
  onToggleFrame: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFrameEnabled,
  onToggleFrame,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#F5F3FB] via-[#F8F7FC] to-[#EFF2FA] dark:from-[#0E0D16] dark:via-[#14131F] dark:to-[#171626] transition-colors duration-300">
      {/* Top Floating Controls Bar */}
      <div className="w-full max-w-6xl px-4 py-2 flex items-center justify-between text-xs text-[#77758A] dark:text-[#9D9AB4]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">SocialMuse Studio</span>
          <span>·</span>
          <span>Android Material 3 Glass Toolkit</span>
        </div>
        <button
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/60 dark:border-white/10 shadow-xs transition-all text-slate-700 dark:text-slate-200 font-medium"
          title="Toggle Android Device Container"
        >
          {isFrameEnabled ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Width View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ease-out flex flex-col ${
          isFrameEnabled
            ? 'max-w-[440px] my-2 sm:my-4 rounded-[44px] border-[10px] border-[#222131] dark:border-[#2D2B3F] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] bg-[#F8F7FC] dark:bg-[#12111A] overflow-hidden min-h-[880px] max-h-[92vh]'
            : 'max-w-4xl min-h-screen'
        }`}
      >
        {/* Android Status Bar (visible in frame mode or subtle on mobile) */}
        {isFrameEnabled && (
          <div className="w-full h-11 px-6 pt-1 flex items-center justify-between text-xs font-semibold text-[#29283A] dark:text-[#F3F2FA] select-none bg-transparent shrink-0">
            <span>{timeStr}</span>
            {/* Camera Punch Hole */}
            <div className="w-4 h-4 rounded-full bg-black/80 dark:bg-black/90 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1c1b2c] dark:bg-[#0c0c16]" />
            </div>
            {/* Status Icons */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-tighter">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono">98%</span>
                <Battery className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Scrollable App Viewport */}
        <div className="relative flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* Android Bottom Navigation Gesture Bar */}
        {isFrameEnabled && (
          <div className="w-full h-5 flex items-center justify-center bg-transparent shrink-0 pb-1">
            <div className="w-32 h-1 rounded-full bg-[#29283A]/20 dark:bg-white/20" />
          </div>
        )}
      </div>
    </div>
  );
};
