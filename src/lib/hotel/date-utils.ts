import {
	format,
	differenceInDays,
	addDays,
	isAfter,
	isBefore,
	isValid,
	parseISO,
	startOfDay,
} from "date-fns";

/**
 * Format a date to display format (e.g., "Jan 15, 2025")
 */
export function formatDisplayDate(date: Date | string): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "MMM d, yyyy");
}

/**
 * Format a date to short display format (e.g., "Jan 15")
 */
export function formatShortDate(date: Date | string): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "MMM d");
}

/**
 * Format a date to ISO string format (YYYY-MM-DD)
 */
export function formatISODate(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

/**
 * Calculate the number of nights between two dates
 */
export function calculateNights(checkIn: string, checkOut: string): number {
	const startDate = parseISO(checkIn);
	const endDate = parseISO(checkOut);
	return differenceInDays(endDate, startDate);
}

/**
 * Get tomorrow's date
 */
export function getTomorrow(): Date {
	return addDays(startOfDay(new Date()), 1);
}

/**
 * Get date after specified number of days
 */
export function getDateAfterDays(days: number): Date {
	return addDays(startOfDay(new Date()), days);
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
	const d = typeof date === "string" ? parseISO(date) : date;
	return isBefore(startOfDay(d), startOfDay(new Date()));
}

/**
 * Check if a date is valid for booking (not in the past)
 */
export function isValidBookingDate(date: Date | string): boolean {
	const d = typeof date === "string" ? parseISO(date) : date;
	return isValid(d) && !isPastDate(d);
}

/**
 * Check if check-out date is after check-in date
 */
export function isValidDateRange(checkIn: string, checkOut: string): boolean {
	const startDate = parseISO(checkIn);
	const endDate = parseISO(checkOut);
	return isValid(startDate) && isValid(endDate) && isAfter(endDate, startDate);
}

/**
 * Get an array of dates between two dates (inclusive)
 */
export function getDatesBetween(startDate: string, endDate: string): string[] {
	const dates: string[] = [];
	const start = parseISO(startDate);
	const end = parseISO(endDate);
	const nights = differenceInDays(end, start);

	for (let i = 0; i <= nights; i++) {
		dates.push(formatISODate(addDays(start, i)));
	}

	return dates;
}

/**
 * Format date range for display (e.g., "Jan 15 - Jan 20, 2025")
 */
export function formatDateRange(checkIn: string, checkOut: string): string {
	const startDate = parseISO(checkIn);
	const endDate = parseISO(checkOut);

	// If same year, only show year once
	if (format(startDate, "yyyy") === format(endDate, "yyyy")) {
		return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
	}

	return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
}
