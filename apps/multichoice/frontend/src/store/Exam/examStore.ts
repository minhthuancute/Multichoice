import { examServices } from '../../services/Exam/ExamServices';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IExam } from '../../types/Exam';

interface IExamResult {
  point: number;
  username: string;
}

export interface IExamStore {
  exam: IExam;
  getExam: (url: string) => void;
}

export const examStore = create<IExamStore>()(
  devtools((set) => ({
    exam: {} as IExam,
    examResult: {} as IExamResult,

    getExam: async (url = '') => {
      const { data } = await examServices.getExamByUrl(url);
      set({
        exam: data.data,
      });
    },
  }))
);
