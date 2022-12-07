import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { topicServices } from '../../services/Title/TopicServices';
import { ITopic } from '../../types';

export interface ITopicStore {
  topic: ITopic;
  getTopic: (id: number) => void;
}

export const topicStore = create<ITopicStore>()(
  devtools((set) => ({
    topic: {} as ITopic,

    getTopic: async (id: number) => {
      try {
        const { data } = await topicServices.getTopicById(id);
        set({
          topic: data,
        });
      } catch {
        set({
          topic: {} as ITopic,
        });
      }
    },
  }))
);
