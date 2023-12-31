import { useState } from 'react';
import { CalendarStep } from './CalendarStep';
import { ConfirmStep } from './ConfirmStep';

export function ScheduleForm() {
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>();

  function handleClearSelectedDatetime() {
    setSelectedDatetime(null);
  }

  if (selectedDatetime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDatetime}
        onCancelConfirmation={handleClearSelectedDatetime}
      />
    );
  }

  return <CalendarStep onSelectDatetime={setSelectedDatetime} />;
}
