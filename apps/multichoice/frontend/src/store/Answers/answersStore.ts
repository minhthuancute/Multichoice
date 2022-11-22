import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ANSWERS_EXAM } from '../../constants/contstants';

export interface IInforUserDoExam {
  topicUrl: string;
  userName: string;
  userId: number;
}

export interface IAnswers {
  questionID: number;
  answerID: number[] | string;
}

export interface IAnswersStore {
  userDoExam: IInforUserDoExam;
  answers: IAnswers[];
  isSubmitExam: boolean;
  setAnswers: (answers: IAnswers[]) => void;
  updateAnswer: (
    questionID: number,
    answerSelect: number | string,
    questionType: `${QuestionTypeEnum}`
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
          answerSelect: number | string,
          questionType: `${QuestionTypeEnum}`
        ) =>
          set((state) => {
            const tempAnswers = [...state.answers];
            const answerIndex = tempAnswers.findIndex((answer: IAnswers) => {
              return answer.questionID === questionID;
            });

            if (answerIndex !== -1) {
              if (
                questionType.toUpperCase() === 'TEXT' &&
                typeof answerSelect === 'string'
              ) {
                const regex = /\s+/gi;
                const removeSpaceAnswer = answerSelect
                  .replace(regex, ' ')
                  .trim();

                tempAnswers[answerIndex].answerID = removeSpaceAnswer;
              } else if (typeof answerSelect === 'number') {
                if (questionType.toUpperCase() === 'SINGLE') {
                  tempAnswers[answerIndex].answerID = [answerSelect];
                } else {
                  const shouldRemoveAnswerID: boolean = (
                    tempAnswers[answerIndex].answerID as number[]
                  ).includes(answerSelect);
                  if (shouldRemoveAnswerID) {
                    const indexRemove = (
                      tempAnswers[answerIndex].answerID as number[]
                    ).indexOf(answerSelect);
                    (tempAnswers[answerIndex].answerID as number[]).splice(
                      indexRemove,
                      1
                    );
                  } else {
                    (tempAnswers[answerIndex].answerID as number[]).push(
                      answerSelect
                    );
                  }
                }
              }
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
        getStorage: () => sessionStorage,
      }
    )
  )
);
