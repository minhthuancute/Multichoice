import React from 'react';
import Skelenton from '../../Commons/Skelenton/Skelenton';

const DoExamSkelenton: React.FC = () => {
  return (
    <div className="mt-8 container mx-auto lg:px-10">
      <p className="flex justify-center items-center font-semibold text-green-600">
        Bạn cần chờ tín hiệu làm bài từ người ra đề ...{' '}
      </p>
      <div className="mt-5 flex gap-x-8">
        <div className="w-full lg:w-2/3 h-full bg-white">
          <div className="lg:min-h-[335px] xs:min-h-[435px p-5">
            <Skelenton className="w-4/5 h-4 bg-slate-300 mb-2.5" />
            <Skelenton className="w-32 h-4 bg-slate-300" />

            <div className="mt-10">
              <Skelenton className="w-1/2 h-4 bg-slate-300 mb-2.5" />
              <Skelenton className="w-2/3 h-4 bg-slate-300 mb-2.5" />
              <Skelenton className="w-2/5 h-4 bg-slate-300 mb-2.5" />
              <Skelenton className="w-full h-4 bg-slate-300 mb-2.5" />
            </div>
          </div>
        </div>
        <div className="w-1/3 xs:hidden lg:block h-full">
          <div className="w-full lg:min-h-[335px] xs:min-h-[435px] p-5 bg-white">
            <div className="mb-4 flex justify-center">
              <Skelenton className="w-1/2 h-4 bg-slate-300 mb-2.5" />
            </div>
            <Skelenton className="w-1/2 h-4 bg-slate-300 mb-2.5" />
            <Skelenton className="w-2/3 h-4 bg-slate-300 mb-2.5" />
            <Skelenton className="w-full h-4 bg-slate-300 mb-2.5" />
            <Skelenton className="w-4/5 h-4 bg-slate-300 mb-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoExamSkelenton;
