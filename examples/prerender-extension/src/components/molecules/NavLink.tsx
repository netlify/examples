import { NavLink as RouterNavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export const NavLink = ({ to, children, className = '' }: NavLinkProps) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `nav-link ${isActive ? 'nav-link-active' : ''} ${className}`
      }
    >
      {children}
    </RouterNavLink>
  );
};
