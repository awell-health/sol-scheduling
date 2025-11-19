export const SERVICE_PREFERENCE_STORAGE_KEY = 'sol.scheduling.service';
export const STATE_PREFERENCE_STORAGE_KEY = 'sol.scheduling.state';

export function clearSolPreferenceStorage() {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(SERVICE_PREFERENCE_STORAGE_KEY);
  window.localStorage.removeItem(STATE_PREFERENCE_STORAGE_KEY);
}


