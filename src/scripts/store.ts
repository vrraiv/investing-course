import { initialState, parseBackup, STORAGE_KEY, stateSchema, type State } from '../lib/state';

export let state = initialState();
let blocked = false;
let lastRaw: string | null = null;
let timeout: ReturnType<typeof setTimeout>;
export function toast(message: string, error = false) {
  const el = document.querySelector<HTMLElement>('#toast')!;
  el.textContent = message;
  el.hidden = false;
  el.setAttribute('role', error ? 'alert' : 'status');
  clearTimeout(timeout);
  timeout = setTimeout(() => { el.hidden = true; }, error ? 15000 : 4000);
}
try {
  lastRaw = localStorage.getItem(STORAGE_KEY);
  if (lastRaw) state = parseBackup(lastRaw);
} catch {
  blocked = true;
  queueMicrotask(() => toast('Saved data could not be read. Export the original data in Settings before importing a valid backup or resetting.', true));
}
export function replace(next: State, force = false) {
  if (blocked && !force) { toast('Storage is unavailable or invalid. Use Data & Settings to recover your data.', true); return false; }
  try {
    if (!force && localStorage.getItem(STORAGE_KEY) !== lastRaw) throw new Error('Data changed in another tab. Reload before saving.');
    const validated = stateSchema.parse(next);
    const raw = JSON.stringify(validated);
    localStorage.setItem(STORAGE_KEY, raw);
    lastRaw = raw;
    state = validated;
    blocked = false;
    document.querySelector('#save-status')!.textContent = 'Saved on this browser';
    return true;
  } catch (err) {
    toast(err instanceof Error && err.message.includes('another tab') ? err.message : 'Could not save. Storage may be full or blocked. Export your data before making more changes.', true);
    return false;
  }
}
export function update(fn: (next: State) => void) { const next = structuredClone(state); fn(next); return replace(next); }
export function download(name: string, value: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const escape = (text: unknown) => String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export const money = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).format(n);
export const number = (n: number, digits = 2) => new Intl.NumberFormat('en-CA', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
export const empty = (title: string, text: string, href?: string, label?: string) => `<div class="empty-state"><strong>${escape(title)}</strong>${escape(text)}${href ? `<br><a href="${escape(href)}">${escape(label)}</a>` : ''}</div>`;
export function field(form: HTMLFormElement, name: string) { return form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement; }
export function fill(form: HTMLFormElement, value: Record<string, unknown>) { for (const [key, v] of Object.entries(value)) { const input = field(form, key); if (input) input.value = String(v ?? ''); } }
export const formValues = (form: HTMLFormElement) => Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
export const setText = (id: string, text: string) => { const el = document.getElementById(id); if (el) el.textContent = text; };
export async function readJson(file?: File) {
  if (!file) throw new Error('No file selected.');
  if (file.size > 20_000_000) throw new Error('Backup exceeds the 20 MB import limit.');
  return file.text();
}
