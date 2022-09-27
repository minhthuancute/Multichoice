import { TOPIC_LIST } from '../constants/contstants';
import { localServices } from '../services/LocalServices';
import { ITopicLocal } from '../types/ICommons';

export const getTopicTitle = (topicId: number): string => {
  const topicsLocal: ITopicLocal[] = localServices.getData(TOPIC_LIST);
  if (topicsLocal) {
    const topic = topicsLocal.find(
      (topic: ITopicLocal) => topic.id === topicId
    );
    return topic?.title || '';
  }
  return '';
};
