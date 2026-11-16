import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/features/catalog/HomePage';
import { CatalogPage } from '@/features/catalog/CatalogPage';
import { ProductPage } from '@/features/product/ProductPage';
import { CartPage } from '@/features/cart/CartPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { NotFoundPage } from '@/features/catalog/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'produto/:slug', element: <ProductPage /> },
      { path: 'carrinho', element: <CartPage /> },
      { path: 'finalizar', element: <CheckoutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);