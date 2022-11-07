import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface IInforExam {
  started: boolean;
  startTime: string;
  topicId: string;
}

// export interface IUserDoExamStore {}

// export const userDoexamStore = create<IUserDoExamStore>()(
//   devtools(
//     persist(
//       (set) => ({
//         answers: [],
//         userDoExam: {} as IInforUserDoExam,
//         isSubmitExam: false,

//         setAnswers: (answers: IAnswers[]) =>
//           set(() => {
//             return {
//               answers: answers,
//             };
//           }),
//       }),
//       {
//         name: ANSWERS_EXAM,
//       }
//     )
//   )
// );
