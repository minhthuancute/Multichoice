import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { ITopicDetailResponse, ITopicResponse } from '../../types';

export interface ITopicStore {
  topic: ITopicResponse;
  topicDetail: ITopicDetailResponse;
  setTopicData: (topicData: ITopicResponse) => void;
  setTopicDetailData: (topicData: ITopicDetailResponse) => void;
}

// Topic detail
export const topicStore = create<ITopicStore>()(
  devtools((set) => ({
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
  }))
);
