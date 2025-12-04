interface DividerProps {
  className?: string;
}

export const Divider = ({ className = '' }: DividerProps) => {
  return <hr className={`divider ${className}`} />;
};
