import { isDev } from '../config/env.js';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'encryptedAccessToken',
  'encryptedRefreshToken',
  'clientSecret',
  'apiKey',
  'secret',
  'authorization',
  'cookie',
];

function sanitize(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    const isSensitive = SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()));
    if (isSensitive) {
      clean[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      clean[key] = sanitize(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

export const logger = {
  info: (message: string, meta?: any) => {
    if (meta) {
      console.log(`[INFO] ${message}`, JSON.stringify(sanitize(meta)));
    } else {
      console.log(`[INFO] ${message}`);
    }
  },
  warn: (message: string, meta?: any) => {
    if (meta) {
      console.warn(`[WARN] ${message}`, JSON.stringify(sanitize(meta)));
    } else {
      console.warn(`[WARN] ${message}`);
    }
  },
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      console.error(`[ERROR] ${message} - ${error.message}`, isDev ? error.stack : '');
    } else if (error) {
      console.error(`[ERROR] ${message}`, JSON.stringify(sanitize(error)));
    } else {
      console.error(`[ERROR] ${message}`);
    }
  },
  debug: (message: string, meta?: any) => {
    if (isDev) {
      if (meta) {
        console.debug(`[DEBUG] ${message}`, JSON.stringify(sanitize(meta)));
      } else {
        console.debug(`[DEBUG] ${message}`);
      }
    }
  },
};
