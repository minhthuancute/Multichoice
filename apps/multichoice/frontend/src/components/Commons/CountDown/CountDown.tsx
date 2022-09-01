import React from 'react';
import Countdown from 'react-countdown';
import { AiOutlineClockCircle } from 'react-icons/ai';

interface Renderer {
  (props: any): React.ReactNode;
}

interface ICountDown {
  startTime?: number;
  endTime?: number;
}

const CountDown: React.FC<ICountDown> = ({ startTime = 0, endTime = 1 }) => {
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
        <p className="text-white font-semibold underline">
          Hết thời gian làm bài !
        </p>
      );
    } else {
      return (
        <span className="font-semibold text-white flex items-center text-lg">
          <AiOutlineClockCircle className="mr-1" />
          {formatCountdown(hours, minutes, seconds)}
        </span>
      );
    }
  };

  return (
    <div>
      <Countdown
        date={startTime + endTime}
        zeroPadTime={2}
        zeroPadDays={0}
        renderer={rendererCountdown}
      />
    </div>
  );
};

export default CountDown;
