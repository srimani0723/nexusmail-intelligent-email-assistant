import React from 'react';
import { motion } from 'framer-motion';

interface AiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
}

export const AiLogo: React.FC<AiLogoProps> = ({
  size = 'md',
  animated = true,
  showText = false,
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-base' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-lg' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-2xl' },
    xl: { box: 'w-16 h-16', icon: 'w-9 h-9', text: 'text-3xl' },
  };

  const dim = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      <motion.div
        whileHover={animated ? { scale: 1.05, rotate: 2 } : undefined}
        whileTap={animated ? { scale: 0.95 } : undefined}
        className={`relative ${dim.box} rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-sm shadow-indigo-500/20 group cursor-pointer`}
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

        {/* Inner container */}
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle neural gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/30 dark:from-indigo-950/40 dark:to-cyan-950/20" />

          {/* AI Neural Envelope SVG */}
          <svg
            className={`${dim.icon} text-indigo-600 dark:text-cyan-400 z-10`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Mail Base Outline */}
            <path d="M21.2 8.4c.5.3.8.8.8 1.4v8.2c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9.8c0-.6.3-1.1.8-1.4l7.2-4.1c1.2-.7 2.8-.7 4 0l7.2 4.1z" />
            {/* Neural Sparkle / Diamond in center */}
            <path
              d="M12 9l1.5 2.5L16 13l-2.5 1.5L12 17l-1.5-2.5L8 13l2.5-1.5L12 9z"
              fill="url(#ai-spark-gradient)"
              stroke="none"
            />
            {/* Folding Wings */}
            <path d="M3 9.5l7.5 4.5" />
            <path d="M21 9.5l-7.5 4.5" />

            <defs>
              <linearGradient id="ai-spark-gradient" x1="8" y1="9" x2="16" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="0.5" stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-sans ${dim.text}`}>
              Nexus<span className="text-indigo-600 dark:text-cyan-400">Mail</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-2xs">
              AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
