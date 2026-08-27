import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'google' | 'gemini';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-pill focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-google-blue hover:bg-google-blue-hover text-white focus:ring-google-blue shadow-sm hover:shadow active:scale-[0.98]',
    secondary:
      'bg-google-blue-light hover:bg-[#d2e3fc] text-google-blue-dark focus:ring-google-blue active:scale-[0.98]',
    outline:
      'border border-[#dadce0] hover:bg-[#f8fafd] text-[#3c4043] hover:border-[#1a73e8] focus:ring-google-blue',
    ghost:
      'bg-transparent hover:bg-[#f1f3f4] text-[#3c4043] focus:ring-google-blue',
    danger:
      'bg-google-red hover:bg-google-red-hover text-white focus:ring-google-red shadow-sm active:scale-[0.98]',
    google:
      'bg-white hover:bg-[#f8fafd] border border-[#dadce0] text-[#3c4043] shadow-sm hover:shadow focus:ring-google-blue active:scale-[0.98]',
    gemini:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-sm hover:shadow-md focus:ring-purple-500 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    icon: 'p-2 rounded-full',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
