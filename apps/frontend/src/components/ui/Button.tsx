import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}, ref) => {
    const baseStyles = 'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]',
        secondary: 'bg-secondary text-gray-700 hover:bg-gray-200',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
        outline: 'border border-primary text-primary hover:bg-primary/5',
    };

    const width = fullWidth ? 'w-full' : '';

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
