import type { Premortem } from '../types';

/** Compact unique id without external deps. */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

// --- Unicode-safe base64 ---------------------------------------------------

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// --- Share link (state lives entirely in the URL, no backend) --------------

export function encodeToHash(pm: Premortem): string {
  try {
    return toBase64(JSON.stringify(pm));
  } catch {
    return '';
  }
}

export function decodeFromHash(hash: string): Premortem | null {
  try {
    const clean = hash.replace(/^#/, '').replace(/^pm=/, '');
    if (!clean) return null;
    const parsed = JSON.parse(fromBase64(clean));
    if (parsed && Array.isArray(parsed.risks) && typeof parsed.name === 'string') {
      return parsed as Premortem;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(pm: Premortem): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#pm=${encodeToHash(pm)}`;
}

// --- Local autosave --------------------------------------------------------

const STORAGE_KEY = 'premortem.current.v1';

export function saveLocal(pm: Premortem): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pm));
  } catch {
    /* storage may be unavailable (private mode) — fail silently */
  }
}

export function loadLocal(): Premortem | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Premortem) : null;
  } catch {
    return null;
  }
}

export function clearLocal(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
