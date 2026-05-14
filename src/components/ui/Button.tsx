import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type Variant = '' | 'primary' | 'ghost' | 'danger' | 'record';
type Size = '' | 'lg' | 'sm';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  style?: CSSProperties;
};

export function Button({ children, variant = '', size = '', icon, style, className, ...rest }: Props) {
  const cls = `btn ${variant} ${size} ${className ?? ''}`.trim().replace(/\s+/g, ' ');
  return (
    <button className={cls} style={style} {...rest}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}
