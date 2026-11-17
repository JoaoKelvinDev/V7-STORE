import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface AnimatedValueProps {
  /** Valor observado: quando muda, o conteúdo pisca na cor da marca. */
  value: unknown;
  children: ReactNode;
  className?: string;
}

export function AnimatedValue({ value, children, className }: AnimatedValueProps) {
  const previous = useRef(value);
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    if (previous.current !== value) {
      previous.current = value;
      setChanges(n => n + 1);
    }
  }, [value]);

  return (
    <span key={changes} className={cn(changes > 0 && 'value-flash', className)}>
      {children}
    </span>
  );
}
