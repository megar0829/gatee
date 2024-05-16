import React from 'react';
import { ScheduleListRes } from "@type/index";
import DayScheduleCard from "@pages/schedule/components/DayScheduleCard";
import dayjs from 'dayjs';
import calculateWeekday from "@utils/calculateWeekday";

interface DayToastProps {
  date: string,
  schedules: ScheduleListRes[];
  onCloseClick: () => void;
}

const DayToast = (props: DayToastProps) => {
  const { date, schedules, onCloseClick } = props;
  const dateTitle: string = dayjs(date).format("M월 D일");

  return (
    <div className="day-toast">
      <div className="day-toast__header">
        <div className="day-toast__title">{dateTitle} {`${calculateWeekday(dayjs(date))}요일`}</div>
        <button className="day-toast__close" onClick={onCloseClick}>close</button>
      </div>

      {/*일정 리스트*/}
      <div className="day-toast__schedule">
        {/*일정이 없는 경우*/}
        {schedules.length === 0 &&
          <div className="day-toast__no-event">일정이 없습니다</div>
        }

        {/*일정 리스트*/}
        {schedules.map((schedule: ScheduleListRes, index: number) => (
          <DayScheduleCard key={index} schedule={schedule}/>
        ))}
      </div>
    </div>
  );
}

export default DayToast;