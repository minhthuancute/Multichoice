import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import Skelenton from '../../../components/Commons/Skelenton/Skelenton';

const DoExamSkelenton: React.FC = () => {
  return (
    <div className="main-doexam mt-8 container mx-auto lg:px-10">
      <p className="flex justify-center items-center font-semibold text-green-600 py-2 bg-green-50 rounded-md">
        <BsInfoCircle className="mr-2 mt-0.5" /> Bạn cần chờ tín hiệu làm bài từ
        người ra đề ...{' '}
      </p>
      <div className="mt-5 flex gap-x-8">
        <div className="w-full lg:w-2/3 h-full">
          <div className="lg:min-h-[335px] xs:min-h-[435px] bg-gray-100 p-5">
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
          <div className="w-full lg:min-h-[335px] xs:min-h-[435px] bg-gray-100 p-5">
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
