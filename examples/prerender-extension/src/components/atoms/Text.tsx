import type { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  size?: 'sm' | 'base' | 'lg';
  weight?: 'normal' | 'medium' | 'bold';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export const Text = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'primary',
  className = ''
}: TextProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted'
  };

  return (
    <p className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${className}`}>
      {children}
    </p>
  );
};
