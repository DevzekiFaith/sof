// App configuration constants

export const CURRENCY_CONFIG = {
  NGN_TO_USD_RATE: 1500, // Exchange rate: 1 USD = 1500 NGN
  EUR_TO_USD_RATE: 0.92, // Exchange rate: 1 USD = 0.92 EUR
  GBP_TO_USD_RATE: 0.78, // Exchange rate: 1 USD = 0.78 GBP
  DEFAULT_CURRENCY: 'USD' as const,
  SUPPORTED_CURRENCIES: ['USD', 'NGN', 'EUR', 'GBP'] as const,
};

export const APP_CONFIG = {
  NAME: 'Origin',
  TAGLINE: 'Formation for Life',
  DOMAIN: 'origin.app',
} as const;
