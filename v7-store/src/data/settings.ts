import type { StoreSettings } from '@/types';

export const demoPhoneLabel = '(00) 00000-0000';
export const storePhoneLabel = '+55 (89) 9409-5340';

export const storeSettings: StoreSettings = {
  storeName: 'V7 Store',
  slogan: 'Vista seu estilo',
  whatsappNumber: storePhoneLabel.replace(/\D/g, ''),
  instagramUrl: 'https://www.instagram.com/v7sto_re/',
  fulfillmentModes: ['pickup'],
};
