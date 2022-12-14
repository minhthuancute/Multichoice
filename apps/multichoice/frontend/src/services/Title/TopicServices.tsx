import { axiosClient } from '../Api';
import { CreateTopicDto, PageOptionsDto } from '@monorepo/multichoice/dto';
import { TopicCategoryEnum } from '@monorepo/multichoice/constant';

export interface IFilter {
  typeCategoryName: TopicCategoryEnum;
  searchTerm: string;
}

export const topicServices = {
  async getTopics(filter: IFilter, pagination: PageOptionsDto) {
    const { page, take } = pagination;
    const {
      typeCategoryName: typeCategoryName = '',
      searchTerm: searchTerm = '',
    } = filter;
    const { data } = await axiosClient.get(
      `/topic?page=${page}&take=${take}&typeCategoryName=${typeCategoryName}&searchTerm=${searchTerm}`
    );
    return data;
  },

  async getPublicTopics(filter: IFilter, pagination: PageOptionsDto) {
    const { page, take } = pagination;
    const {
      typeCategoryName: typeCategoryName = '',
      searchTerm: searchTerm = '',
    } = filter;
    const { data } = await axiosClient.get(
      `/topic/public?page=${page}&take=${take}&typeCategoryName=${typeCategoryName}&searchTerm=${searchTerm}`
    );
    return data;
  },

  createTopic(formData: CreateTopicDto) {
    return axiosClient.post('/topic/create', formData);
  },

  async getTopicById(id: number) {
    const { data } = await axiosClient.get('/topic/' + id);
    return data;
  },

  updateTopicById(id: number, formData: CreateTopicDto) {
    return axiosClient.patch('/topic/' + id, formData);
  },

  deleteTopicById(id: number) {
    return axiosClient.delete('/topic/' + id);
  },
};
