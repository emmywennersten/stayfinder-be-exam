import { differenceInCalendarDays, parseISO } from "date-fns";

export function countNights(checkIn: string, checkOut: string): number {
  return Math.max(0, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)));
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("sv-SE")} kr`;
}
