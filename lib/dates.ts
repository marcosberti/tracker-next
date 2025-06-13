import { format } from "date-fns";

export function formatDate(date: string | Date): string {
  return format(date, "MMMM dd, yyyy");
}

export function formatTime(date: string | Date): string {
  return format(date, "h:mm a");
}

export function formatMonthName(date: string | Date): string {
  return format(date, "MMMM");
}

export function getMonthStart(year: string, month: string): Date {
  return new Date(`${year}-${month}-01T00:00:00`);
}

export function getMonthEnd(year: string, month: string): Date {
  const date = new Date(Number(year), Number(month), 0);
  date.setHours(23, 59, 59, 999);

  return date;
}
