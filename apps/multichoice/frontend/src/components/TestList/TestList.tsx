import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { topicServices } from '../../services/TopicServices';
import { ITopicResponse } from '../../types/TopicResponse';
import TestItem, { ITestItem } from '../TestItem/TestItem';
import DeleteTest from './DeleteTest';

interface ITestList {
  searchKeyword: string;
}

const TestList: React.FC<ITestList> = ({ searchKeyword = '' }) => {
  const query = useQuery();

  const [testList, setTestList] = useState<ITestItem[]>([]);
  const [testsFilter, setTestsFilter] = useState<ITestItem[]>([]);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [testIdDel, setTestIdDel] = useState<number>(-1);
  const [testTitleDel, setTestTitleDel] = useState<string>('');

  const getListTest = async () => {
    try {
      const { data } = await topicServices.getAllTopic();
      const topicResponse: ITopicResponse[] = data.data;
      const topicsData = topicResponse.map((test: ITopicResponse) => {
        const testData: ITestItem = {
          topicUrl: test.url,
          id: test.id,
          title: test.title,
          date: test.createdAt,
          questionCount: test.questions.length,
          expirationTime: test.expirationTime,
          typeCategoryName: test.typeCategoryName,
        };
        return testData;
      });
      setTestList(topicsData);

      const paramSearch = query.get('search') || '';
      if (paramSearch) {
        const filterResult = topicsData.filter((test: ITestItem) => {
          return test.title.includes(paramSearch);
        });
        setTestsFilter(filterResult.reverse());
      } else {
        setTestsFilter(topicsData.reverse());
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

  const handleDeleteTest = (testID: number, title: string) => {
    setOpenModalDelete(true);
    setTestIdDel(testID);
    setTestTitleDel(title);
  };

  const onConfirmDel = () => {
    getListTest();
    setOpenModalDelete(false);
  };

  return (
    <div>
      <DeleteTest
        setOpenModalDelete={setOpenModalDelete}
        openModalDelete={openModalDelete}
        testID={testIdDel}
        testTitle={testTitleDel}
        cbConfirmDel={onConfirmDel}
      />

      <div className="mt-4">
        {testsFilter &&
          testsFilter.map((test: ITestItem) => {
            return (
              <TestItem
                test={test}
                key={test.id}
                handleDeleteTest={handleDeleteTest}
              />
            );
          })}
      </div>
    </div>
  );
};

export default TestList;
