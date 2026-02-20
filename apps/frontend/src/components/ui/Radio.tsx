import React, { forwardRef } from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ label, id, ...props }, ref) => {
    return (
        <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer group select-none">
            <div className="relative flex items-center justify-center">
                <input
                    ref={ref}
                    type="radio"
                    id={id}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:border-primary transition-all duration-200"
                    {...props}
                />
                <div className="absolute w-2.5 h-2.5 bg-primary rounded-[2px] opacity-0 peer-checked:opacity-100 transition-all duration-200" />
            </div>
            <span className="text-[15px] font-medium text-gray-700 group-hover:text-primary transition-colors">
                {label}
            </span>
        </label>
    );
});

Radio.displayName = 'Radio';
