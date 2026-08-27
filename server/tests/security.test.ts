import { describe, it, expect, vi } from 'vitest';
import { logger } from '../src/utils/logger.util.js';

describe('Security & Multi-Tenant Isolation', () => {
  it('should redact access tokens, client secrets, and api keys from logs', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('User authenticated', {
      userId: 'user-123',
      accessToken: 'secret_access_token_value',
      refreshToken: 'secret_refresh_token_value',
      apiKey: 'secret_ai_key',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedOutput = consoleSpy.mock.calls[0]?.[1] || '';
    expect(loggedOutput).not.toContain('secret_access_token_value');
    expect(loggedOutput).not.toContain('secret_refresh_token_value');
    expect(loggedOutput).not.toContain('secret_ai_key');
    expect(loggedOutput).toContain('[REDACTED]');

    consoleSpy.mockRestore();
  });
});
