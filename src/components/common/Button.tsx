import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  hero?: boolean;
  to?: string;
  children: ReactNode;
}

/** Renders a real link when `to` is given, so back, middle-click and focus behave natively. */
export function Button({ variant = 'primary', hero, to, className = '', children, ...rest }: Props) {
  const classes = `btn btn-${variant} ${hero ? 'btn-hero' : ''} ${className}`;
  if (to) {
    return (
      <a href={`#${to}`} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
