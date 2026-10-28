"use client";

import { useSyncExternalStore } from "react";

/**
 * localStorage 한 키를 React 상태처럼 쓰는 작은 저장소.
 * 백엔드가 없으므로 개인 데이터는 이 브라우저에만 남는다.
 */
export function createLocalStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = fallback;

  const read = (): T => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {}
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        cachedValue = fallback;
      }
    }
    return cachedValue;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const set = (value: T | null) => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
    listeners.forEach((l) => l());
  };

  const useValue = () => useSyncExternalStore(subscribe, read, () => fallback);

  return { useValue, set };
}
