import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const Container = ({ children, size = 'lg', className = '' }: ContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <div className={`container mx-auto px-6 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
