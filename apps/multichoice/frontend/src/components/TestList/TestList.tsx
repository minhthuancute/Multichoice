import React, { useEffect, useState } from 'react';
import { TOPIC_LIST } from '../../constants/contstants';
import { localServices } from '../../services/Applications/LocalServices';
import { ITopicLocal } from '../../types/Commons';
import { ITopic } from '../../types/Topic';
import EmptyData from '../Commons/EmptyData/EmptyData';
import DeleteTest from './DeleteTest';
import { topicStore } from '../../store/Topic/topicStore';
import TestItem from '../TestItem/TestItem';

const TestList: React.FC = () => {
  const [testIdDel, setTestIdDel] = useState<number>(-1);
  const [testTitleDel, setTestTitleDel] = useState<string>('');
  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const { topics, publicTopics, isPublic } = topicStore();
  const [listTopics, setListTopics] = useState<ITopic[]>([]);

  const getListTest = async () => {
    try {
      const testsTitle: ITopicLocal[] = listTopics.map(
        (test) =>
          ({
            id: test.id,
            title: test.title,
          } as ITopicLocal)
      );
      localServices.setData(TOPIC_LIST, testsTitle);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTest = (testID: number, title: string) => {
    setVisibleModalDelete(true);
    setTestIdDel(testID);
    setTestTitleDel(title);
  };

  useEffect(() => {
    setListTopics(isPublic ? publicTopics : topics);
  }, [topics, publicTopics]);

  useEffect(() => {
    getListTest();
  }, [listTopics]);

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
        {listTopics.length ? (
          listTopics.map((test: ITopic) => (
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
