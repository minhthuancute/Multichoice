import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { EXAM_DETAIL } from '../../constants/contstants';
import { IExamDetail } from '../../types';

export interface IExamDetailStore {
  examDetail: IExamDetail;
  setExamDetailData: (examData: IExamDetail) => void;
}

// Topic detail
export const examDetailStore = create<IExamDetailStore>()(
  devtools(
    (set) => ({
      examDetail: {} as IExamDetail,
      setExamDetailData: (examDetailData: IExamDetail) =>
        set(() => {
          return {
            examDetail: examDetailData,
          };
        }),
    }),
    {
      name: EXAM_DETAIL,
    }
  )
);
