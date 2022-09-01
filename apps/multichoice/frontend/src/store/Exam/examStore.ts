import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IExamResponse } from '../../types';

export interface IExamStore {
  exam: IExamResponse;
  setExamData: (examData: IExamResponse) => void;
}

// Topic detail
export const examStore = create<IExamStore>()(
  devtools(
    persist(
      (set) => ({
        exam: {} as IExamResponse,
        setExamData: (examData: IExamResponse) =>
          set(() => {
            return {
              exam: examData,
            };
          }),
      }),
      {
        name: 'exam',
      }
    )
  )
);
