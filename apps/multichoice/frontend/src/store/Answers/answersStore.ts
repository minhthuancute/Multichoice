import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface IAnswers {
  questionID: number;
  answersID: string[];
}

export interface IAnswersStore {
  answers: IAnswers[];
  setAnswers: (answers: IAnswers[]) => void;
  updateAnswer: (questionID: number, answersID: []) => void; // for update correct answer
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
        updateAnswer: (questionID: number, answersID = []) =>
          set((state) => {
            const answerIndex = state.answers.findIndex((answer: IAnswers) => {
              return answer.questionID === questionID;
            });
            if (answerIndex) {
              state.answers[answerIndex].answersID = answersID;
            }
            return state;
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
