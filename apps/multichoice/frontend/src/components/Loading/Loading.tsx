import React from 'react';
import './loading.scss';

interface ILoading {
  isLoading?: boolean;
}

const Loading: React.FC<ILoading> = ({ isLoading = true }) => {
  return isLoading ? (
    <div className="flex py-5">
      <div className="wrapper-loading mx-auto w-8 h-8 rounded-full border border-solid border-primary border-t-transparent"></div>
    </div>
  ) : null;
};

export default Loading;
