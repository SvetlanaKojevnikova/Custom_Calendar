export const checkIsToday = (date: Date) => {
  const today = new Date();

  return checkDateIsEqual(today, date);
};
export const checkDateIsEqual = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

interface CreateDateParams {
  locale?: string;
  date?: Date;
}

export const createDate = (params?: CreateDateParams) => {
  const locale = params?.locale ?? "default";

  const d = params?.date ?? new Date();
  const dayNumber = d.getDate();
  const day = d.toLocaleDateString(locale, { weekday: "long" });
  const dayNumberInWeek = d.getDay() + 1;
  const dayShort = d.toLocaleDateString(locale, { weekday: "short" });
  const year = d.getFullYear();
  const yearShort = d.toLocaleDateString(locale, { year: "2-digit" });
  const month = d.toLocaleDateString(locale, { month: "long" });
  const monthShort = d.toLocaleDateString(locale, { month: "short" });
  const monthNumber = d.getMonth() + 1;
  const monthIndex = d.getMonth();
  const timestamp = d.getTime();
  const week = getWeekNumber(d);

  return {
    date: d,
    dayNumber,
    day,
    dayNumberInWeek,
    dayShort,
    year,
    yearShort,
    month,
    monthShort,
    monthNumber,
    monthIndex,
    timestamp,
    week,
  };
};
export const getMonthNumberOfDays = (
  monthIndex: number,
  yearNumber: number = new Date().getFullYear()
) => new Date(yearNumber, monthIndex + 1, 0).getDate();

interface CreateMonthParams {
  date?: Date;
  locale?: string;
}

export const createMonth = (params?: CreateMonthParams) => {
  const date = params?.date ?? new Date();
  const locale = params?.locale ?? "default";

  const d = createDate({ date, locale });
  const { month: monthName, year, monthNumber, monthIndex } = d;

  const getDay = (dayNumber: number) =>
    createDate({ date: new Date(year, monthIndex, dayNumber), locale });

  const createMonthDays = () => {
    const days = [];

    for (let i = 0; i <= getMonthNumberOfDays(monthIndex, year) - 1; i += 1) {
      days[i] = getDay(i + 1);
    }

    return days;
  };

  return {
    getDay,
    monthName,
    monthIndex,
    monthNumber,
    year,
    createMonthDays,
  };
};

interface CreateYearParams {
  year?: number;
  locale?: string;
  monthNumber?: number;
}

export const createYear = (params?: CreateYearParams) => {
  const locale = params?.locale ?? "default";

  const monthCount = 12;
  const today = createDate();

  const year = params?.year ?? today.year;
  const monthNumber = params?.monthNumber ?? today.monthNumber;

  const month = createMonth({ date: new Date(year, monthNumber - 1), locale });

  const getMonthDays = (monthIndex: number) =>
    createMonth({ date: new Date(year, monthIndex), locale }).createMonthDays();

  const createYearMonthes = () => {
    const monthes = [];

    for (let i = 0; i <= monthCount - 1; i += 1) {
      monthes[i] = getMonthDays(i);
    }

    return monthes;
  };

  return {
    createYearMonthes,
    month,
    year,
  };
};
export const formatDate = (date: Date, format: string) => {
  const d = createDate({ date });

  return format
    .replace(/\bYYYY\b/, d.year.toString())
    .replace(/\bYYY\b/, d.yearShort)
    .replace(/\bWW\b/, d.week.toString().padStart(2, "0"))
    .replace(/\bW\b/, d.week.toString())
    .replace(/\bDDDD\b/, d.day)
    .replace(/\bDDD\b/, d.dayShort)
    .replace(/\bDD\b/, d.dayNumber.toString().padStart(2, "0"))
    .replace(/\bD\b/, d.dayNumber.toString())
    .replace(/\bMMMM\b/, d.month)
    .replace(/\bMMM\b/, d.monthShort)
    .replace(/\bMM\b/, d.monthNumber.toString().padStart(2, "0"))
    .replace(/\bM\b/, d.monthNumber.toString());
};

export const getMonthesNames = (locale: string = "defalut") => {
  const monthesNames: {
    month: ReturnType<typeof createDate>["month"];
    monthShort: ReturnType<typeof createDate>["monthShort"];
    monthIndex: ReturnType<typeof createDate>["monthIndex"];
    date: ReturnType<typeof createDate>["date"];
  }[] = Array.from({ length: 12 });

  const d = new Date();

  monthesNames.forEach((_, i) => {
    const { month, monthIndex, monthShort, date } = createDate({
      locale,
      date: new Date(d.getFullYear(), d.getMonth() + i, 1),
    });

    monthesNames[monthIndex] = { month, monthIndex, monthShort, date };
  });

  return monthesNames;
};
export const getWeekDaysNames = (
  firstWeekDay: number = 4,
  locale: string = "default"
) => {
  const weekDaysNames: {
    day: ReturnType<typeof createDate>["day"];
    dayShort: ReturnType<typeof createDate>["dayShort"];
  }[] = Array.from({ length: 7 });

  const date = new Date();

  weekDaysNames.forEach((_, i) => {
    const { day, dayNumberInWeek, dayShort } = createDate({
      locale,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + i),
    });

    weekDaysNames[dayNumberInWeek - 1] = { day, dayShort };
  });

  return [
    ...weekDaysNames.slice(firstWeekDay - 1),
    ...weekDaysNames.slice(0, firstWeekDay - 1),
  ];
};
export const getWeekNumber = (date: Date) => {
  const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (date.getTime() - firstDayOfTheYear.getTime()) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7);
};
export const getYearsInterval = (year: number) => {
  const startYear = Math.floor(year / 10) * 10;
  return [...Array(10)].map((_, index) => startYear + index);
};
export function dayOf(date: Date): number {
  return date.getDate();
}
export function monthOf(date: Date): number {
  return date.getMonth() + 1;
}

export const buildKey = (date: Date) => {
  const year = date.getFullYear();
  const month = monthOf(date);
  const day = dayOf(date);
  return `${year}-${month}-${day}`;
};
export function isSameDate(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
export function weekDayOf(date: Date): number {
  return ((date.getDay() + 6) % 7) + 1;
}
/**
 * Возвращает количество дней в текущем месяце
 * @param {*} month Индекс месяца
 */
export const getDaysInMonth = (month: number, year?: number) => {
  return new Date(year ?? new Date().getFullYear(), month + 1, 0).getDate();
};

const VISIBLE_CELLS_AMMOUNT = 7 * 6;
export const getDays = (month: number, targetYear?: number) => {
  const days: any[] = [];
  const today = new Date();
  const year = targetYear ?? today.getFullYear();

  const currMonth = month ? month : today.getMonth();
  const prevMonth = (currMonth + 11) % 12;
  const daysInCurrMonth = getDaysInMonth(currMonth);

  // step 1 - build current month days
  Array(daysInCurrMonth)
    .fill(0)
    .forEach((_, i) => {
      const idx = i + 1;
      days.push({
        date: new Date(year, currMonth, idx),
        current: true,
        type: "current",
      });
    });

  // step 2 - backfill previous month days
  const prevYear = currMonth === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);
  const monthFirstDayOfWeek = weekDayOf(new Date(year, currMonth, 1)); // first day of current month
  const toFillBack = monthFirstDayOfWeek - 1;
  Array(toFillBack)
    .fill(0)
    .forEach((_, i) => {
      const idx = daysInPrevMonth - i;
      days.unshift({
        date: new Date(prevYear, prevMonth, idx),
        current: false,
        type: "prev",
      });
    });

  // step 3 - forward fill
  const nextMonth = (currMonth + 1) % 12;
  const nextYear = currMonth === 11 ? year + 1 : year;
  const monthLastDayOfWeek = weekDayOf(new Date(nextYear, nextMonth, 0));
  const toFillForward = VISIBLE_CELLS_AMMOUNT - 7 - monthLastDayOfWeek;
  Array(toFillForward)
    .fill(0)
    .forEach((_, i) => {
      const idx = i + 1;
      days.push({
        date: new Date(nextYear, nextMonth, idx),
        current: false,
        type: "next",
      });
    });

  return days;
};
export const isWeekend = (date: Date) => {
  const day = weekDayOf(date);
  return day === 6 || day === 7;
};
export const isToday = (date: Date) => {
  const today = new Date();
  return isSameDate(date, today);
};
export const isCurrentMonth = (date: Date) => {
  const day = date.getDate();
  return date.getMonth() === new Date().getMonth() ? `${day}` : ` ${day}`;
};

/**
 * Returns current date without time
 */
export const getToday = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};
export const monthMap = {
  ru: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентярь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December ",
  ],
};

export const shortWeekDayMap = {
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
export function getMonthMap(key: any) {
  return monthMap;
}
export function getShortWeekDayMap(key: any) {
  return shortWeekDayMap;
}
