import { Api } from './Api';
import { CreateTopicDto, PageOptionsDto } from '@monorepo/multichoice/dto';

class TopicServices extends Api {
  async getAllTopic(pagination: PageOptionsDto) {
    const { page, take } = pagination;
    const { data } = await this.get(`/topic?page=${page}&take=${take}`);
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
