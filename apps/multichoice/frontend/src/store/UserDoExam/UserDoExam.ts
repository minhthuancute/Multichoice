import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IExamResponse } from '../../types';

export interface IInforUserDoExam {
  is_guest: boolean;
  user_name: string;
  user_id: number;
}

interface IExamResult {
  point: number;
  user_name: string;
}

export interface IExamStore {
  isExpriedExam: boolean;
  isSubmitExam: boolean;
  isLoggout: boolean;
  exam: IExamResponse;
  userDoExam: IInforUserDoExam;
  dataExamResult: IExamResult;
  setIsExpriedExam: (isExpriedExam: boolean) => void;
  setIsSubmitExam: (isSubmitExam: boolean) => void;
  setExamData: (examData: IExamResponse) => void;
  setUserData: (userData: IInforUserDoExam) => void;
  setDataExamResult: (examResult: IExamResult) => void;
  handleLoggout: () => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools(
    persist((set) => ({
      isSubmitExam: false,
      isExpriedExam: false,
      isLoggout: false,
      exam: {} as IExamResponse,
      userDoExam: {} as IInforUserDoExam,
      dataExamResult: {} as IExamResult,
      setExamData: (examData: IExamResponse) =>
        set(() => {
          return {
            exam: examData,
          };
        }),

      setUserData: (userData: IInforUserDoExam) =>
        set(() => {
          return {
            userDoExam: userData,
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
  )
);
