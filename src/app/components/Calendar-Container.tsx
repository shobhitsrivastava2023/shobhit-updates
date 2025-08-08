"use client"


import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';

export const CalendarContainer = () => {
  return (
    <>
     <div className="max-w-7xl mx-autopy-8">
        <div className="bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
            initialView="dayGridMonth"
            
            // Google Calendar Integration
            googleCalendarApiKey="AIzaSyDFWmDOYmHNQisPx418okz5Wx_VTFGxd9o"
            events={{
              googleCalendarId: '6a3e6760852d3d6c78215518d5340b251dd28475e3416483f2942f98c02392c1@group.calendar.google.com'
            }}
            
            // Header toolbar - simplified
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth'
            }}
            
            // Readonly settings
            editable={false}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={false}
            
            // Styling and behavior
            height={400} // Fixed smaller height
            aspectRatio={2.5}
            firstDay={1} // Start week on Monday
            weekNumbers={false}
            
            // Event styling
            eventDisplay="block"
            eventBackgroundColor="#2a2a2a"
            eventBorderColor="transparent"
            eventTextColor="#e5e5e5"
            
            // Disable interactions
            eventClick={false}
            dateClick={false}
            select={false}
            
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
          color: #a0a0a0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
        
        /* Remove interaction cursors */
        .fc .fc-event,
        .fc .fc-daygrid-day,
        .fc .fc-daygrid-day-number {
          cursor: default !important;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .fc .fc-toolbar {
            padding: 1rem;
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .fc .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
          
          .fc .fc-button {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
          
          .fc .fc-toolbar-title {
            font-size: 1.125rem;
          }
          
          .fc .fc-daygrid-day {
            min-height: 40px;
          }
        }
      `}</style>
      </>
      
  )
}