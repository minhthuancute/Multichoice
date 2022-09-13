import React from 'react';
import Countdown from 'react-countdown';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { EXPRIED_EXAM } from '../../../constants/contstants';
import { classNames } from '../../../helper/classNames';
import { localServices } from '../../../services/LocalServices';

interface Renderer {
  (props: any): React.ReactNode;
}

interface ICountDown {
  startTime?: number;
  endTime?: number;
  textColor: string;
}

const CountDown: React.FC<ICountDown> = ({
  startTime = 0,
  endTime = 1,
  textColor = '',
}) => {
  const formatCountdown = (
    hours: number,
    minutes: number,
    seconds: number
  ): string => {
    const formatHours = hours >= 10 ? hours + '' : '0' + hours;
    const formatMinutes = minutes >= 10 ? minutes + '' : '0' + minutes;
    const formatSeconds = seconds >= 10 ? seconds + '' : '0' + seconds;
    return formatHours + ':' + formatMinutes + ':' + formatSeconds;
  };

  const rendererCountdown: Renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      return (
        <p className={classNames(['font-semibold underline', textColor])}>
          Hết thời gian làm bài !
        </p>
      );
    } else {
      return (
        <span
          className={classNames([
            'font-semibold  flex items-center text-lg',
            textColor,
          ])}
        >
          <AiOutlineClockCircle className="mr-1" />
          {formatCountdown(hours, minutes, seconds)}
        </span>
      );
    }
  };

  const onCompleted = () => {
    localServices.setData(EXPRIED_EXAM, true);
  };

  return (
    <Countdown
      date={startTime + endTime}
      zeroPadTime={2}
      zeroPadDays={0}
      renderer={rendererCountdown}
      onComplete={onCompleted}
    />
  );
};

export default CountDown;
