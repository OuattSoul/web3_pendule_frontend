import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};
const getPath = () => window.location.hash.replace(/^#/, '') || '/';

/** Hash routing keeps back button and deep links without a router dependency. */
export function useRoute(): { path: string; segments: string[] } {
  const path = useSyncExternalStore(subscribe, getPath);
  return { path, segments: path.split('/').filter(Boolean) };
}

export function navigate(path: string, replace = false): void {
  if (replace) window.location.replace(`#${path}`);
  else window.location.hash = path;
}
