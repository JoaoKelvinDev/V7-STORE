import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { CartProvider } from '@/app/providers/CartProvider'
import { ToastProvider } from '@/app/providers/ToastProvider'
import { router } from '@/app/router'
import '@/styles/globals.css'
import '@/styles/storefront.css'
import '@/styles/refresh.css'

function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </CartProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
