import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled || loading ? 0.6 : 1,
    minWidth: '44px',
    minHeight: '44px',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#2563eb', color: '#fff' },
    secondary: { backgroundColor: '#e5e7eb', color: '#374151' },
    danger: { backgroundColor: '#dc2626', color: '#fff' },
  };

  return (
    <button
      style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant] }}
      disabled={disabled || loading}
      data-testid={props['data-testid']}
      {...props}
    >
      {loading ? '로딩...' : children}
    </button>
  );
}
