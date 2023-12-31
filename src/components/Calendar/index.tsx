import { CaretLeft, CaretRight } from 'phosphor-react';
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles';
import { getWeekDays } from '@/utils/get-week-days';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { api } from '@/lib/axios';

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelected: (date: Date) => void;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDates {
  blockedWeekdays: number[];
  blockedDates: number[];
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const router = useRouter();
  const username = String(router.query.username);

  const shortWeekDays = getWeekDays({ short: true });
  const currentMonth = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  async function getBlockedDates() {
    const response = await api.get(`/users/${username}/blocked-dates`, {
      params: {
        year: currentDate.get('year'),
        month: String(currentDate.get('month') + 1).padStart(2, '0'),
      },
    });

    return response.data;
  }

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      'blocked-dates',
      currentDate.get('year'),
      currentDate.get('month'),
    ],
    queryFn: getBlockedDates,
  });

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return [];
    }

    const firstDayInCurrentMonth = currentDate.startOf('month');
    const firstWeekday = firstDayInCurrentMonth.get('day');

    const lastDayInCurrentMonth = currentDate.endOf('month');
    const lastWeekday = lastDayInCurrentMonth.get('day');

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1);
    });

    const previousMonthFillArray = Array.from({
      length: firstWeekday,
    })
      .map((_, i) => {
        return firstDayInCurrentMonth.subtract(i + 1, 'day');
      })
      .reverse();

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekday + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day');
    });

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(dayjs()) ||
            blockedDates.blockedWeekdays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          });
        }

        return weeks;
      },
      []
    );

    return calendarWeeks;
  }, [currentDate, blockedDates]);

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month');
    setCurrentDate(previousMonthDate);
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month');
    setCurrentDate(nextMonthDate);
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handlePreviousMonth} aria-label="Previous month">
            <CaretLeft aria-hidden="true" />
          </button>
          <button onClick={handleNextMonth} aria-label="Next month">
            <CaretRight aria-hidden="true" />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekday) => (
              <th key={weekday}>{weekday}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td
                  key={date.toString()}
                  onClick={() => onDateSelected(date.toDate())}
                >
                  <CalendarDay disabled={disabled}>{date.date()}</CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
