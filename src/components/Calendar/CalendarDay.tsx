import { isToday, isWeekend } from "../../utils/helpers/date/utillsCalendar";
import st from "./Calendar.module.scss";
import classNames from "classnames";

export type DayProps = {
  date: Date;
  isSelected: boolean;
  dispatch: any;
  isNotCurrentMonth: any;
};

export function ToCardStrign(date: Date): string {
  const day = date.getDate();
  return date.getMonth() === new Date().getMonth() ? `${day}` : ` ${day}`;
}

export function CalendarDay({
  date,
  isSelected,
  dispatch,
  isNotCurrentMonth,
}: DayProps) {
  const cn = classNames(st.day, {
    [st.today]: isToday(date),
    [st.weekend]: isWeekend(date),
    [st.selected]: isSelected,
    [st.weekend_selected]: isSelected,
    [st.current_month]: isNotCurrentMonth,
  });

  return (
    <div
      onClick={() => {
        const action = {
          type: "updateSelection",
          data: isSelected ? null : date,
        };
        dispatch(action);
      }}
      className={cn}
    >
      {ToCardStrign(date)}
    </div>
  );
}
