import React from 'react';

interface IEmptyDataProps {
  children?: React.ReactNode;
}

const EmptyData: React.FC<IEmptyDataProps> = ({ children = '' }) => {
  return (
    <p className="font-semibold text-slate-800 text-center mt-10 text-tiny">
      {children}
    </p>
  );
};

export default EmptyData;
