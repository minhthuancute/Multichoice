import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IFilter, topicServices } from '../../services/Title/TopicServices';
import { ITopic } from '../../types/Topic';
import { PageOptionsDto } from '@monorepo/multichoice/dto';

export interface ITopicStore {
  topic: ITopic;
  topics: ITopic[];
  publicTopics: ITopic[];
  isPublic: boolean;
  getTopic: (id: number) => void;
  getTopics: (filter: IFilter, pagination: PageOptionsDto) => void;
  getPublicTopics: (filter: IFilter, pagination: PageOptionsDto) => void;
  setPublicStatus: (isPublic: boolean) => void;
}

export const topicStore = create<ITopicStore>()(
  devtools((set) => ({
    topic: {} as ITopic,
    topics: [],
    isPublic: true,
    publicTopics: [],

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

    setPublicStatus: (status: boolean) => {
      set({
        isPublic: status,
      });
    },

    getTopics: async (filter: IFilter, pagination: PageOptionsDto) => {
      try {
        const { data } = await topicServices.getTopics(filter, pagination);
        set({
          topics: data.result,
        });
      } catch {
        set({
          topics: [],
        });
      }
    },

    getPublicTopics: async (filter: IFilter, pagination: PageOptionsDto) => {
      try {
        const { data } = await topicServices.getPublicTopics(
          filter,
          pagination
        );
        set({
          publicTopics: data.result,
        });
      } catch {
        set({
          publicTopics: [],
        });
      }
    },
  }))
);
