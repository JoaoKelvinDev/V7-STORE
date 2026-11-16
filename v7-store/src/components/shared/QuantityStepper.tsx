'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  ariaLabel = 'Quantidade',
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label={ariaLabel}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Diminuir quantidade"
        data-icon="inline-start"
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </Button>
      <input
        type="number"
        value={value}
        onChange={e => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val) && val >= min && val <= max) onChange(val);
        }}
        onBlur={e => {
          const val = parseInt(e.target.value, 10);
          if (isNaN(val) || val < min) onChange(min);
          else if (val > max) onChange(max);
        }}
        min={min}
        max={max}
        disabled={disabled}
        className="w-16 text-center bg-background border-border text-foreground rounded-md py-2 px-2 focus:border-ring focus:ring-2 focus:ring-ring/50"
        aria-label={ariaLabel}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Aumentar quantidade"
        data-icon="inline-start"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  );
}