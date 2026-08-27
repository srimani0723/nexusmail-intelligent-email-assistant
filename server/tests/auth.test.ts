import { describe, it, expect, vi } from 'vitest';
import { encrypt, decrypt } from '../src/utils/encryption.util.js';
import { AuthService, GMAIL_SCOPES } from '../src/services/auth.service.js';

describe('Authentication & Security', () => {
  it('should encrypt and decrypt OAuth tokens accurately with AES-256-GCM', () => {
    const originalToken = 'ya29.a0AfH6SMDIEXAMPLE_ACCESS_TOKEN_123456789';
    const encrypted = encrypt(originalToken);

    expect(encrypted).toBeDefined();
    expect(encrypted).not.toEqual(originalToken);
    expect(encrypted.split(':').length).toBe(3); // iv:authTag:encrypted

    const decrypted = decrypt(encrypted);
    expect(decrypted).toEqual(originalToken);
  });

  it('should fail cleanly when decrypting malformed or tampered ciphertext', () => {
    expect(() => decrypt('invalid:ciphertext')).toThrow();
    expect(() => decrypt('aa:bb:cc')).toThrow();
  });

  it('should generate Google OAuth URL with required offline access and scopes', () => {
    const authUrl = AuthService.getAuthUrl();
    expect(authUrl).toContain('accounts.google.com');
    expect(authUrl).toContain('access_type=offline');
    expect(authUrl).toContain('prompt=consent');

    for (const scope of GMAIL_SCOPES) {
      expect(authUrl).toContain(encodeURIComponent(scope));
    }
  });
});
