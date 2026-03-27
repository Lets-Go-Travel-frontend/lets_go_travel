/**
 * auth.test.ts
 * Tests unitarios para las estrategias de autenticación compatibles con Veturis.
 */
import { FormDataAuth } from '../auth/strategies/FormDataAuth';
import { InternalAxiosRequestConfig } from 'axios';

describe('Auth Strategies (Veturis)', () => {

  describe('FormDataAuth', () => {
    it('debe transformar body a x-www-form-urlencoded con xmlRQ', async () => {
      const strategy = new FormDataAuth({
        user: 'u', password: 'p', agencyUser: 'au', agencyPassword: 'ap'
      });
      const data = new URLSearchParams();
      data.append('xmlRQ', '<RQ>test</RQ>');

      const config = {
        headers: {},
        data: data
      } as InternalAxiosRequestConfig;

      const result = await strategy.applyAuth(config);

      expect(result.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
      const params = new URLSearchParams(result.data);
      expect(params.get('user')).toBe('u');
      expect(params.get('xmlRQ')).toBe('<RQ>test</RQ>');
    });
  });
});
