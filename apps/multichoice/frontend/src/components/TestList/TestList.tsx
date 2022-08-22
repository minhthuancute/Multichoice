import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { topicServices } from '../../services/TopicServices';
import { ITopicResponse } from '../../types/TopicResponse';
import TestItem, { ITestItem } from '../TestItem/TestItem';

interface ITestList {
  searchKeyword: string;
}

const TestList: React.FC<ITestList> = ({ searchKeyword = '' }) => {
  const query = useQuery();

  const [testList, setTestList] = useState<ITestItem[]>([]);
  const [testsFilter, setTestsFilter] = useState<ITestItem[]>([]);

  const getListTest = async () => {
    try {
      const { data } = await topicServices.getAllTopic();
      const topicResponse: ITopicResponse[] = data.data;
      const topicsData = topicResponse.map((test: ITopicResponse) => {
        const testData: ITestItem = {
          id: test.id,
          title: test.title,
          date: test.createdAt,
          questionCount: test.questions.length,
          expirationTime: test.expirationTime,
        };
        return testData;
      });
      setTestList(topicsData);

      const paramSearch = query.get('search') || '';
      if (paramSearch) {
        const filterResult = topicsData.filter((test: ITestItem) => {
          return test.title.includes(paramSearch);
        });
        setTestsFilter(filterResult);
      } else {
        setTestsFilter(topicsData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    getListTest();
  }, []);

  const filterTest = (keyword = '') => {
    const filterResult = testList.filter((test: ITestItem) => {
      return test.title.includes(keyword);
    });
    setTestsFilter(filterResult);
  };

  useEffect(() => {
    filterTest(searchKeyword);
  }, [searchKeyword]);

  return (
    <div>
      <div className="mt-4">
        {testsFilter &&
          testsFilter.reverse().map((test: ITestItem) => {
            return <TestItem test={test} key={test.id} />;
          })}
      </div>
    </div>
  );
};

export default TestList;
