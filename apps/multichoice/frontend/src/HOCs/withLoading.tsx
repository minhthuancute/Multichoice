import React, { ComponentType } from 'react';
import { loadingStore } from '../store/rootReducer';

function withLoading<T>(Component: ComponentType<T>) {
  const { isLoading } = loadingStore();
  return (hocProps: T) => {
    <div>ascaskjc</div>;
  };
}

export default withLoading;
