import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TOPIC_DATA } from '../../constants/contstants';
import { IQuestion, ITopicResponse } from '../../types';

export interface ITopicStore {
  topic: ITopicResponse;
  setTopicData: (topicData: ITopicResponse) => void;

  // getQuestion: () => IQuestion[];
}

// Topic detail
export const topicStore = create<ITopicStore>()(
  devtools(
    persist(
      (set) => ({
        topic: {} as ITopicResponse,
        setTopicData: (topicData: ITopicResponse) =>
          set(() => {
            return {
              topic: topicData,
            };
          }),
      }),
      {
        name: TOPIC_DATA,
      }
    )
  )
);

const obj = {
  answerID: [1, 1],
  CorrectAnswerID: [1, 1],
  questionID: 1,
};
