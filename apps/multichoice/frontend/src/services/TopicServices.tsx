import { Api } from './Api';
import { CreateTopicDto } from '@monorepo/multichoice/dto';
import { IPagination } from '../types';

class TopicServices extends Api {
  async getAllTopic(pagination: IPagination) {
    const { page, take } = pagination;
    const { data } = await this.get(`/topic/all?page=${page}&take=${take}`);
    return data;
  }

  createTopic(formData: CreateTopicDto) {
    return this.post('/topic/create', formData);
  }

  async getTopicById(id: number) {
    const { data } = await this.get('/topic/' + id);
    return data;
  }

  updateTopicById(id: number, formData: CreateTopicDto) {
    return this.update('/topic/' + id, formData);
  }

  deleteTopicById(id: number) {
    return this.delete('/topic/' + id);
  }
}

export const topicServices = new TopicServices();
