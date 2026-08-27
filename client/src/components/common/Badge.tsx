import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'gemini';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    blue: 'bg-google-blue-light text-google-blue-dark border border-[#c2e7ff]',
    green: 'bg-google-green-light text-google-green-hover border border-[#ceead6]',
    yellow: 'bg-google-yellow-light text-[#b06000] border border-[#feefc3]',
    red: 'bg-google-red-light text-google-red-hover border border-[#fad2cf]',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    gemini: 'bg-gradient-to-r from-blue-50 to-purple-50 text-indigo-700 border border-purple-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {children}
    </span>
  );
};
