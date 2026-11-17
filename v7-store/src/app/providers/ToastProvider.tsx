'use client';

import { createContext, useContext, useReducer, useEffect, useState, ReactNode, useCallback } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { Toast } from '@/types';
import { generateId, prefersReducedMotion } from '@/utils/helpers';

type ToastAction =
  | { type: 'ADD'; payload: Toast }
  | { type: 'REMOVE'; payload: string };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    dispatch({ type: 'ADD', payload: { ...toast, id } });
  }, []);

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', payload: id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [leaving, setLeaving] = useState(false);

  // Saída mais rápida que a entrada; sem animação, remove na hora.
  const close = useCallback(() => {
    if (prefersReducedMotion()) {
      onDismiss(toast.id);
      return;
    }
    setLeaving(true);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(close, toast.duration ?? 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, close]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onDismiss(toast.id), 180);
    return () => clearTimeout(timer);
  }, [leaving, onDismiss, toast.id]);

  const icons = {
    success: <CheckCircle2 className="check-draw h-5 w-5 shrink-0 text-[hsl(var(--success))]" aria-hidden="true" />,
    error: <XCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />,
    info: <Info className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />,
  };

  return (
    <div
      className={`toast ${toast.type} pointer-events-auto flex items-center gap-3 px-4 py-3 ${leaving ? 'toast-out' : 'toast-in'}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      {icons[toast.type]}
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        type="button"
        onClick={close}
        className="ml-auto -mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label="Fechar notificação"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
