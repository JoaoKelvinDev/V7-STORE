import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CartItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceCents: number | null): string {
  if (priceCents === null) return 'Valor a confirmar';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceCents / 100);
}

export function formatPriceShort(priceCents: number | null): string {
  if (priceCents === null) return '—';
  return `R$ ${(priceCents / 100).toFixed(2).replace('.', ',')}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encoded}`;
}

export function getWebWhatsAppUrl(phoneNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encoded}`;
}

export function isValidWhatsAppNumber(number: string): boolean {
  return /^\d{10,15}$/.test(number.replace(/\D/g, ''));
}

export function parseCartVersion(data: unknown): { items: CartItem[]; version: number } | null {
  if (!data || typeof data !== 'object') return null;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.items) || obj.version !== CART_VERSION) return null;
  const items: CartItem[] = [];
  for (const value of obj.items) {
    if (!value || typeof value !== 'object') continue;
    const item = value as Record<string, unknown>;
    if (typeof item.productId !== 'string' || !item.productId ||
        typeof item.variantId !== 'string' || !item.variantId ||
        typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    const existing = items.find(i => i.productId === item.productId && i.variantId === item.variantId);
    if (existing) existing.quantity = Math.min(99, existing.quantity + item.quantity);
    else items.push({ productId: item.productId, variantId: item.variantId, quantity: Math.min(99, item.quantity) });
  }
  return { items, version: CART_VERSION };
}

export const CART_STORAGE_KEY = 'v7-store-cart';
export const CART_VERSION = 1;
