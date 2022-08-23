import { Api } from './Api';
import { CreateTopicDto } from '@monorepo/multichoice/dto';

class TopicServices extends Api {
  getAllTopic() {
    return this.get('/topic');
  }

  createTopic(formData: CreateTopicDto) {
    return this.post('/topic/create', formData);
  }

  getTopicById(id: string) {
    return this.get('/topic/' + id);
  }

  deleteTopicById(id: number) {
    return this.delete('/topic/' + id);
  }
}

export const topicServices = new TopicServices();
