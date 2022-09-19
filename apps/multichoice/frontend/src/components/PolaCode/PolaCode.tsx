import React from 'react';

interface IPolaCodeProps {
  content?: string;
}

const PolaCode: React.FC<IPolaCodeProps> = ({ content = '' }) => {
  return (
    <div
      className="w-max p-5 rounded-sm"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    ></div>
  );
};

export default PolaCode;
