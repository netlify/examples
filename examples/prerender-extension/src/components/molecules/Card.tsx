import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card = ({ children, className = '', variant = 'default' }: CardProps) => {
  const variantClasses = {
    default: 'card',
    bordered: 'card card-bordered',
    elevated: 'card card-elevated'
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};
