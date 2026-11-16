export type Availability = 'available' | 'unavailable';

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  availability: Availability;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  categoryId: string;
  priceCents: number | null; // BRL; null = preço não confirmado
  images: string[];
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface StoreSettings {
  storeName: 'V7 Store';
  slogan: 'Vista seu estilo';
  whatsappNumber: string | null; // apenas dígitos DDI+DDD+número
  instagramUrl: string | null;
  fulfillmentModes: Array<'pickup' | 'delivery'>;
}

export interface CheckoutData {
  customerName: string;
  fulfillmentMode?: 'pickup' | 'delivery';
  deliveryAddress?: string;
  pickupLocation?: string;
  notes?: string;
}

export interface WhatsAppMessage {
  text: string;
  url: string;
}

export interface CartState {
  items: CartItem[];
  version: number;
}

export interface FilterState {
  categoryId: string | null;
  searchQuery: string;
  availabilityOnly: boolean;
}

export interface ProductFilters {
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  showAvailableOnly: boolean;
}

export type RoutePath =
  | '/'
  | '/catalogo'
  | `/produto/${string}`
  | '/carrinho'
  | '/finalizar'
  | '*';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}