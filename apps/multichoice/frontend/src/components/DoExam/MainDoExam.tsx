import { firebasePath } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { examStore } from '../../store/rootReducer';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet } from '../../utils/firebase_utils';
import NavQuestion from './NavQuestion';
import ShowQuestion from './ShowQuestion';

interface IMainDoExamProps {
  isRealtime?: boolean;
}

const MainDoExam: React.FC<IMainDoExamProps> = ({ isRealtime = false }) => {
  const { exam_id } = useParams();
  const { exam } = examStore();

  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [expriedCountdownRealtime, setExpriedCountdownRealtime] =
    useState<boolean>(false);
  const [startTimeCountdown, setStartTimeCountdown] = useState<number>(0);

  useEffect(() => {
    const testPath: string = `${firebasePath}-` + exam_id;

    const onValueFirebase = () => {
      fireGet(testPath, (data: any) => {
        const recordValue: ITestRealtimeRecord = data;
        if (recordValue?.started) {
          const shouldExpriedTest =
            new Date().getTime() >
            +recordValue.startTime + +exam.expirationTime;

          setStartTimeCountdown(+recordValue.startTime);
          setExpriedCountdownRealtime(shouldExpriedTest);
        }
      });
    };
    onValueFirebase();
  }, []);

  return (
    <div
      className="main-doexam"
      style={{
        minHeight: 'calc(100vh - 57px)',
      }}
    >
      {expriedCountdownRealtime ? (
        <div
          className="flex items-center justify-center"
          style={{
            height: 'calc(100vh - 57px)',
          }}
        >
          <p className="text-center text-red-500 font-semibold text-tiny">
            Bài thi đã kết thúc!
          </p>
        </div>
      ) : (
        <div className="container mx-auto pt-5 lg:px-10 flex gap-x-8">
          <div className="w-full lg:w-2/3 h-full">
            <ShowQuestion
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              startTimeCountdown={startTimeCountdown}
              expriedCountdownRealtime={expriedCountdownRealtime}
            />
          </div>
          <div className="w-1/3 xs:hidden lg:block h-full">
            <NavQuestion
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              expriedCountdownRealtime={expriedCountdownRealtime}
              startTimeCountdown={startTimeCountdown}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDoExam;
