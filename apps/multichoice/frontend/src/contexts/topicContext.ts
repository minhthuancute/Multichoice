import React, { createContext } from 'react';
import { ITestItem } from '../components/TestItem/TestItem';
import { ITopic } from '../types';

export interface ITopicContextValues {
  topics: ITopic[] | null;
  tests: ITestItem[] | null;
  // setTopicData: (topicData: ITopicResponse) => void;
  setTopics: React.Dispatch<React.SetStateAction<ITopic[] | null>>;
  getTopics: () => void;
}

export const TopicContext = createContext<ITopicContextValues>(
  {} as ITopicContextValues
);
