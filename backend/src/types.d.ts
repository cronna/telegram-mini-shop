// Minimal fetch type shim for Node 18+
export {};
declare global {
  var fetch: typeof import('undici').fetch;
}
