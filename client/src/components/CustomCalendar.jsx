import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// bookedRanges: [{ from: Date, to: Date }]
const CustomCalendar = ({ bookedRanges, value, onChange, minDate, maxDate }) => {
  const [tileDisabled, setTileDisabled] = useState(() => () => false);

  useEffect(() => {
    setTileDisabled(() => (date) => {
      // Block if date is in any booked range
      return bookedRanges.some(range => {
        const from = new Date(range.from);
        const to = new Date(range.to);
        return date >= from && date <= to;
      });
    });
  }, [bookedRanges]);

  return (
    <Calendar
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      tileDisabled={({ date }) => tileDisabled(date)}
      selectRange={true}
      showNeighboringMonth={false}
    />
  );
};

export default CustomCalendar;
