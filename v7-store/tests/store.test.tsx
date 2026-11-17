import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { CartProvider, useCart } from '@/app/providers/CartProvider';
import { ToastProvider } from '@/app/providers/ToastProvider';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/features/catalog/HomePage';
import { CatalogPage } from '@/features/catalog/CatalogPage';
import { ProductPage } from '@/features/product/ProductPage';
import { CartPage } from '@/features/cart/CartPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { products } from '@/data/catalog';
import { storeSettings } from '@/data/settings';
import { CART_STORAGE_KEY, CART_VERSION, parseCartVersion } from '@/utils/helpers';

function shop(path = '/catalogo') {
  return render(
    <StrictMode>
      <CartProvider><ToastProvider><MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/produto/:slug" element={<ProductPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/finalizar" element={<CheckoutPage />} />
          </Route>
        </Routes>
      </MemoryRouter></ToastProvider></CartProvider>
    </StrictMode>,
  );
}

function checkoutWithCart(variantId = 'var-1-1') {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
    version: CART_VERSION,
    items: [{ productId: 'prod-1', variantId, quantity: 1 }],
  }));
  return shop('/finalizar');
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('jornada de compra', () => {
  it('valida nome e retirada, e permite corrigir os dados antes de abrir o WhatsApp', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    checkoutWithCart();
    fireEvent.change(screen.getByLabelText('Local de retirada'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' }));
    expect(await screen.findByText('Informe seu nome com pelo menos 2 caracteres.')).toBeInTheDocument();
    expect(screen.getByLabelText('Seu nome completo')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Local de retirada')).toHaveAttribute('aria-invalid', 'true');
    expect(open).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Seu nome completo'), { target: { value: '  Cliente Teste  ' } });
    fireEvent.change(screen.getByLabelText('Local de retirada'), { target: { value: '  Local combinado  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' }));
    await waitFor(() => expect(open).toHaveBeenCalledTimes(1));
    const message = new URL(String(open.mock.calls[0][0])).searchParams.get('text');
    expect(message).toContain('Cliente: Cliente Teste\n');
    expect(message).toContain('Retirada: Local combinado\n');
  });

  it('orienta a confirmação na conversa, mantém o carrinho e atualiza a orientação quando o pedido muda', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => null);
    checkoutWithCart();
    fireEvent.change(screen.getByLabelText('Seu nome completo'), { target: { value: 'Cliente Teste' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' }));
    expect(await screen.findByRole('heading', { name: 'Confirme o envio no WhatsApp' })).toBeInTheDocument();
    const reopen = screen.getByRole('link', { name: 'Abrir WhatsApp' });
    expect(new URL(reopen.getAttribute('href')!).pathname).toBe('/558994095340');
    expect(screen.getByRole('link', { name: 'Carrinho, 1 itens' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!).items).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Observações (opcional)'), { target: { value: 'Pedido atualizado' } });
    expect(screen.queryByRole('link', { name: 'Abrir WhatsApp' })).not.toBeInTheDocument();
    expect(screen.getByLabelText<HTMLTextAreaElement>('Prévia da mensagem do WhatsApp').value).toContain('Observações: Pedido atualizado');
  });

  it('copia a mensagem completa após validar os dados', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    checkoutWithCart();
    fireEvent.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(await screen.findByText('Informe seu nome com pelo menos 2 caracteres.')).toBeInTheDocument();
    expect(writeText).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Seu nome completo'), { target: { value: 'Cliente Teste' } });
    fireEvent.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0][0]).toContain('Cliente: Cliente Teste');
    expect(writeText.mock.calls[0][0]).toContain('Retirada: A combinar com a loja');
    expect(screen.getByRole('button', { name: 'Mensagem copiada' })).toBeInTheDocument();
  });

  it('abre a prévia e orienta a cópia manual quando o navegador bloqueia a área de transferência', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) } });
    checkoutWithCart();
    fireEvent.change(screen.getByLabelText('Seu nome completo'), { target: { value: 'Cliente Teste' } });
    fireEvent.click(screen.getByRole('button', { name: 'Copiar mensagem' }));
    expect(await screen.findByText(/Não foi possível copiar automaticamente/)).toBeInTheDocument();
    const preview = screen.getByLabelText<HTMLTextAreaElement>('Prévia da mensagem do WhatsApp');
    expect(preview.closest('details')).toHaveAttribute('open');
    expect(preview.value).toContain('Cliente: Cliente Teste');
  });

  it('oferece o link direto e conserva o pedido se abrir o WhatsApp falhar', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => { throw new Error('blocked'); });
    checkoutWithCart();
    fireEvent.change(screen.getByLabelText('Seu nome completo'), { target: { value: 'Cliente Teste' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' }));
    expect(await screen.findByText('Não foi possível abrir o WhatsApp')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir WhatsApp' })).toHaveAttribute('href', expect.stringContaining('https://wa.me/558994095340?text='));
    expect(screen.getByRole('link', { name: 'Carrinho, 1 itens' })).toBeInTheDocument();
  });

  it('bloqueia o envio de peças indisponíveis ao acessar a finalização diretamente', () => {
    checkoutWithCart('var-1-4');
    expect(screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' })).toBeDisabled();
    fireEvent.click(screen.getByRole('link', { name: 'Voltar ao carrinho para ajustar' }));
    expect(screen.getByRole('heading', { name: 'Seu carrinho' })).toBeInTheDocument();
  });

  it('valida o endereço e inclui apenas os dados de entrega quando essa modalidade está habilitada', async () => {
    const modes = storeSettings.fulfillmentModes;
    storeSettings.fulfillmentModes = ['pickup', 'delivery'];
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    try {
      checkoutWithCart();
      fireEvent.change(screen.getByLabelText('Seu nome completo'), { target: { value: 'Cliente Teste' } });
      fireEvent.click(screen.getByRole('radio', { name: 'Entrega' }));
      expect(screen.queryByLabelText('Local de retirada')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' }));
      expect(await screen.findByText('Informe o endereço de entrega.')).toBeInTheDocument();
      expect(open).not.toHaveBeenCalled();
      fireEvent.change(screen.getByLabelText('Endereço de entrega'), { target: { value: 'Rua de teste, 123, Centro' } });
      fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' }));
      await waitFor(() => expect(open).toHaveBeenCalledTimes(1));
      const message = new URL(String(open.mock.calls[0][0])).searchParams.get('text');
      expect(message).toContain('Entrega: Rua de teste, 123, Centro');
      expect(message).not.toContain('Retirada:');
    } finally {
      storeSettings.fulfillmentModes = modes;
    }
  });

  it('orienta a finalização após adicionar e abre o formulário pelo aviso', () => {
    shop('/produto/polo-verde-oliva');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));
    const notice = screen.getByRole('status');
    expect(notice).toHaveTextContent('Polo Verde Oliva adicionado ao carrinho');
    expect(notice).toHaveTextContent('Preencha seu nome e o local de retirada');
    fireEvent.click(within(notice).getByRole('button', { name: 'Finalizar pedido' }));
    expect(screen.getByRole('heading', { name: 'Finalizar pedido' })).toBeInTheDocument();
    expect(screen.getByLabelText('Seu nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Local de retirada')).toBeInTheDocument();
    expect(screen.queryByText('Polo Verde Oliva adicionado ao carrinho')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrinho, 1 itens' })).toBeInTheDocument();
  });

  it('mantém um único aviso nas adições repetidas e permite fechá-lo para continuar comprando', () => {
    shop('/produto/polo-verde-oliva');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adicionado ao carrinho' }));
    expect(screen.getAllByRole('status')).toHaveLength(1);
    fireEvent.click(within(screen.getByRole('status')).getByRole('button', { name: 'Fechar notificação' }));
    expect(screen.queryByRole('button', { name: 'Finalizar pedido' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Polo Verde Oliva' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrinho, 2 itens' })).toBeInTheDocument();
  });

  it('abre o catálogo pelo botão principal da página importada', () => {
    shop('/');
    fireEvent.click(screen.getByRole('link', { name: 'Ver catálogo' }));
    expect(screen.getByRole('heading', { name: 'Catálogo', level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^Ver detalhes de / })).toHaveLength(3);
    expect(screen.queryByRole('heading', { name: 'O começo de uma grande história.' })).not.toBeInTheDocument();
  });

  it('abre uma coleção importada e permite explorar o catálogo quando ela está vazia', () => {
    shop('/');
    const collections = screen.getByRole('region', { name: 'Explore o catálogo' });
    fireEvent.click(within(collections).getByRole('link', { name: 'Calçados' }));
    expect(screen.getByRole('heading', { name: 'Catálogo — Calçados' })).toBeInTheDocument();
    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getAllByRole('link', { name: /^Ver detalhes de / })).toHaveLength(3);
  });

  it('seleciona um tamanho disponível e adiciona a variante escolhida ao pedido', async () => {
    shop('/produto/polo-verde-oliva');
    expect(screen.getByRole('combobox', { name: 'Cor' })).toHaveValue('Verde Oliva');
    expect(screen.getByRole('radio', { name: 'GG' })).toBeDisabled();
    fireEvent.click(screen.getByRole('radio', { name: 'M' }));
    expect(screen.getByRole('radio', { name: 'M' })).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!).items).toEqual([
      { productId: 'prod-1', variantId: 'var-1-2', quantity: 1 },
    ]));
    fireEvent.click(screen.getByRole('link', { name: 'Carrinho, 1 itens' }));
    fireEvent.click(screen.getByRole('link', { name: 'Continuar pedido' }));
    expect(screen.getByLabelText<HTMLTextAreaElement>('Prévia da mensagem do WhatsApp').value).toContain('Verde Oliva — M');
  });

  it('permite fechar o menu com Escape e navegar para uma coleção sem deixá-lo aberto', () => {
    shop('/');
    const summary = screen.getByLabelText('Abrir menu');
    fireEvent.click(summary);
    expect(summary.closest('details')).toHaveAttribute('open');
    fireEvent.keyDown(summary, { key: 'Escape' });
    expect(summary.closest('details')).not.toHaveAttribute('open');
    fireEvent.click(summary);
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Menu mobile' })).getByRole('link', { name: 'Camisetas' }));
    expect(screen.getByRole('heading', { name: 'Catálogo — Camisetas' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^Ver detalhes de / })).toHaveLength(2);
    expect(screen.getByLabelText('Abrir menu').closest('details')).not.toHaveAttribute('open');
  });

  it.each(products)('abre somente $name ao clicar no anúncio da página inicial', product => {
    shop('/');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: `Ver detalhes de ${product.name}` }));
    expect(screen.getByRole('heading', { name: product.name, level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'O começo de uma grande história.' })).not.toBeInTheDocument();
    for (const other of products.filter(p => p.id !== product.id)) {
      expect(screen.queryByRole('heading', { name: other.name })).not.toBeInTheDocument();
    }
  });

  it('retorna ao catálogo com a categoria e a busca usadas antes de abrir o produto', () => {
    shop('/catalogo?categoria=camisetas&busca=caramelo');
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Ver detalhes de Camiseta Caramelo' }));
    fireEvent.click(screen.getByRole('link', { name: 'Voltar ao catálogo' }));
    expect(screen.getByRole('heading', { name: 'Catálogo — Camisetas' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Buscar produtos' })).toHaveValue('caramelo');
    expect(screen.getAllByRole('link', { name: /^Ver detalhes de / })).toHaveLength(1);
  });

  it('abre detalhes, adiciona, altera quantidade, persiste no refresh e atualiza a prévia', async () => {
    const openWhatsApp = vi.spyOn(window, 'open').mockImplementation(() => null);
    const view = shop();
    fireEvent.click(screen.getAllByRole('link', { name: /^Ver detalhes de / })[0]);
    expect(await screen.findByRole('heading', { name: 'Polo Verde Oliva' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));
    fireEvent.click(screen.getByRole('link', { name: 'Carrinho, 1 itens' }));
    expect(screen.getByRole('heading', { name: 'Seu carrinho' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar quantidade' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(2);
    await waitFor(() => expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!).items[0].quantity).toBe(2));

    view.unmount();
    shop('/carrinho');
    expect(screen.getByRole('spinbutton')).toHaveValue(2);
    fireEvent.click(screen.getByRole('link', { name: 'Continuar pedido' }));
    fireEvent.change(screen.getByLabelText('Seu nome completo'), { target: { value: 'Cliente Teste' } });
    fireEvent.change(screen.getByLabelText('Local de retirada'), { target: { value: 'Local combinado' } });
    fireEvent.change(screen.getByLabelText('Observações (opcional)'), { target: { value: 'Buscar à tarde' } });
    const preview = screen.getByLabelText<HTMLTextAreaElement>('Prévia da mensagem do WhatsApp');
    await waitFor(() => expect(preview.value).toContain('Cliente: Cliente Teste'));
    expect(preview.value).toContain('Quantidade: 2');
    expect(preview.value).toContain('Retirada: Local combinado');
    expect(preview.value).toContain('Observações: Buscar à tarde');
    const send = screen.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' });
    expect(send).toBeEnabled();
    fireEvent.click(send);
    await waitFor(() => expect(openWhatsApp).toHaveBeenCalledTimes(1));
    const whatsappUrl = new URL(String(openWhatsApp.mock.calls[0][0]));
    expect(whatsappUrl.origin).toBe('https://wa.me');
    expect(whatsappUrl.pathname).toBe('/558994095340');
    expect(whatsappUrl.searchParams.get('text')).toBe(preview.value);
  });

  it('combina busca e categoria e permite limpar uma busca sem resultados', () => {
    shop('/catalogo?categoria=polos');
    const search = screen.getByRole('textbox', { name: 'Buscar produtos' });
    fireEvent.change(search, { target: { value: 'camiseta' } });
    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getAllByRole('link', { name: /^Ver detalhes de / })).toHaveLength(3);
    fireEvent.change(search, { target: { value: 'inexistente' } });
    expect(screen.getByRole('button', { name: 'Limpar filtros' })).toBeInTheDocument();
  });

  it('mostra 404 para produto inexistente', () => {
    shop('/produto/nao-existe');
    expect(screen.getByRole('heading', { name: /não encontrad/i })).toBeInTheDocument();
  });

  it('permite remover uma variante que ficou indisponível e bloqueia checkout', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      version: CART_VERSION, items: [{ productId: 'prod-1', variantId: 'var-1-4', quantity: 1 }],
    }));
    shop('/carrinho');
    expect(screen.queryByRole('link', { name: 'Continuar pedido' })).not.toBeInTheDocument();
    const remove = screen.getByRole('button', { name: 'Remover Polo Verde Oliva' });
    expect(remove).toBeEnabled();
    fireEvent.click(remove);
    expect(screen.getByRole('heading', { name: 'Carrinho vazio' })).toBeInTheDocument();
  });

  it('continua renderizando quando o navegador bloqueia localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    shop('/produto/polo-verde-oliva');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));
    expect(screen.getByRole('link', { name: 'Carrinho, 1 itens' })).toBeInTheDocument();
  });
});

describe('integridade do carrinho e catálogo', () => {
  it('valida dados persistidos e consolida duplicatas sem exceder 99 unidades', () => {
    const valid = { productId: 'prod-1', variantId: 'var-1-1', quantity: 60 };
    expect(parseCartVersion({ version: CART_VERSION, items: [null, {}, { ...valid, quantity: -1 }, { ...valid, quantity: 1.5 }, valid, valid] })?.items).toEqual([{ ...valid, quantity: 99 }]);
    expect(parseCartVersion({ version: 99, items: [valid] })).toBeNull();
  });

  it('não apresenta subtotal numérico com preço pendente', () => {
    const original = products[0].priceCents;
    products[0].priceCents = null;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: CART_VERSION, items: [
      { productId: 'prod-1', variantId: 'var-1-1', quantity: 1 },
      { productId: 'prod-2', variantId: 'var-2-1', quantity: 1 },
    ] }));
    try {
      shop('/carrinho');
      expect(screen.getByText('Valor a confirmar com a loja')).toBeInTheDocument();
    } finally {
      products[0].priceCents = original;
    }
  });

  it('rejeita quantidades inválidas e limita adições repetidas', () => {
    function Controls() {
      const { addItem, updateQuantity, getTotalItems } = useCart();
      return <>
        <output aria-label="Total">{getTotalItems()}</output>
        <button onClick={() => addItem('prod-1', 'var-1-1', 60)}>Adicionar</button>
        <button onClick={() => updateQuantity('prod-1', 'var-1-1', -2)}>Inválido</button>
        <button onClick={() => addItem('prod-1', 'var-1-4', 1)}>Esgotado</button>
      </>;
    }
    render(<CartProvider><Controls /></CartProvider>);
    fireEvent.click(screen.getByText('Adicionar'));
    fireEvent.click(screen.getByText('Adicionar'));
    fireEvent.click(screen.getByText('Inválido'));
    fireEvent.click(screen.getByText('Esgotado'));
    expect(screen.getByLabelText('Total')).toHaveTextContent('99');
  });

  it('referencia somente imagens que existem', () => {
    for (const product of products) {
      for (const image of product.images) expect(existsSync(resolve('public', image.slice(1))), image).toBe(true);
    }
  });
});
