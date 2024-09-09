import * as React from 'react';
import { Link } from 'react-router-dom';
import '../css/Button.css';

interface ButtonProps {
  href?: string;
  type?: 'button' | 'submit' | 'reset';
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
  className = '',
  children,
  dataId,
  size = 'normal',
  variant = 'secondary',
  title,
}: ButtonProps) => {
  if (href) {
    return (
      <Link
        to={href}
        data-id={dataId}
        title={title}
        className={`c_Button c_Button--${variant} ${className} ${
          rounded ? 'c_Button--rounded' : ''
        } c_Button--size-${size}`}>
        <div className="c_Button__inner">{children}</div>
      </Link>
    );
  } else {
    return (
      <button
        disabled={disabled}
        type={type}
        value={value}
        data-id={dataId}
        title={title}
        className={`c_Button c_Button--${variant} ${className} ${
          rounded ? 'c_Button--rounded' : ''
        } c_Button--size-${size}`}>
        <div className="c_Button__inner">{children}</div>
      </button>
    );
  }
};
