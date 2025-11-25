import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useGameSound } from '../../hooks/useGameSound';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disableSound?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', onClick, disableSound = false, ...props }, ref) => {
        const { playClick } = useGameSound();

        const variants = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            outline: 'btn-secondary', // Maps to btn-secondary for consistency
            ghost: 'btn-ghost',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-8 text-lg',
        };

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disableSound) {
                playClick();
            }
            onClick?.(e);
        };

        return (
            <button
                ref={ref}
                className={twMerge(clsx(variants[variant], sizes[size], className))}
                onClick={handleClick}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
