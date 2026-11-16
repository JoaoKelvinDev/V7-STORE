'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/app/providers/CartProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { products, getVariant } from '@/data/catalog';
import { storeSettings } from '@/data/settings';
import { formatPrice, formatPriceShort, getWhatsAppUrl, isValidWhatsAppNumber } from '@/utils/helpers';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { cn } from '@/utils/helpers';

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  fulfillmentMode: z.enum(['pickup', 'delivery']).optional(),
  deliveryAddress: z.string().optional(),
  pickupLocation: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (data.fulfillmentMode === 'delivery' && !data.deliveryAddress?.trim()) {
    return false;
  }
  if (data.fulfillmentMode === 'pickup' && !data.pickupLocation?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Preencha o endereço ou local de retirada',
  path: ['fulfillmentMode'],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const { state, getSubtotalCents, hasUnavailableItems } = useCart();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const subtotalCents = getSubtotalCents();
  const hasNullPrice = state.items.some(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.priceCents === null;
  });

  const canCheckout = state.items.length > 0 && !hasUnavailableItems();
  const hasWhatsApp = storeSettings.whatsappNumber && isValidWhatsAppNumber(storeSettings.whatsappNumber);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillmentMode: storeSettings.fulfillmentModes[0],
    },
    mode: 'onChange',
  });

  const fulfillmentMode = watch('fulfillmentMode');

  const customerName = watch('customerName');
  const pickupLocation = watch('pickupLocation');
  const deliveryAddress = watch('deliveryAddress');
  const notes = watch('notes');

  const messagePreview = (() => {
    const lines = [
      'Olá! Gostaria de consultar/fazer este pedido na V7 Store:',
      '',
      `Cliente: ${customerName?.trim() || '[seu nome]'}`,
      '',
    ];

    state.items.forEach((item, index) => {
      const product = products.find(p => p.id === item.productId);
      const variant = product ? getVariant(product.id, item.variantId) : undefined;
      const productName = product?.name || 'Produto';
      lines.push(`${index + 1}. ${productName} ${variant?.color ? `— ${variant.color}` : ''} ${variant?.size ? `— ${variant.size}` : ''}`);
      lines.push(`   Quantidade: ${item.quantity}`);
      if (product && product.priceCents !== null) {
        lines.push(`   Preço unitário: ${formatPrice(product.priceCents)}`);
      } else {
        lines.push(`   Preço unitário: Valor a confirmar`);
      }
      lines.push('');
    });

    if (subtotalCents !== null && !hasNullPrice) {
      lines.push(`Subtotal: ${formatPrice(subtotalCents)}`);
      lines.push('');
    } else if (hasNullPrice) {
      lines.push('Subtotal: Valor a confirmar com a loja (alguns itens sem preço)');
      lines.push('');
    }

    if (fulfillmentMode === 'pickup') {
      lines.push(`Retirada: ${pickupLocation || '[local a combinar]'}`);
    } else if (fulfillmentMode === 'delivery') {
      lines.push(`Entrega: ${deliveryAddress || '[endereço a informar]'}`);
    }
    lines.push('');

    if (notes) {
      lines.push(`Observações: ${notes}`);
      lines.push('');
    }

    lines.push('Podem confirmar a disponibilidade e o valor final?');

    return lines.join('\n');
  })();

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messagePreview);
      setCopied(true);
      showToast({ type: 'success', message: 'Mensagem copiada!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({ type: 'error', message: 'Erro ao copiar' });
    }
  };

  const handleSendWhatsApp = async () => {
    if (!canCheckout) return;

    if (!hasWhatsApp) {
      showToast({ type: 'error', message: 'WhatsApp não configurado. Copie a mensagem e envie manualmente.' });
      return;
    }

    setIsSending(true);
    try {
      const url = getWhatsAppUrl(storeSettings.whatsappNumber!, messagePreview);
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast({ type: 'success', message: 'Abrindo WhatsApp...' });
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmitForm = handleSubmit(handleSendWhatsApp);

  if (state.items.length === 0) {
    return (
      <div className="py-16">
        <div className="container">
          <div className="card p-8 md:p-12 text-center max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Carrinho vazio</h1>
            <p className="text-muted-foreground mb-6">Adicione produtos antes de finalizar o pedido</p>
            <Link to="/catalogo">
              <Button className="gap-2">
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                Ver catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link to="/carrinho" className="back-link pressable mb-4">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Voltar ao carrinho
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Finalizar pedido</h1>
            <p className="text-muted-foreground mt-1">Revise seus itens e informe seus dados para envio via WhatsApp</p>
          </header>

          <div className="grid gap-8 lg:grid-cols-12">
            <section className="lg:col-span-7 space-y-6" aria-labelledby="form-title">
              <h2 id="form-title" className="font-semibold text-foreground">Identificação</h2>

              <form onSubmit={handleSubmitForm} className="space-y-6" noValidate>
                <Input
                  label="Seu nome completo"
                  placeholder="João da Silva"
                  {...register('customerName')}
                  error={errors.customerName?.message}
                  required
                  autoComplete="name"
                  autoFocus
                />

                {storeSettings.fulfillmentModes.length > 1 && (
                  <fieldset className="space-y-4">
                    <legend className="label">Modalidade</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {storeSettings.fulfillmentModes.map(mode => (
                        <label
                          key={mode}
                          className={cn(
                            'relative cursor-pointer',
                            'border-2 rounded-lg p-4 transition-all',
                            fulfillmentMode === mode
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <input
                            type="radio"
                            value={mode}
                            {...register('fulfillmentMode')}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center',
                              mode === 'pickup' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                            )}>
                              {mode === 'pickup' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343M12 2a10 10 0 1010 10" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-foreground block">{mode === 'pickup' ? 'Retirada na loja' : 'Entrega'}</span>
                              <span className="text-sm text-muted-foreground">
                                {mode === 'pickup' ? 'Buscar no local combinado' : 'Receber no endereço informado'}
                              </span>
                            </div>
                          </div>
                          {fulfillmentMode === mode && (
                            <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-primary" aria-hidden="true" />
                          )}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {fulfillmentMode === 'pickup' && (
                  <Input
                    label="Local de retirada"
                    placeholder="Ex.: Loja V7 Store - Centro"
                    {...register('pickupLocation')}
                    error={errors.fulfillmentMode?.message}
                    autoComplete="address-line1"
                  />
                )}

                {fulfillmentMode === 'delivery' && (
                  <Input
                    label="Endereço de entrega"
                    placeholder="Rua, número, bairro, cidade, CEP"
                    {...register('deliveryAddress')}
                    error={errors.fulfillmentMode?.message}
                    autoComplete="street-address"
                  />
                )}

                <Input
                  label="Observações (opcional)"
                  placeholder="Horário preferido, referência, etc."
                  {...register('notes')}
                  autoComplete="off"
                />

                <div className="pt-4 border-t border-border">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={!hasWhatsApp || !canCheckout || isSubmitting || isSending}
                  >
                    {hasWhatsApp ? 'Enviar pedido pelo WhatsApp' : 'WhatsApp não configurado'}
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </Button>

                  {!hasWhatsApp && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      O WhatsApp da loja ainda não está disponível. Você pode copiar a prévia do pedido abaixo.
                    </p>
                  )}

                  {hasUnavailableItems() && (
                    <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-destructive">Itens indisponíveis no carrinho. Ajuste antes de finalizar.</p>
                    </div>
                  )}
                </div>
              </form>
            </section>

            <section className="lg:col-span-5" aria-labelledby="summary-title">
              <div className="card p-4 lg:p-6 lg:sticky lg:top-24 space-y-4">
                <h2 id="summary-title" className="font-semibold text-foreground">Resumo do pedido</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {state.items.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    const variant = product ? getVariant(product.id, item.variantId) : undefined;
                    const isUnavailable = !product?.active || !variant || variant.availability === 'unavailable';
                    const lineTotal = product?.priceCents != null ? product.priceCents * item.quantity : null;

                    return (
                      <div key={`${item.productId}-${item.variantId}`} className={cn('flex gap-3 text-sm', isUnavailable && 'opacity-60')}>
                        <img
                          src={product?.images[0] || '/assets/products/placeholder.webp'}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{product?.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {variant?.color && `${variant.color} `}{variant?.size && `${variant.size} `}
                            {isUnavailable && <Badge variant="destructive" className="ml-1 text-[10px]">Indisponível</Badge>}
                          </p>
                          <p className="text-muted-foreground">Qtd: {item.quantity}</p>
                        </div>
                        <span className={cn('font-display font-semibold flex-shrink-0', !lineTotal && 'text-muted-foreground')}>
                          {lineTotal !== null ? formatPriceShort(lineTotal) : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className={cn('font-display', subtotalCents === null && hasNullPrice && 'text-muted-foreground')}>
                      {subtotalCents !== null ? formatPrice(subtotalCents) : hasNullPrice ? 'A confirmar' : '—'}
                    </span>
                  </div>

                  {hasNullPrice && subtotalCents !== null && (
                    <p className="text-xs text-muted-foreground">
                      Alguns itens sem preço confirmado. Total parcial: {formatPrice(subtotalCents)}
                    </p>
                  )}

                  <div className="divider" />

                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span className={cn('font-display', hasNullPrice && 'text-muted-foreground')}>
                      {subtotalCents !== null && !hasNullPrice ? formatPrice(subtotalCents) : hasNullPrice ? 'A confirmar' : '—'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-medium text-foreground mb-3">Prévia da mensagem</h3>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={messagePreview}
                      className="w-full min-h-[200px] max-h-[300px] p-3 bg-background border border-border rounded-lg text-sm text-muted-foreground font-mono resize-none"
                      aria-label="Prévia da mensagem do WhatsApp"
                    />
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                      aria-label={copied ? 'Copiado!' : 'Copiar mensagem'}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {hasWhatsApp ? 'A mensagem será aberta no WhatsApp para você confirmar o envio.' : 'Copie a mensagem e envie manualmente no WhatsApp.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
