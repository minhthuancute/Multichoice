import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { EXAM_DATA } from '../../constants/contstants';
import { IExamResponse } from '../../types';

export interface IInforUserDoExam {
  user_name: string;
  user_id: number;
}

export interface IExamStore {
  isExpriedExam: boolean;
  isLoggout: boolean;
  exam: IExamResponse;
  userDoExam: IInforUserDoExam;
  setIsExpriedExam: (isExpriedExam: boolean) => void;
  setExamData: (examData: IExamResponse) => void;
  setUserData: (userData: IInforUserDoExam) => void;
  handleLoggout: () => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools(
    persist(
      (set) => ({
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
      }),
      {
        name: EXAM_DATA,
      }
    )
  )
);
