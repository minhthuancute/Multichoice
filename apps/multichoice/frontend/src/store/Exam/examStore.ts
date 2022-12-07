import { examServices } from '../../services/Exam/ExamServices';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IExam } from '../../types';

interface IExamResult {
  point: number;
  userName: string;
}

export interface IExamStore {
  exam: IExam;
  dataExamResult: IExamResult;
  getExam: (url: string) => void;
  setDataExamResult: (examResult: IExamResult) => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools((set) => ({
    exam: {} as IExam,
    dataExamResult: {} as IExamResult,

    getExam: async (url = '') => {
      const { data } = await examServices.getExamByUrl(url);
      set({
        exam: data.data,
      });
    },

    setDataExamResult: (examResult: IExamResult) =>
      set(() => {
        return {
          dataExamResult: examResult,
        };
      }),
  }))
);
