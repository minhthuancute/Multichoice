import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { EXAM_DETAIL } from '../../constants/contstants';
import { IExam } from '../../types/Exam';

export interface IExamDetailStore {
  examDetail: IExam;
  setExamDetailData: (examData: IExam) => void;
}

export const examDetailStore = create<IExamDetailStore>()(
  devtools(
    (set) => ({
      examDetail: {} as IExam,
      setExamDetailData: (examDetailData: IExam) =>
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
