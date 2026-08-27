import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 text-gray-400 pointer-events-none">{leftIcon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors',
                'focus:outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue',
                leftIcon && 'pl-9',
                rightIcon && 'pr-9',
                error && 'border-google-red focus:border-google-red focus:ring-google-red',
                className
              )
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 text-gray-400">{rightIcon}</div>}
        </div>
        {error && <span className="text-xs text-google-red">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
