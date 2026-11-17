'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { ProductVariant } from '@/types';

interface VariantSelectProps {
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function VariantSelect({
  label,
  options,
  value,
  onChange,
  error,
  required = false,
}: VariantSelectProps) {
  return (
    <div className="w-full">
      <Label htmlFor={label.toLowerCase()} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive" aria-hidden="true">*</span>}
      </Label>
      <Select
        value={value}
        onValueChange={(v: string | null) => { if (v !== null) onChange(v); }}
        disabled={options.every(o => o.disabled)}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
      >
        <SelectTrigger id={label.toLowerCase()} className="mt-2 w-full px-3 text-base data-[size=default]:h-11 sm:text-sm">
          <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label} {option.disabled ? '(indisponível)' : ''}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}

interface ColorSizePickerProps {
  colors: Array<{ value: string; label: string; disabled?: boolean }>;
  sizes: Array<{ value: string; label: string; disabled?: boolean }>;
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  colorError?: string;
  sizeError?: string;
}

export function ColorSizePicker({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  colorError,
  sizeError,
}: ColorSizePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {colors.length > 0 && <VariantSelect
        label="Cor"
        options={colors}
        value={selectedColor}
        onChange={onColorChange}
        error={colorError}
        required
      />}
      {sizes.length > 0 && <VariantSelect
        label="Tamanho"
        options={sizes}
        value={selectedSize}
        onChange={onSizeChange}
        error={sizeError}
        required
      />}
    </div>
  );
}

export function createVariantOptions(variants: ProductVariant[]): {
  colors: Array<{ value: string; label: string; disabled: boolean }>;
  sizes: Array<{ value: string; label: string; disabled: boolean }>;
} {
  const colorMap = new Map<string, { label: string; available: boolean }>();
  const sizeMap = new Map<string, { label: string; available: boolean }>();

  variants.forEach(v => {
    if (v.color) {
      const existing = colorMap.get(v.color);
      colorMap.set(v.color, {
        label: v.color,
        available: existing ? existing.available || v.availability === 'available' : v.availability === 'available',
      });
    }
    if (v.size) {
      const existing = sizeMap.get(v.size);
      sizeMap.set(v.size, {
        label: v.size,
        available: existing ? existing.available || v.availability === 'available' : v.availability === 'available',
      });
    }
  });

  const colors = Array.from(colorMap.entries()).map(([value, { label, available }]) => ({
    value,
    label,
    disabled: !available,
  }));

  const sizes = Array.from(sizeMap.entries()).map(([value, { label, available }]) => ({
    value,
    label,
    disabled: !available,
  }));

  return { colors, sizes };
}

export function findMatchingVariant(
  variants: ProductVariant[],
  color: string,
  size: string
): ProductVariant | undefined {
  return variants.find(v => (v.color ?? '') === color && (v.size ?? '') === size);
}
