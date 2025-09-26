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
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Calendar
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        tileDisabled={({ date }) => tileDisabled(date)}
        selectRange={true}
        showNeighboringMonth={false}
      />
      
      {/* Professional Custom Styles */}
      <style jsx>{`
        /* Calendar Container */
        .react-calendar {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          padding: 20px !important;
          width: 100% !important;
          max-width: 400px !important;
          margin: 0 auto !important;
        }

        /* Navigation */
        .react-calendar__navigation {
          margin-bottom: 16px !important;
          height: auto !important;
        }

        .react-calendar__navigation button {
          background: transparent !important;
          border: none !important;
          color: #374151 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          transition: all 0.15s ease !important;
        }

        .react-calendar__navigation button:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }

        .react-calendar__navigation button:disabled {
          background: transparent !important;
          color: #9ca3af !important;
        }

        .react-calendar__navigation__label {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: #111827 !important;
        }

        .react-calendar__navigation__arrow {
          font-size: 20px !important;
          color: #6b7280 !important;
        }

        /* Month View */
        .react-calendar__month-view {
          margin: 0 !important;
        }

        /* Weekdays */
        .react-calendar__month-view__weekdays {
          margin-bottom: 8px !important;
        }

        .react-calendar__month-view__weekdays__weekday {
          padding: 12px 0 !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #6b7280 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          text-align: center !important;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
        }

        /* Days */
        .react-calendar__month-view__days {
          gap: 2px !important;
        }

        .react-calendar__tile {
          background: white !important;
          border: none !important;
          color: #374151 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          padding: 12px !important;
          margin: 1px !important;
          border-radius: 8px !important;
          transition: all 0.15s ease !important;
          cursor: pointer !important;
          position: relative !important;
          height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .react-calendar__tile:hover {
          background: #f8fafc !important;
          color: #111827 !important;
          transform: scale(1.05) !important;
        }

        /* Today */
        .react-calendar__tile--now {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%) !important;
          color: white !important;
          font-weight: 700 !important;
        }

        .react-calendar__tile--now:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%) !important;
          transform: scale(1.05) !important;
        }

        /* Active/Selected */
        .react-calendar__tile--active {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%) !important;
          color: white !important;
          font-weight: 700 !important;
        }

        .react-calendar__tile--active:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%) !important;
        }

        /* Range Selection */
        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%) !important;
          color: white !important;
          font-weight: 700 !important;
        }

        .react-calendar__tile--range {
          background: rgba(139, 92, 246, 0.1) !important;
          color: #8b5cf6 !important;
          font-weight: 600 !important;
        }

        /* Disabled (Booked) Dates */
        .react-calendar__tile:disabled {
          background: #fee2e2 !important;
          color: #dc2626 !important;
          cursor: not-allowed !important;
          opacity: 0.7 !important;
          position: relative !important;
        }

        .react-calendar__tile:disabled:hover {
          background: #fecaca !important;
          transform: none !important;
        }

        .react-calendar__tile:disabled::after {
          content: "✕" !important;
          position: absolute !important;
          top: 2px !important;
          right: 3px !important;
          font-size: 10px !important;
          color: #dc2626 !important;
          font-weight: 700 !important;
        }

        /* Neighboring Months (if shown) */
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db !important;
        }

        /* Weekend Styling */
        .react-calendar__month-view__days__day--weekend {
          color: #374151 !important;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .react-calendar {
            padding: 16px !important;
            max-width: 100% !important;
          }

          .react-calendar__tile {
            padding: 10px !important;
            font-size: 13px !important;
            height: 40px !important;
          }

          .react-calendar__navigation button {
            padding: 6px 10px !important;
            font-size: 14px !important;
          }

          .react-calendar__navigation__label {
            font-size: 16px !important;
          }
        }
      `}</style>
      
      {/* Legend for better UX */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h6 style={{
          margin: '0 0 12px 0',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          Calendar Legend
        </h6>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              borderRadius: '4px'
            }} />
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Today/Selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid #8b5cf6',
              borderRadius: '4px'
            }} />
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Selected Range</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: '#fee2e2',
              borderRadius: '4px',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '1px',
                right: '2px',
                fontSize: '8px',
                color: '#dc2626',
                fontWeight: '700'
              }}>✕</span>
            </div>
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
