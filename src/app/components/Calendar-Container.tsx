"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import FullCalendar from "@fullcalendar/react";

interface CalendarContainerProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const CalendarContainer = ({
  onDateSelect,
  selectedDate,
}: CalendarContainerProps) => {
  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    onDateSelect(clickedDate);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] overflow-hidden">
          {selectedDate && (
            <div className="px-6 py-3 bg-[#0f0f0f] border-b border-[#1a1a1a]">
              <p className="text-sm text-[#e5e5e5]">
                Selected date:{" "}
                <span className="font-medium">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <button
                  onClick={() => onDateSelect("")}
                  className="ml-3 text-xs text-[#666666] hover:text-[#a0a0a0] underline"
                >
                  Clear selection
                </button>
              </p>
            </div>
          )}
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              googleCalendarPlugin,
            ]}
            initialView="dayGridMonth"
            // Google Calendar Integration
            googleCalendarApiKey={
              process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY!
            }
            events={{
              googleCalendarId:
                "6a3e6760852d3d6c78215518d5340b251dd28475e3416483f2942f98c02392c1@group.calendar.google.com",
            }}
            // Header toolbar - with week and day views
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            // Enable date selection
            selectable={true}
            selectMirror={true}
            dateClick={handleDateClick}
            // Readonly settings for events
            editable={false}
            dayMaxEvents={false}
            eventClick={(info) => {
              info.jsEvent.preventDefault(); // stop browser from visiting the link
              // Optionally: handle your own logic here
            }}
            // Styling and behavior
            height={400}
            aspectRatio={2.5}
            firstDay={1} // Start week on Monday
            weekNumbers={false}
            // Event styling
            eventDisplay="block"
            eventBackgroundColor="#2a2a2a"
            eventBorderColor="transparent"
            eventTextColor="#e5e5e5"
            // Responsive
            handleWindowResize={true}
            themeSystem="standard"
          />
        </div>
      </div>
      <style jsx global>{`
        /* Minimalist Dark Theme */
        .fc {
          --fc-bg-event-color: #2a2a2a;
          --fc-border-color: #1a1a1a;
          --fc-button-bg-color: transparent;
          --fc-button-border-color: #1a1a1a;
          --fc-button-hover-bg-color: #1a1a1a;
          --fc-button-hover-border-color: #2a2a2a;
          --fc-button-active-bg-color: #2a2a2a;
          --fc-today-bg-color: #111111;
          --fc-neutral-bg-color: #0a0a0a;
          --fc-page-bg-color: #0a0a0a;
          color: #a0a0a0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .fc .fc-toolbar {
          margin-bottom: 0;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #1a1a1a;
        }

        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 400;
          color: #e5e5e5;
          letter-spacing: -0.01em;
        }

        .fc .fc-button {
          background: transparent;
          border: 1px solid #1a1a1a;
          color: #a0a0a0;
          font-weight: 400;
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          transition: all 0.15s ease;
          font-size: 0.875rem;
        }

        .fc .fc-button:hover {
          background: #1a1a1a;
          border-color: #2a2a2a;
          color: #e5e5e5;
        }

        .fc .fc-button:focus {
          box-shadow: none;
          outline: none;
        }

        .fc .fc-button-active {
          background: #2a2a2a !important;
          border-color: #2a2a2a !important;
          color: #e5e5e5 !important;
        }

        .fc .fc-daygrid-day {
          border-color: #1a1a1a;
          min-height: 45px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .fc .fc-daygrid-day:hover {
          background-color: #111111;
        }

        /* Selected date styling */
        .fc .fc-daygrid-day.fc-day-selected {
          background-color: #1a2f1a !important;
          border-color: #2a4f2a !important;
        }

        .fc .fc-daygrid-day.fc-day-selected .fc-daygrid-day-number {
          color: #4ade80 !important;
          font-weight: 600;
        }

        .fc .fc-col-header {
          background: #0f0f0f;
          border-color: #1a1a1a;
        }

        .fc .fc-col-header-cell {
          border-color: #1a1a1a;
          padding: 0.75rem 0;
        }

        .fc .fc-col-header-cell-cushion {
          color: #666666;
          font-weight: 500;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fc .fc-daygrid-day-number {
          color: #a0a0a0;
          font-weight: 400;
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .fc .fc-day-today .fc-daygrid-day-number {
          color: #e5e5e5;
          font-weight: 500;
        }

        .fc .fc-day-today {
          background-color: #111111 !important;
        }

        /* Ensure today styling doesn't override selected */
        .fc .fc-day-today.fc-day-selected {
          background-color: #1a2f1a !important;
        }

        .fc .fc-event {
          border-radius: 3px;
          border: none;
          font-size: 0.75rem;
          font-weight: 400;
          margin: 1px;
          padding: 2px 6px;
          background: #2a2a2a;
          color: #e5e5e5;
          cursor: default;
        }

        .fc .fc-event-title {
          font-weight: 400;
        }

        .fc .fc-daygrid-event {
          margin-top: 1px;
          margin-bottom: 1px;
        }

        .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
          min-height: auto;
        }

        /* Mobile responsive - reorganize toolbar */
        @media (max-width: 768px) {
          .fc .fc-toolbar {
            padding: 1rem;
            flex-direction: column;
            gap: 0.75rem;
          }

          .fc .fc-toolbar-chunk:first-child {
            order: 2;
            display: flex;
            justify-content: center;
            margin-top: 0.5rem;
          }

          .fc .fc-toolbar-chunk:nth-child(2) {
            order: 1;
            display: flex;
            justify-content: center;
          }

          .fc .fc-toolbar-chunk:last-child {
            order: 3;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          .fc .fc-button {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }

          .fc .fc-toolbar-title {
            font-size: 1.125rem;
            margin-bottom: 0.25rem;
          }

          .fc .fc-daygrid-day {
            min-height: 40px;
          }
        }
      `}</style>
    </>
  );
};
