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
          <div className="lg:min-h-[335px] xs:min-h-[435px] bg-gray-100 p-4">
            <div className="flex items-center mb-2.5">
              <span className="text-slate-800 min-w-max mr-2 font-semibold">
                Câu hỏi 1:
              </span>
              <Skelenton className="w-4/5 h-4 bg-slate-300" />
            </div>
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
          <div className="w-full lg:min-h-[335px] xs:min-h-[435px] bg-gray-100 p-4">
            <div className="mb-4">
              <h2 className="text-center text-lg font-semibold text-slate-800 capitalize">
                Danh sách câu hỏi
              </h2>
            </div>
            <div className="flex items-center mb-2.5">
              <span className="text-sm text-slate-800 min-w-max mr-2">
                Câu hỏi 1:
              </span>
              <Skelenton className="w-1/2 h-4 bg-slate-300" />
            </div>
            <div className="flex items-center mb-2.5">
              <span className="text-sm text-slate-800 min-w-max mr-2">
                Câu hỏi 2:
              </span>
              <Skelenton className="w-2/3 h-4 bg-slate-300" />
            </div>
            <div className="flex items-center mb-2.5">
              <span className="text-sm text-slate-800 min-w-max mr-2">
                Câu hỏi 3:
              </span>
              <Skelenton className="w-5/6 h-4 bg-slate-300" />
            </div>
            <div className="flex items-center mb-2.5">
              <span className="text-sm text-slate-800 min-w-max mr-2">
                Câu hỏi 4:
              </span>
              <Skelenton className="w-2/5 h-4 bg-slate-300" />
            </div>
            <p>...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoExamSkelenton;
