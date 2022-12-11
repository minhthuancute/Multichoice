import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ANSWERS_EXAM } from '../../constants/contstants';
import { IQuestion } from '../../types/Topic';

export interface IAnswer {
  questionID: number;
  answerID: number[] | string;
}

export interface IAnswersStore {
  answers: IAnswer[];
  point: number;
  initAnswers: (questions: IQuestion[]) => void;
  setPoint: (point: number) => void;
  setAnswers: (answers: IAnswer[]) => void;
  updateAnswer: (
    questionID: number,
    answerSelect: number | string,
    questionType: `${QuestionTypeEnum}`
  ) => void;
  addAnswer: (answer: IAnswer) => void;
}

export const answerStore = create<IAnswersStore>()(
  devtools(
    persist(
      (set) => ({
        answers: [],
        point: 0,
        initAnswers: (questions: IQuestion[]) =>
          set(() => {
            const initAnswers: IAnswer[] = questions.map((questions) => {
              const tempArr: IAnswer = {
                questionID: questions.id,
                answerID: [],
              };
              return tempArr;
            });
            return {
              answers: initAnswers,
            };
          }),
        setAnswers: (answers: IAnswer[]) =>
          set(() => {
            return {
              answers,
            };
          }),
        setPoint: (point: number) =>
          set(() => {
            return {
              point,
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
            const answerIndex = tempAnswers.findIndex((answer) => {
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
