import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface IAnswers {
  questionID: number;
  answersID: number[];
}

export interface IAnswersStore {
  answers: IAnswers[];
  setAnswers: (answers: IAnswers[]) => void;
  updateAnswer: (questionID: number, answersID: number[]) => void; // for update correct answer
  addAnswer: (answer: IAnswers) => void;
}

export const answerStore = create<IAnswersStore>()(
  devtools(
    persist(
      (set) => ({
        answers: [],

        setAnswers: (answers: IAnswers[]) =>
          set(() => {
            return {
              answers: answers,
            };
          }),

        // for update correct answer
        updateAnswer: (questionID: number, answersID) =>
          set((state) => {
            const tempAnswers = [...state.answers];
            const answerIndex = tempAnswers.findIndex((answer: IAnswers) => {
              return answer.questionID === questionID;
            });
            console.log(answerIndex);

            if (answerIndex !== -1) {
              tempAnswers[answerIndex].answersID = answersID;
            }
            return {
              answers: tempAnswers,
            };
          }),

        addAnswer: () =>
          set((state) => {
            return state;
          }),
      }),
      {
        name: 'answers',
      }
    )
  )
);
