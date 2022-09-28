import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TOPIC_DATA } from '../../constants/contstants';
import { ITopicDetailResponse, ITopicResponse } from '../../types';

export interface ITopicStore {
  topic: ITopicResponse;
  topicDetail: ITopicDetailResponse;
  setTopicData: (topicData: ITopicResponse) => void;
  setTopicDetailData: (topicData: ITopicDetailResponse) => void;
  // getQuestion: () => IQuestion[];
}

// Topic detail
export const topicStore = create<ITopicStore>()(
  devtools(
    persist(
      (set) => ({
        topic: {} as ITopicResponse,
        topicDetail: {} as ITopicDetailResponse,
        setTopicData: (topicData: ITopicResponse) =>
          set(() => {
            return {
              topic: topicData,
            };
          }),

        setTopicDetailData: (topicDetailData: ITopicDetailResponse) =>
          set(() => {
            return {
              topicDetail: topicDetailData,
            };
          }),
      }),
      {
        name: TOPIC_DATA,
      }
    )
  )
);
