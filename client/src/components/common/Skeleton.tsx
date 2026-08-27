import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base shimmer Skeleton component
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-slate-200/70 dark:bg-slate-800/70 rounded-xl relative overflow-hidden',
          'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 dark:after:via-slate-700/40 after:to-transparent',
          className
        )
      )}
      {...props}
    />
  );
};

/**
 * Realistic Email List Loading Skeleton (Dual Layout for Mobile & Desktop)
 */
export const EmailListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="divide-y divide-gray-100 dark:divide-slate-800/60 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="transition-opacity">
          {/* Mobile Skeleton (< md) */}
          <div className="flex md:hidden items-start px-3.5 py-3 gap-3">
            <Skeleton className="w-9 h-9 rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="w-28 h-3.5 rounded-md" />
                <Skeleton className="w-12 h-3 rounded-md" />
              </div>
              <Skeleton className="w-3/4 h-3.5 rounded-md" />
              <Skeleton className="w-5/6 h-3 rounded-md" />
            </div>
            <Skeleton className="w-4 h-4 rounded-full self-center shrink-0" />
          </div>

          {/* Desktop Skeleton (>= md) */}
          <div className="hidden md:flex items-center px-4 py-2.5 gap-4">
            <Skeleton className="w-4 h-4 rounded-xs shrink-0" />
            <Skeleton className="w-4 h-4 rounded-full shrink-0" />
            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
            <Skeleton className="w-40 h-4 rounded-md shrink-0" />
            <Skeleton className="flex-1 h-4 rounded-md" />
            <Skeleton className="w-16 h-3 rounded-md shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Email Detail Page Loading Skeleton
 */
export const EmailDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-5 sm:space-y-6">
      {/* Subject Line Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 sm:h-9 w-2/3 sm:w-1/2 rounded-xl" />
        <Skeleton className="h-6 w-16 rounded-full shrink-0" />
      </div>

      {/* AI Summary Card Skeleton Placeholder */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-cyan-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-cyan-950/30 border border-indigo-100/70 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-lg" />
            <Skeleton className="w-36 h-4 rounded-md" />
          </div>
          <Skeleton className="w-16 h-4 rounded-md" />
        </div>
        <Skeleton className="w-full h-12 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Message Card Skeleton */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="w-32 h-4 rounded-md" />
              <Skeleton className="w-24 h-3 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-20 h-3 rounded-md" />
        </div>
        <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-slate-800">
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-4/5 h-4 rounded-md" />
          <Skeleton className="w-2/3 h-4 rounded-md" />
        </div>
      </div>
    </div>
  );
};

/**
 * AI Thinking / Generation Neural Loader
 */
export const AiThinkingLoader: React.FC<{ message?: string; subMessage?: string }> = ({
  message = 'Gemini 3.5 AI is generating...',
  subMessage = 'Analyzing thread context, tone, and action items',
}) => {
  return (
    <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center select-none">
      {/* Rotating Ambient Gradient Ring */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-4">
        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 blur-md opacity-50 animate-pulse" />

        {/* Rotating border ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full rounded-2xl p-[2px] bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400"
        >
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px]" />
        </motion.div>

        {/* Center Sparkle */}
        <div className="absolute flex items-center justify-center text-indigo-600 dark:text-cyan-400">
          <Sparkles size={22} className="animate-pulse" />
        </div>
      </div>

      {/* Title & Animated Dots */}
      <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 flex items-center gap-1.5 mb-1 font-sans">
        <span>{message}</span>
      </div>

      {/* Subtitle */}
      {subMessage && (
        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
          {subMessage}
        </div>
      )}

      {/* Progress Bar Shimmer */}
      <div className="w-48 sm:w-60 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4 relative">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
        />
      </div>
    </div>
  );
};
