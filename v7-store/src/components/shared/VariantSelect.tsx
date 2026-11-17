'use client';

import { useId } from 'react';
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
  const id = useId();
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
        {required && <span className="text-destructive" aria-hidden="true">*</span>}
      </label>
      <select
        id={id}
        className="store-native-select"
        value={value}
        onChange={event => onChange(event.target.value)}
        disabled={options.every(o => o.disabled)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>Selecione {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}{option.disabled ? ' (indisponível)' : ''}
          </option>
        ))}
      </select>
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
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
  const sizeGroupId = useId();
  return (
    <div className="grid gap-5">
      {colors.length > 0 && <VariantSelect
        label="Cor"
        options={colors}
        value={selectedColor}
        onChange={onColorChange}
        error={colorError}
        required
      />}
      {sizes.length > 0 && (
        <fieldset aria-describedby={sizeError ? `${sizeGroupId}-error` : undefined} aria-invalid={Boolean(sizeError)}>
          <legend className="text-sm font-bold">Tamanho <span className="text-destructive" aria-hidden="true">*</span></legend>
          <div className="store-size-options">
            {sizes.map(size => (
              <label key={size.value}>
                <input
                  className="store-size-input sr-only"
                  type="radio"
                  name={sizeGroupId}
                  value={size.value}
                  checked={selectedSize === size.value}
                  onChange={() => onSizeChange(size.value)}
                  disabled={size.disabled}
                  required
                />
                <span className="store-size-option">{size.label}</span>
              </label>
            ))}
          </div>
          {sizeError && <p id={`${sizeGroupId}-error`} className="mt-1 text-sm text-destructive" role="alert">{sizeError}</p>}
        </fieldset>
      )}
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
