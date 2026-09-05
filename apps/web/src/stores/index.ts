import { createAuthStore } from '@8848digital/catalyst';
import type { StateStorage } from 'zustand/middleware';

// SSR-safe storage. Next renders client modules on the server too, where
// `window`/`localStorage` don't exist — so importing this module must not touch
// them. On the server we hand the auth store an in-memory StateStorage; the
// browser gets the real localStorage and persistence works as before.
const createMemoryStorage = (): StateStorage => {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  };
};

const storage: StateStorage = typeof window !== 'undefined' ? window.localStorage : createMemoryStorage();

export const useAuthStore = createAuthStore(storage);
