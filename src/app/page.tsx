"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { CalendarContainer } from "./components/Calendar-Container";
import DailyEntriesTable from "./components/DailyEntryTable";
import { useState } from "react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleDateClear = () => {
    setSelectedDate('');
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-mono font-light tracking-wide text-gray-100">
            shobhit.sh <span className="animate-blink">{`>`}</span>
          </h1>
          <style jsx>{`
            .animate-blink {
              animation: blink 1s steps(2, start) infinite;
            }
            @keyframes blink {
              to {
                visibility: hidden;
              }
            }
          `}</style>
          <div className="mb-4 mt-5">

         
           <CalendarContainer 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
           </div>
          <div className="">
            <h1 className="font-mono text-2xl ">
               PoW
            </h1>
           
          </div>
         <DailyEntriesTable 
              selectedDate={selectedDate}
              onDateClear={handleDateClear}
            />
        </div>
      </div>
    </div>
  );
}
