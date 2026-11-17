import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, ArrowRight, ArrowUpRight, Check, Loader2, MessageCircle, ShoppingBag, Store, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/app/providers/CartProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { storePhoneLabel, storeSettings } from '@/data/settings';
import { getWhatsAppUrl, hapticTap, isValidWhatsAppNumber } from '@/utils/helpers';
import { buildOrderMessage, checkoutSchema, type CheckoutFormData } from './order';
import { OrderSummary } from './OrderSummary';
import './checkout.css';

export function CheckoutPage() {
  const { state, getSubtotalCents, hasUnavailableItems } = useCart();
  const { showToast } = useToast();
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [preparedOrder, setPreparedOrder] = useState<{ message: string; url: string } | null>(null);
  const subtotalCents = getSubtotalCents();
  const unavailable = hasUnavailableItems();
  const canCheckout = state.items.length > 0 && !unavailable;
  const hasWhatsApp = Boolean(storeSettings.whatsappNumber && isValidWhatsAppNumber(storeSettings.whatsappNumber));

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      fulfillmentMode: storeSettings.fulfillmentModes[0],
      pickupLocation: 'A combinar com a loja',
      deliveryAddress: '',
      notes: '',
    },
    mode: 'onTouched',
  });
  const formValues = watch();
  const messagePreview = buildOrderMessage(state.items, formValues, subtotalCents);
  const handoff = preparedOrder?.message === messagePreview ? preparedOrder : null;

  useEffect(() => {
    if (!copiedMessage) return;
    const timer = setTimeout(() => setCopiedMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [copiedMessage]);

  useEffect(() => {
    if (!isOpening) return;
    const timer = setTimeout(() => setIsOpening(false), 1500);
    return () => clearTimeout(timer);
  }, [isOpening]);

  const copyMessage = async (data: CheckoutFormData) => {
    if (!canCheckout) return;
    const message = buildOrderMessage(state.items, data, subtotalCents);
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(message);
      hapticTap();
      showToast({ type: 'success', message: 'Mensagem copiada', description: 'Cole na conversa com a V7 Store e confirme o envio.' });
    } catch {
      setCopyFailed(true);
      showToast({ type: 'error', message: 'Selecione e copie a mensagem na prévia do pedido.' });
    }
  };

  const openWhatsApp = (data: CheckoutFormData) => {
    if (!canCheckout || isOpening) return;
    if (!hasWhatsApp || !storeSettings.whatsappNumber) {
      showToast({ type: 'error', message: 'WhatsApp indisponível. Copie a mensagem do pedido.' });
      return;
    }
    const message = buildOrderMessage(state.items, data, subtotalCents);
    const url = getWhatsAppUrl(storeSettings.whatsappNumber, message);
    setPreparedOrder({ message, url });
    setIsOpening(true);
    hapticTap();
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast({ type: 'info', message: 'Continue no WhatsApp', description: 'Toque em Enviar na conversa para encaminhar o pedido à loja.' });
    } catch {
      showToast({ type: 'error', message: 'Não foi possível abrir o WhatsApp', description: 'Use Abrir WhatsApp abaixo ou copie a mensagem do pedido.' });
    }
  };

  if (state.items.length === 0) return (
    <div className="store-shell store-flow">
      <div className="store-empty-state">
        <ShoppingBag size={40} className="mx-auto" aria-hidden="true" />
        <h1 className="store-flow-title mt-4">Carrinho vazio</h1>
        <p>Escolha suas peças para começar um pedido.</p>
        <Link to="/catalogo" className="refresh-button refresh-button-primary">Ver catálogo<ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </div>
  );

  return (
    <div className="store-shell store-flow checkout-page">
      <header className="checkout-heading">
        <Link to="/carrinho" className="back-link"><ArrowLeft size={16} aria-hidden="true" />Voltar ao carrinho</Link>
        <h1 className="store-flow-title">Finalizar pedido</h1>
        <p>Confira suas peças, preencha os dados e combine o pedido com a V7 Store.</p>
      </header>

      <nav className="checkout-progress" aria-label="Etapas do pedido">
        <ol>
          <li><Link to="/carrinho"><span aria-hidden="true"><Check size={14} /></span>Carrinho</Link></li>
          <li aria-current="step"><span aria-hidden="true">2</span>Seus dados</li>
          <li><span aria-hidden="true">3</span>WhatsApp</li>
        </ol>
      </nav>

      <div className="checkout-layout">
        <OrderSummary
          items={state.items}
          subtotalCents={subtotalCents}
          message={messagePreview}
          copied={copiedMessage === messagePreview}
          copyFailed={copyFailed}
          onCopy={() => { void handleSubmit(copyMessage)(); }}
        />

        <section className="checkout-form-section" aria-labelledby="form-title">
          <h2 id="form-title">Seus dados</h2>
          <p className="checkout-form-intro">Essas informações vão junto com as peças na mensagem para a loja.</p>
          <form onSubmit={handleSubmit(openWhatsApp)} className="checkout-form" noValidate>
            <Input label="Seu nome completo" placeholder="Digite seu nome" {...register('customerName')} error={errors.customerName?.message} required maxLength={100} autoComplete="name" />

            {storeSettings.fulfillmentModes.length > 1 ? (
              <fieldset className="checkout-fulfillment" aria-describedby={errors.fulfillmentMode ? 'fulfillment-error' : undefined}>
                <legend>Como você quer receber?</legend>
                <div className="checkout-fulfillment-options">
                  {storeSettings.fulfillmentModes.map(mode => (
                    <label key={mode}>
                      <input type="radio" value={mode} {...register('fulfillmentMode')} />
                      {mode === 'pickup' ? <Store size={20} aria-hidden="true" /> : <Truck size={20} aria-hidden="true" />}
                      <span>{mode === 'pickup' ? 'Retirada' : 'Entrega'}</span>
                    </label>
                  ))}
                </div>
                {errors.fulfillmentMode && <p id="fulfillment-error" className="checkout-field-error" role="alert">{errors.fulfillmentMode.message}</p>}
              </fieldset>
            ) : <p className="checkout-fulfillment-note"><Store size={18} aria-hidden="true" />{formValues.fulfillmentMode === 'delivery' ? 'Entrega a combinar com a loja' : 'Retirada a combinar com a loja'}</p>}

            {formValues.fulfillmentMode === 'pickup' && (
              <Input label="Local de retirada" {...register('pickupLocation')} error={errors.pickupLocation?.message} helperText="Se ainda não combinou o local, mantenha “A combinar com a loja”." required maxLength={200} autoComplete="off" />
            )}
            {formValues.fulfillmentMode === 'delivery' && (
              <Input label="Endereço de entrega" placeholder="Rua, número, bairro e cidade" {...register('deliveryAddress')} error={errors.deliveryAddress?.message} required maxLength={500} autoComplete="street-address" />
            )}
            <div className="checkout-notes">
              <label htmlFor="checkout-notes">Observações (opcional)</label>
              <textarea id="checkout-notes" {...register('notes')} rows={3} maxLength={1000} placeholder="Horário para retirada ou algum detalhe sobre o pedido." aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? 'checkout-notes-error' : undefined} />
              {errors.notes && <p id="checkout-notes-error" className="checkout-field-error" role="alert">{errors.notes.message}</p>}
            </div>

            {unavailable && <div className="checkout-warning" role="alert"><AlertCircle size={20} aria-hidden="true" /><div><p>Há peças indisponíveis no seu pedido.</p><Link to="/carrinho">Voltar ao carrinho para ajustar</Link></div></div>}
            {!hasWhatsApp && <p className="checkout-warning">O WhatsApp da loja não está disponível. Preencha os dados e use Copiar mensagem.</p>}

            <div className="checkout-submit-area">
              <Button type="submit" size="lg" className="checkout-submit" disabled={!canCheckout || !hasWhatsApp || isSubmitting || isOpening} aria-busy={isOpening || undefined}>
                {isOpening ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" />Abrindo WhatsApp…</> : <>{hasWhatsApp ? 'Enviar pedido pelo WhatsApp' : 'WhatsApp não configurado'}<ArrowRight size={18} aria-hidden="true" /></>}
              </Button>
              <p>A mensagem será aberta no WhatsApp. Toque em <strong>Enviar</strong> na conversa para encaminhar o pedido.</p>
              <span>Atendimento V7 Store · {storePhoneLabel}</span>
            </div>
          </form>

          {handoff && (
            <section className="checkout-handoff" aria-labelledby="handoff-title">
              <MessageCircle size={24} aria-hidden="true" />
              <div>
                <h2 id="handoff-title">Confirme o envio no WhatsApp</h2>
                <p>Na conversa com a V7 Store, toque em Enviar. A loja confirma a disponibilidade, o valor final e os detalhes do pedido com você.</p>
                <a href={handoff.url} target="_blank" rel="noopener noreferrer">Abrir WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a>
                <p className="checkout-handoff-help">Se a conversa não abrir, use Copiar mensagem no resumo. Seu carrinho continua salvo para você revisar.</p>
              </div>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
