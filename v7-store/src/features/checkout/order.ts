import { z } from 'zod';
import { getVariant, products } from '@/data/catalog';
import { storeSettings } from '@/data/settings';
import type { CartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Informe seu nome com pelo menos 2 caracteres.').max(100, 'Use até 100 caracteres no nome.'),
  fulfillmentMode: z.enum(['pickup', 'delivery']).refine(mode => storeSettings.fulfillmentModes.includes(mode), 'Escolha uma modalidade disponível.'),
  pickupLocation: z.string().trim().max(200, 'Use até 200 caracteres no local de retirada.').optional(),
  deliveryAddress: z.string().trim().max(500, 'Use até 500 caracteres no endereço.').optional(),
  notes: z.string().trim().max(1000, 'Use até 1.000 caracteres nas observações.').optional(),
}).superRefine((data, context) => {
  if (data.fulfillmentMode === 'pickup' && !data.pickupLocation) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['pickupLocation'], message: 'Informe o local ou escreva “A combinar com a loja”.' });
  }
  if (data.fulfillmentMode === 'delivery' && !data.deliveryAddress) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['deliveryAddress'], message: 'Informe o endereço de entrega.' });
  }
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function buildOrderMessage(items: CartItem[], data: Partial<CheckoutFormData>, subtotalCents: number | null): string {
  const lines = [
    'Olá! Gostaria de fazer este pedido na V7 Store:',
    '',
    `Cliente: ${data.customerName?.trim() || '[seu nome]'}`,
    '',
  ];

  items.forEach((item, index) => {
    const product = products.find(entry => entry.id === item.productId);
    const variant = getVariant(item.productId, item.variantId);
    lines.push(`${index + 1}. ${[product?.name ?? 'Produto indisponível', variant?.color, variant?.size].filter(Boolean).join(' — ')}`);
    lines.push(`   Quantidade: ${item.quantity}`);
    lines.push(`   Preço unitário: ${formatPrice(product?.priceCents ?? null)}`);
    lines.push(`   Subtotal do item: ${formatPrice(product?.priceCents != null ? product.priceCents * item.quantity : null)}`);
    lines.push('');
  });

  lines.push(`Subtotal: ${subtotalCents === null ? 'Valor a confirmar com a loja' : formatPrice(subtotalCents)}`, '');
  if (data.fulfillmentMode === 'pickup') {
    lines.push(`Retirada: ${data.pickupLocation?.trim() || '[local a combinar]'}`);
  } else if (data.fulfillmentMode === 'delivery') {
    lines.push(`Entrega: ${data.deliveryAddress?.trim() || '[endereço a informar]'}`);
  }
  if (data.notes?.trim()) lines.push('', `Observações: ${data.notes.trim()}`);
  lines.push('', 'Podem confirmar a disponibilidade e o valor final?');
  return lines.join('\n');
}
