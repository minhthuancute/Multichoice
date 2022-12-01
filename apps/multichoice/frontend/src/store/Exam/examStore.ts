import { examServices } from './../../services/ExamServices';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IExamResponse } from '../../types';

interface IExamResult {
  point: number;
  userName: string;
}

export interface IExamStore {
  isExpriedExam: boolean;
  isSubmitExam: boolean;
  exam: IExamResponse;
  dataExamResult: IExamResult;
  setIsExpriedExam: (isExpriedExam: boolean) => void;
  setIsSubmitExam: (isSubmitExam: boolean) => void;
  getExam: (url: string) => void;
  setDataExamResult: (examResult: IExamResult) => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools((set) => ({
    isSubmitExam: false,
    isExpriedExam: false,
    exam: {} as IExamResponse,
    dataExamResult: {} as IExamResult,

    getExam: async (url = '') => {
      const { data } = await examServices.getExamInfor(url);
      set({
        exam: data.data,
      });
    },

    setIsExpriedExam: (isExpriedExam: boolean) =>
      set(() => {
        return {
          isExpriedExam: isExpriedExam,
        };
      }),
    setIsSubmitExam: (isSubmitExam: boolean) =>
      set(() => {
        return {
          isSubmitExam: isSubmitExam,
        };
      }),

    setDataExamResult: (examResult: IExamResult) =>
      set(() => {
        return {
          dataExamResult: examResult,
        };
      }),
  }))
);
