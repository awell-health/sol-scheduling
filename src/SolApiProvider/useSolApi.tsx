import { useContext } from 'react';
import { SolApiContext } from './SolApiContext';

export const useSolApi = () => {
  const context = useContext(SolApiContext);
  if (!context) {
    throw new Error('useSolApi must be used within a SolApiProvider');
  }
  return context;
};
