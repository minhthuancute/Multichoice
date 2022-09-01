import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IExamResponse } from '../../types';

export interface IInforUserDoExam {
  user_name: string;
  user_id: number;
}

export interface IExamStore {
  exam: IExamResponse;
  userDoExam: IInforUserDoExam;
  setExamData: (examData: IExamResponse) => void;
  setUserData: (userData: IInforUserDoExam) => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools(
    persist(
      (set) => ({
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
      }),
      {
        name: 'exam',
      }
    )
  )
);
