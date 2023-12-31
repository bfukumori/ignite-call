import { Calendar } from '@/components/Calendar';
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles';
import { useState } from 'react';
import dayjs from 'dayjs';
import { api } from '@/lib/axios';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

interface CalendarStepProps {
  onSelectDatetime: (date: Date) => void;
}

export function CalendarStep({ onSelectDatetime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();
  const username = String(router.query.username);

  const isDateSelected = !!selectedDate;
  const weekday = selectedDate ? dayjs(selectedDate).format('dddd') : null;
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null;

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null;

  async function getAvailability() {
    const response = await api.get(`/users/${username}/availability`, {
      params: {
        date: selectedDateWithoutTime,
      },
    });
    return response.data;
  }

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: getAvailability,
    enabled: !!selectedDate,
  });

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate();
    onSelectDatetime(dateWithTime);
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekday}, <span>{describedDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
                onClick={() => handleSelectTime(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}
