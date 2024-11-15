"use client";

import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sessions = {
  "2024-01-02": {
    count: 3,
    students: ["Math 101", "Physics 201", "Chemistry 101"],
  },
  "2024-01-04": { count: 2, students: ["Biology 101", "English 201"] },
  "2024-01-07": {
    count: 5,
    students: [
      "Math 101",
      "Physics 201",
      "Chemistry 101",
      "Biology 101",
      "English 201",
    ],
  },
  "2024-01-12": {
    count: 4,
    students: ["Math 101", "Physics 201", "Chemistry 101", "Biology 101"],
  },
};

export default function Component() {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Generate calendar days
  const generateCalendarDays = () => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return {
        date,
        sessions: sessions[dateStr] || { count: 0, students: [] },
      };
    });
  };

  // Get background color based on session count
  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count === 1) return "bg-green-100 dark:bg-green-900";
    if (count === 2) return "bg-green-200 dark:bg-green-800";
    if (count === 3) return "bg-green-300 dark:bg-green-700";
    if (count === 4) return "bg-green-400 dark:bg-green-600";
    return "bg-green-500 dark:bg-green-500";
  };

  // Get text color based on session count
  const getTextColor = (count: number) => {
    if (count === 0) return "text-gray-500 dark:text-gray-400";
    if (count <= 2) return "text-green-800 dark:text-green-200";
    return "text-green-100 dark:text-green-900";
  };

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {format(subMonths(currentDate, 1), "MMMM")}
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button variant="outline" size="sm" onClick={goToNextMonth}>
          {format(addMonths(currentDate, 1), "MMMM")}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}
        {generateCalendarDays().map(({ date, sessions }, index) => (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <div
                className={`aspect-square p-2 rounded-md ${getHeatmapColor(
                  sessions.count
                )} hover:bg-green-600 dark:hover:bg-green-400 hover:text-white dark:hover:text-green-900 transition-colors cursor-pointer`}
              >
                <div
                  className={`flex flex-col h-full ${getTextColor(
                    sessions.count
                  )}`}
                >
                  <span className="text-sm font-medium">
                    {format(date, "d")}
                  </span>
                  {sessions.count > 0 && (
                    <div className="mt-auto flex items-center justify-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      <span>{sessions.count}</span>
                    </div>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {format(date, "MMMM d, yyyy")}
                </h3>
                {sessions.count > 0 ? (
                  <>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      {sessions.count} session
                      {sessions.count > 1 ? "s" : ""}
                    </p>
                    <ul className="space-y-1">
                      {sessions.students.map((student, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          {student}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sessions scheduled
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
