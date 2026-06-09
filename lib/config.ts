// App configuration constants

export const CURRENCY_CONFIG = {
  NGN_TO_USD_RATE: 1500, // Exchange rate: 1 USD = 1500 NGN
  DEFAULT_CURRENCY: 'USD' as const,
  SUPPORTED_CURRENCIES: ['USD', 'NGN'] as const,
};

export const APP_CONFIG = {
  NAME: 'Origin',
  TAGLINE: 'Formation for Life',
  DOMAIN: 'origin.app',
} as const;
