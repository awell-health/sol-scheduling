import { useContext } from 'react';
import { PreferencesContext } from './PreferencesContext';

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error(
      'useProviderFilter must be used within a ProviderFilterProvider'
    );
  }
  return context;
};
