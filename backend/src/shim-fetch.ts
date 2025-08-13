import { fetch as undiciFetch } from 'undici';

if (!(global as any).fetch) {
  (global as any).fetch = undiciFetch as any;
}
