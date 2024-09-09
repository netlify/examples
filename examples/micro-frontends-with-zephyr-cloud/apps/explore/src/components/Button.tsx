import * as React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?(e: React.MouseEvent): void;
  value?: string;
  rounded?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  dataId?: string;
  size?: string;
  variant?: string;
  title?: string;
}

export default ({
  href,
  type,
  value,
  disabled,
  rounded,
  className,
  children,
  dataId,
  variant = 'secondary',
  onClick,
}: ButtonProps) => {
  if (href) {
    return (
      <Link
        to={href}
        onClick={onClick}
        data-id={dataId}
        className={`e_Button e_Button--${variant} ${className} ${rounded ? 'e_Button--rounded' : ''}`}>
        <div className="e_Button__inner">{children}</div>
      </Link>
    );
  } else {
    return (
      <button
        disabled={disabled}
        type={type}
        value={value}
        onClick={onClick}
        data-id={dataId}
        className={`e_Button e_Button--${variant} ${className} ${rounded ? 'e_Button--rounded' : ''}`}>
        <div className="e_Button__inner">{children}</div>
      </button>
    );
  }
};
