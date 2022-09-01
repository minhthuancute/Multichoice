import React from 'react';
import { useLocation } from 'react-router-dom';

export const useNotify = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};
