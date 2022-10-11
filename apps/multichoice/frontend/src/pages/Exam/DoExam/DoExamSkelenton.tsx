import React from 'react';
import Skelenton from '../../../components/Commons/Skelenton/Skelenton';

const DoExamSkelenton: React.FC = () => {
  return (
    <div className="main-doexam mt-8">
      <p className="text-center font-semibold text-red-500">
        Bạn cần chờ tín hiệu làm bài từ người ra đề ...{' '}
      </p>
      <div className="container mx-auto pt-5 lg:px-10 flex gap-x-8">
        <div className="w-full lg:w-2/3 h-full">
          <Skelenton className="lg:min-h-[335px] xs:min-h-[435px]" />
        </div>
        <div className="w-1/3 xs:hidden lg:block h-full">
          <Skelenton className="w-full lg:min-h-[335px] xs:min-h-[435px]" />
        </div>
      </div>
    </div>
  );
};

export default DoExamSkelenton;
