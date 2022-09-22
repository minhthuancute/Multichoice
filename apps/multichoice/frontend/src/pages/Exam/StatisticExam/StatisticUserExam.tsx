import { IUserDoExam } from '@monorepo/multichoice/dto';
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import ToolTip from '../../../components/Commons/ToolTip/ToolTip';

interface IStatisticUserExamProps {
  setShowModalUserExamDetail: React.Dispatch<React.SetStateAction<boolean>>;
  userData: IUserDoExam;
}

const StatisticUserExam: React.FC<IStatisticUserExamProps> = ({
  setShowModalUserExamDetail,
  userData,
}) => {
  if (!Object.keys(userData).length) return null;

  return (
    <div className="container w-full h-max py-4 px-5 mx-auto rounded-md bg-white">
      <div className="form-header flex items-center justify-between mb-8">
        <h4 className="text-slate-800 text-xl font-semibold">Thống kê</h4>
        <ToolTip title="Đóng">
          <button
            type="button"
            className="text-lg"
            onClick={() => setShowModalUserExamDetail(false)}
          >
            <IoMdClose />
          </button>
        </ToolTip>
      </div>
      <div>{userData.userName}</div>
    </div>
  );
};

export default StatisticUserExam;
