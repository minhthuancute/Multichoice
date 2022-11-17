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
  isLoggout: boolean;
  exam: IExamResponse;
  dataExamResult: IExamResult;
  setIsExpriedExam: (isExpriedExam: boolean) => void;
  setIsSubmitExam: (isSubmitExam: boolean) => void;
  setExamData: (examData: IExamResponse) => void;
  setDataExamResult: (examResult: IExamResult) => void;
  handleLoggout: () => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools((set) => ({
    isSubmitExam: false,
    isExpriedExam: false,
    isLoggout: false,
    exam: {} as IExamResponse,
    dataExamResult: {} as IExamResult,
    setExamData: (examData: IExamResponse) =>
      set(() => {
        return {
          exam: examData,
        };
      }),

    handleLoggout: () =>
      set(() => {
        return {
          isLoggout: true,
        };
      }),

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
