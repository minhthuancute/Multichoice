import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { EXAM_DATA } from '../../constants/contstants';
import { IExamResponse } from '../../types';

export interface IInforUserDoExam {
  is_guest: boolean;
  user_name: string;
  user_id: number;
}

export interface IExamStore {
  isExpriedExam: boolean;
  isSubmitExam: boolean;
  isLoggout: boolean;
  exam: IExamResponse;
  userDoExam: IInforUserDoExam;
  setIsExpriedExam: (isExpriedExam: boolean) => void;
  setIsSubmitExam: (isSubmitExam: boolean) => void;
  setExamData: (examData: IExamResponse) => void;
  setUserData: (userData: IInforUserDoExam) => void;
  handleLoggout: () => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools(
    persist(
      (set) => ({
        isSubmitExam: false,
        isExpriedExam: false,
        isLoggout: false,
        exam: {} as IExamResponse,
        userDoExam: {} as IInforUserDoExam,
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
      }),
      {
        name: EXAM_DATA,
      }
    )
  )
);
