import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className = '', ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor={id} className="text-[14px] font-semibold text-gray-800 ml-0.5">
                {label}
            </label>
            <input
                ref={ref}
                id={id}
                className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-700 ${error ? 'border-red-500 ring-red-100' : ''} ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500 mt-0.5 ml-1 font-medium">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
