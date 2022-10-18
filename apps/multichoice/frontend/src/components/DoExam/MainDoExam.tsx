import { TopicTimeTypeEnum } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DoExamSkelenton from '../../pages/Exam/DoExam/DoExamSkelenton';
import { examDetailStore } from '../../store/Exam/examDetailStore';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet } from '../../utils/firebase_utils';
import NavQuestion from './NavQuestion';
import ShowQuestion from './ShowQuestion';

const MainDoExam: React.FC = () => {
  const { exam_id } = useParams();
  const { examDetail } = examDetailStore();

  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expriedCountdownRealtime, setExpriedCountdownRealtime] =
    useState<boolean>(false);
  const [startTimeCountdown, setStartTimeCountdown] = useState<number>(0);

  useEffect(() => {
    const testPath: string = 'test-' + exam_id;

    const onValueFirebase = () => {
      // modifed
      fireGet(testPath, (data: any) => {
        const recordValue: ITestRealtimeRecord = data;
        if (recordValue?.started) {
          setIsLoading(false);
          const shouldExpriedTest =
            new Date().getTime() >
            +recordValue.startTime + +examDetail.expirationTime;

          setExpriedCountdownRealtime(shouldExpriedTest);
          setStartTimeCountdown(+recordValue.startTime - +recordValue.duration);
        } else {
          setIsLoading(true);
        }
      });
    };
    onValueFirebase();
  }, []);

  return isLoading && examDetail.timeType === TopicTimeTypeEnum.REALTIME ? (
    <DoExamSkelenton />
  ) : (
    <div
      className="main-doexam"
      style={{
        minHeight: 'calc(100vh - 57px)',
      }}
    >
      {expriedCountdownRealtime ? (
        <p className="text-center text-red-500 font-semibold text-tiny mt-5">
          Hết thời gian làm bài
        </p>
      ) : null}
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
    </div>
  );
};

export default MainDoExam;
