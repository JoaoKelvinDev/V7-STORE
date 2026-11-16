import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { CartProvider, useCart } from '@/app/providers/CartProvider';
import { ToastProvider } from '@/app/providers/ToastProvider';
import { Header } from '@/components/layout/Header';
import { CatalogPage } from '@/features/catalog/CatalogPage';
import { ProductPage } from '@/features/product/ProductPage';
import { CartPage } from '@/features/cart/CartPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { products } from '@/data/catalog';
import { CART_STORAGE_KEY, CART_VERSION, parseCartVersion } from '@/utils/helpers';

function shop(path = '/catalogo') {
  return render(
    <StrictMode>
      <CartProvider><ToastProvider><MemoryRouter initialEntries={[path]}>
        <Header />
        <Routes>
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/produto/:slug" element={<ProductPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/finalizar" element={<CheckoutPage />} />
        </Routes>
      </MemoryRouter></ToastProvider></CartProvider>
    </StrictMode>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('jornada de compra', () => {
  it('abre detalhes, adiciona, altera quantidade, persiste no refresh e atualiza a prévia', async () => {
    const view = shop();
    fireEvent.click(screen.getAllByRole('link', { name: 'Ver detalhes' })[0]);
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
    expect(screen.getByRole('button', { name: /WhatsApp não configurado/ })).toBeDisabled();
  });

  it('combina busca e categoria e permite limpar uma busca sem resultados', () => {
    shop('/catalogo?categoria=polos');
    const search = screen.getByRole('textbox', { name: 'Buscar produtos' });
    fireEvent.change(search, { target: { value: 'camiseta' } });
    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getAllByRole('link', { name: 'Ver detalhes' })).toHaveLength(3);
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
