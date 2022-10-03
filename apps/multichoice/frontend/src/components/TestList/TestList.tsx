import React, { useEffect, useLayoutEffect, useState } from 'react';
import { TOPIC_LIST } from '../../constants/contstants';
import { useQuery } from '../../hooks/useQuery';
import { localServices } from '../../services/LocalServices';
import { topicServices } from '../../services/TopicServices';
import { ITopicLocal } from '../../types/ICommons';
import { ITopicResponse } from '../../types/TopicResponse';
import { removeVietnameseTones } from '../../utils/removeVietnameseTones';
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
  const [paramSearch] = useState<string>(() => {
    const params = query.get('search') || '';
    const formatParamSearch = removeVietnameseTones(params).toLowerCase();
    return formatParamSearch;
  });

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
          questionCount: test.questionsCount,
          expirationTime: test.expirationTime,
          typeCategoryName: test.typeCategoryName,
        };
        return testData;
      });
      setTestList(topicsData);

      const testsTitle: ITopicLocal[] = topicResponse.map(
        (test: ITopicResponse) =>
          ({
            id: test.id,
            title: test.title,
          } as ITopicLocal)
      );
      localServices.setData(TOPIC_LIST, testsTitle);

      if (paramSearch) {
        const filterResult = topicsData.filter((test: ITestItem) => {
          const title = removeVietnameseTones(test.title).toLowerCase();
          const isMatched: boolean = title.includes(paramSearch);
          return isMatched;
        });
        setTestsFilter(filterResult.reverse());
      } else {
        setTestsFilter(topicsData.reverse());
      }
    } catch (error) {
      //
    }
  };

  useLayoutEffect(() => {
    getListTest();
  }, []);

  const filterTest = (keyword = '') => {
    const filterResult = testList.filter((test: ITestItem) => {
      const title = removeVietnameseTones(test.title).toLowerCase();
      const formatKeyword = removeVietnameseTones(keyword).toLowerCase();
      const isMatched: boolean = title.includes(formatKeyword);
      return isMatched;
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
        {testsFilter && testsFilter.length > 0 ? (
          testsFilter.map((test: ITestItem) => {
            return (
              <TestItem
                test={test}
                key={test.id}
                handleDeleteTest={handleDeleteTest}
              />
            );
          })
        ) : (
          <p className="font-semibold text-red-500 text-center mt-10 text-tiny">
            {/* Hiện tại bạn chưa có đề thi nào! */}
          </p>
        )}
      </div>
    </div>
  );
};

export default TestList;
