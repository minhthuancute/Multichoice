import { axiosClient } from '../Api';
import { CreateTopicDto, PageOptionsDto } from '@monorepo/multichoice/dto';

export const topicServices = {
  async getAllTopic(pagination: PageOptionsDto) {
    const { page, take } = pagination;
    const { data } = await axiosClient.get(`/topic?page=${page}&take=${take}`);
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
