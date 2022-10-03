import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ANSWERS_EXAM } from '../../constants/contstants';
import { QuestionType } from '../../types/ICommons';

export interface IInforUserDoExam {
  is_guest: boolean;
  user_name: string;
  user_id: number;
}

export interface IAnswers {
  questionID: number;
  answerID: number[];
}

export interface IAnswersStore {
  userDoExam: IInforUserDoExam;
  answers: IAnswers[];
  isSubmitExam: boolean;
  setAnswers: (answers: IAnswers[]) => void;
  updateAnswer: (
    questionID: number,
    answerID: number,
    questionType: QuestionType
  ) => void; // for update correct answer
  addAnswer: (answer: IAnswers) => void;
  setUserDoexamData: (userData: IInforUserDoExam) => void;
}

export const answerStore = create<IAnswersStore>()(
  devtools(
    persist(
      (set) => ({
        answers: [],
        userDoExam: {} as IInforUserDoExam,
        isSubmitExam: false,

        setAnswers: (answers: IAnswers[]) =>
          set(() => {
            return {
              answers: answers,
            };
          }),

        setUserDoexamData: (userData: IInforUserDoExam) =>
          set(() => {
            return {
              userDoExam: userData,
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
