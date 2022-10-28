import {
  firebasePath,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DoExamSkelenton from '../../pages/Exam/DoExam/DoExamSkelenton';
import { examDetailStore } from '../../store/Exam/examDetailStore';
import { loadingRealtimeStore } from '../../store/Loading/Loadingrealtime';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet } from '../../utils/firebase_utils';
import NavQuestion from './NavQuestion';
import ShowQuestion from './ShowQuestion';

const MainDoExam: React.FC = () => {
  const { exam_id } = useParams();
  const { examDetail } = examDetailStore();
  const { setLoadingRealtime } = loadingRealtimeStore();

  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
            +recordValue.startTime + +examDetail.expirationTime;

          recordValue?.duration
            ? setStartTimeCountdown(
                new Date().getTime() - +recordValue?.duration
              )
            : setStartTimeCountdown(+recordValue.startTime);

          setExpriedCountdownRealtime(shouldExpriedTest);
          setIsLoading(false);
          setLoadingRealtime(false);
        } else {
          setIsLoading(true);
          setLoadingRealtime(true);
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
