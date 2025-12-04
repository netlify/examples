import { Link as RouterLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export const Link = ({ to, children, className = '' }: LinkProps) => {
  return (
    <RouterLink to={to} className={`link ${className}`}>
      {children}
    </RouterLink>
  );
};
