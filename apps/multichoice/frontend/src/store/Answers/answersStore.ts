import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ANSWERS_EXAM } from '../../constants/contstants';
import { QuestionType } from '../../types/ICommons';

export interface IAnswers {
  questionID: number;
  answerID: number[];
}

export interface IAnswersStore {
  answers: IAnswers[];
  setAnswers: (answers: IAnswers[]) => void;
  updateAnswer: (
    questionID: number,
    answerID: number,
    questionType: QuestionType
  ) => void; // for update correct answer
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
        updateAnswer: (
          questionID: number,
          answerID: number,
          questionType: QuestionType
        ) =>
          set((state) => {
            const tempAnswers = [...state.answers];
            const answerIndex = tempAnswers.findIndex((answer: IAnswers) => {
              return answer.questionID === questionID;
            });
            console.log(questionType);

            if (answerIndex !== -1) {
              if (questionType.toUpperCase() === 'SINGLE') {
                tempAnswers[answerIndex].answerID = [answerID];
              } else {
                const shouldRemoveAnswerID =
                  tempAnswers[answerIndex].answerID.includes(answerID);
                if (shouldRemoveAnswerID) {
                  const indexRemove =
                    tempAnswers[answerIndex].answerID.indexOf(answerID);
                  tempAnswers[answerIndex].answerID.splice(indexRemove, 1);
                } else {
                  tempAnswers[answerIndex].answerID.push(answerID);
                }
              }

              // if (answerIdIndex === -1) {
              //   tempAnswers[answerIndex].answerID.push(answerID);
              // }
            }
            return {
              answers: [...tempAnswers],
            };
          }),

        addAnswer: () =>
          set((state) => {
            return state;
          }),
      }),
      {
        name: ANSWERS_EXAM,
      }
    )
  )
);
