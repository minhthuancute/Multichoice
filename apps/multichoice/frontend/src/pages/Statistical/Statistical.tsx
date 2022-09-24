import React, { useLayoutEffect } from 'react';
import { titleServices } from '../../services/TitleServices';

const Statistical: React.FC = () => {

  return (
    <div
      className="home-body py-5 bg-slate-100"
      style={{
        height: 'calc(100vh - 53px)',
      }}
    >
      <p className="text-center text-slate-800 mt-10">
        Chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau !
      </p>
    </div>
  );
};

export default Statistical;
