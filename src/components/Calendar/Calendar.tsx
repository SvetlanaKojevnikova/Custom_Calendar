import React from "react";

import {
  checkDateIsEqual,
  checkIsToday,
  createMonth,
  createDate,
  getYearsInterval,
  getMonthesNames,
  getWeekDaysNames,
  getMonthNumberOfDays,
  getDays,
  isSameDate,
  getMonthMap,
  getShortWeekDayMap,
} from "../../utils/helpers/date/utillsCalendar";
// import { useCalendar } from "./hooks/useCalendar";
import { useState, useMemo } from "react";
import st from "./Calendar.module.scss";
import { useReducer } from "react";
import { CalendarDay } from "./CalendarDay";

interface CalendarProps {
  locale?: string;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  firstWeekDayNumber?: number;
}
type Action = {
  type: string;
  data: any;
};
type State = {
  selected?: Date;
};
const DAYS_IN_WEEK = 7;
const weeksToRender = 6;
const daysToRender = 7;

export const Calendar = ({
  locale = "default",
  selectedDate: date,
  selectDate,
  firstWeekDayNumber = 2,
}: CalendarProps) => {
  // const { functions, state } = useCalendar({
  //   locale,
  //   selectedDate: date,
  //   firstWeekDayNumber,
  // });
  // const [mode, setMode] = useState<"days" | "monthes" | "years">("days");
  const [selectedDay, setSelectedDay] = useState(createDate({ date }));
  const [selectedMonth, setSelectedMonth] = useState(
    createMonth({
      date: new Date(selectedDay.year, selectedDay.monthIndex),
      locale,
    })
  );
  const [selectedYear, setSelectedYear] = useState(selectedDay.year);
  const [selectedYearsInterval, setSelectedYearsInterval] = useState(
    getYearsInterval(selectedDay.year)
  );
  // const [panelMonth, setPanelMonth] = useState(false);

  const monthesNames = useMemo(() => getMonthesNames(locale), []);
  const weekDaysNames = useMemo(
    () => getWeekDaysNames(firstWeekDayNumber, locale),
    []
  );

  function calendarReducer(state: State, action: Action) {
    console.log(`dispatched: ${action.data}`);

    if (action.type === "updateSelection") {
      return { ...state, selected: action.data };
    }

    return state;
  }
  // function Calendar() {
  //   // const [date, setDate] = useState(() => new Date());
  //   const [selectedDate, setSelectedDay] = useState(new Date());
  const [mode, setMode] = useState<"days" | "month" | "year">("days");
  const [panelYear, setPanelYear] = useState(() => date.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => date.getMonth());

  // const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [state, dispatch] = useReducer(calendarReducer, {
    selected: undefined,
  });

  // const nextYear = () => {
  //   setPanelYear(panelYear + 1);
  // };
  // const prevYear = () => {
  //   setPanelYear(panelYear - 1);
  // };
  // const nextMonth = () => {
  //   if (panelMonth === 11) {
  //     setPanelMonth(0);
  //     setPanelYear(panelYear + 1);
  //   } else {
  //     setPanelMonth(panelMonth + 1);
  //   }
  // };
  // const prevMonth = () => {
  //   if (panelMonth === 0) {
  //     setPanelMonth(11);
  //     setPanelYear(panelYear - 1);
  //   } else {
  //     setPanelMonth(panelMonth - 1);
  //   }
  // };
  const dayCards = getDays(panelMonth, panelYear)
    .slice(0, weeksToRender * daysToRender)
    .map((day) => {
      const { date } = day;
      const uid = date.toDateString();
      const isNotCurrentMonth = day.type !== "current";

      return (
        <CalendarDay
          key={uid}
          date={date}
          isSelected={!!state.selected && isSameDate(state.selected, date)}
          dispatch={dispatch}
          isNotCurrentMonth={isNotCurrentMonth}
        />
      );
    });
  // const years

  return (
    <div className={st.calendar}>
      <div className={st.containerPanel}>
        {/* <div className={st.prev} onClick={prevYear}>
            <Icon name="arrow_prev" />
          </div>
          <div className={st.prev} onClick={prevMonth}>
            <Icon name="arrow_prev" />
          </div> */}
        <div className={st.panelDate}>
          <div className={st.panelMonth}>
            {getMonthMap("en")["en"][panelMonth]}
          </div>

          <div className={st.dropDown}>
            {getMonthMap("ru")["ru"].map((month, idx) => (
              <div
                key={idx}
                // onClick={handleOpenMonth}
                // className={st.panelWeek}
                //  { style=={{active= idx === highlightedIndex,
                //   onMouseEnter: () => setHighlightedIndex(idx)}}
              >
                {month}
              </div>
            ))}
          </div>

          <div className={st.year}>{panelYear}</div>
          <div className={st.dropDown}>1233</div>
        </div>

        {/* <div className={st.next} onClick={nextMonth}>
            <Icon name="arrow_next" />
          </div>
          <div className={st.next} onClick={nextYear}>
            <Icon name="arrow_next" />
          </div> */}
      </div>
      <div className={st.containerWeek}>
        {getShortWeekDayMap("ru")["ru"].map((weekDay, idx) => (
          <div key={idx} className={st.panelWeek}>
            {weekDay}
          </div>
        ))}
      </div>
      <div className={st.container}>{dayCards}</div>
    </div>
  );
};

export default Calendar;
