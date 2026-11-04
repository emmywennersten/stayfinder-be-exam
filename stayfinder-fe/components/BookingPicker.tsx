"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { format, parseISO, startOfToday } from "date-fns";
import "react-day-picker/style.css";

import type { BookingDates } from "@/types/booking";

type BookingPickerProps = {
  initialDates?: BookingDates;
  onChange: (dates: BookingDates | undefined) => void;
};

// Kalender där man väljer in- och utcheckning. Datumen skickas vidare som "YYYY-MM-DD".
export default function BookingPicker({ initialDates, onChange }: BookingPickerProps) {
  const [range, setRange] = useState<DateRange | undefined>(
    initialDates
      ? { from: parseISO(initialDates.check_in), to: parseISO(initialDates.check_out) }
      : undefined,
  );

  function onSelect(next?: DateRange) {
    setRange(next);
    if (next?.from && next?.to) {
      onChange({
        check_in: format(next.from, "yyyy-MM-dd"),
        check_out: format(next.to, "yyyy-MM-dd"),
      });
    } else {
      onChange(undefined);
    }
  }

  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={onSelect}
      disabled={{ before: startOfToday() }}
    />
  );
}
