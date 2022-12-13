import { TopicTimeTypeEnum } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { TOPIC_LIST } from '../../constants/contstants';
import { useQuery } from '../../hooks/useQuery';
import { localServices } from '../../services/Applications/LocalServices';
import { topicServices } from '../../services/Title/TopicServices';
import { ITopicLocal } from '../../types/Commons';
import { ITopic } from '../../types/Topic';
import { removeVietnameseTones } from '../../utils/remove_vietnamese_tones';
import EmptyData from '../Commons/EmptyData/EmptyData';
import PlayTestRealtime from '../PlayTestRealtime/PlayTestRealtime';
import TestItem, { ITestItem } from '../TestItem/TestItem';
import DeleteTest from './DeleteTest';

interface TestListQuery {
  searchTerm: string;
}

const TestList: React.FC = () => {
  const [query] = useQuery<TestListQuery>();

  const [testList, setTestList] = useState<ITestItem[]>([]);
  const [testsFilter, setTestsFilter] = useState<ITestItem[]>([]);
  const [testIdDel, setTestIdDel] = useState<number>(-1);
  const [testTitleDel, setTestTitleDel] = useState<string>('');
  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [visibleModalPlayTest, setVisibleModalPlayTest] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const [paramSearch] = useState<string>(() => {
    const formatParamSearch = removeVietnameseTones(
      query.searchTerm
    ).toLowerCase();
    return formatParamSearch;
  });

  const getListTest = async () => {
    try {
      const { data } = await topicServices.getAllTopic({
        page: page,
        take: 10,
      });
      const topicResponse: ITopic[] = data.result;
      const topicsData = topicResponse.map((test) => {
        const testData: ITestItem = {
          topicUrl: test.url,
          id: test.id,
          title: test.title,
          date: test.createdAt,
          questionCount: test.questionsCount,
          expirationTime: test.expirationTime,
          timeType: test.timeType as `${TopicTimeTypeEnum}`,
          typeCategoryName: test.typeCategoryName,
          isPublic: test.isPublic,
        };
        return testData;
      });
      setTestList(topicsData);

      const testsTitle: ITopicLocal[] = topicResponse.map(
        (test) =>
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
        setTestsFilter(filterResult);
      } else {
        setTestsFilter(topicsData);
      }
    } catch (error) {
      //
    }
  };

  const filterTest = (keyword = '') => {
    const filterResult = testList.filter((test: ITestItem) => {
      const title = removeVietnameseTones(test.title).toLowerCase();
      const formatKeyword = removeVietnameseTones(keyword).toLowerCase();
      const isMatched: boolean = title.includes(formatKeyword);
      return isMatched;
    });
    setTestsFilter(filterResult);
  };

  const handleDeleteTest = (testID: number, title: string) => {
    setVisibleModalDelete(true);
    setTestIdDel(testID);
    setTestTitleDel(title);
  };

  useEffect(() => {
    getListTest();
  }, []);

  return (
    <>
      {/* <PlayTestRealtime
        visibleModal={visibleModalPlayTest}
        setVisibleModal={setVisibleModalPlayTest}
        topicTitle={test.title}
        topicUrl={test.topicUrl}
        isPlaytest={isPlaytest}
      /> */}
      <DeleteTest
        testID={testIdDel}
        testTitle={testTitleDel}
        visibleModal={visibleModalDelete}
        setVisibleModal={setVisibleModalDelete}
        onConfirmDelete={() => {
          getListTest();
          setVisibleModalDelete(false);
        }}
      />

      <div className="mt-4">
        {testsFilter && testsFilter.length > 0 ? (
          testsFilter.map((test: ITestItem) => (
            <TestItem
              test={test}
              key={test.id}
              handleDeleteTest={handleDeleteTest}
            />
          ))
        ) : (
          <EmptyData>Hiện tại bạn chưa có đề thi nào!</EmptyData>
        )}
      </div>
    </>
  );
};

export default TestList;
