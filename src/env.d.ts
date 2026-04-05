declare global {
  interface CloudflareEnv {
    URL_STORE: KVNamespace;
    CLICK_STORE: KVNamespace;
    BASE_URL: string;
  }
}
export {};
