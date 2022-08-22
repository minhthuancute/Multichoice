import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ITopicResponse } from '../../types';

export interface ITopicStore {
  topic: ITopicResponse;
  setTopicData: (topicData: ITopicResponse) => void;
}

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
        name: 'topic',
      }
    )
  )
);
