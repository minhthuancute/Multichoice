import React, { createContext } from 'react';
import { ITestItem } from '../components/TestItem/TestItem';
import { ITopicResponse } from '../types';

export interface ITopicContextValues {
  topics: ITopicResponse[] | null;
  tests: ITestItem[] | null;
  // setTopicData: (topicData: ITopicResponse) => void;
  setTopics: React.Dispatch<React.SetStateAction<ITopicResponse[] | null>>;
  getTopics: () => void;
}

export const TopicContext = createContext<ITopicContextValues>(
  {} as ITopicContextValues
);
