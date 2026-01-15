import type { AvailabilityEntry } from "@/types/hotel";
import { rooms } from "./rooms";

// Generate availability for the next 90 days
const generateAvailability = (): AvailabilityEntry[] => {
	const entries: AvailabilityEntry[] = [];
	const today = new Date();

	for (const room of rooms) {
		for (let i = 0; i < 90; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			const dateStr = date.toISOString().split("T")[0];

			// Simulate some unavailability (20% chance)
			// Use a deterministic approach based on date and room for consistency
			const hash = (room.id.charCodeAt(5) + date.getDate() + date.getMonth()) % 10;
			const isAvailable = hash < 8; // 80% availability

			// Weekend price modifier (+15%)
			const dayOfWeek = date.getDay();
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

			entries.push({
				roomId: room.id,
				date: dateStr,
				isAvailable,
				priceModifier: isWeekend ? 1.15 : 1.0,
			});
		}
	}

	return entries;
};

export const availability: AvailabilityEntry[] = generateAvailability();

export const getAvailabilityForRoom = (
	roomId: string,
	startDate: string,
	endDate: string,
): AvailabilityEntry[] => {
	return availability.filter(
		(entry) =>
			entry.roomId === roomId &&
			entry.date >= startDate &&
			entry.date <= endDate,
	);
};

export const isRoomAvailableForDates = (
	roomId: string,
	startDate: string,
	endDate: string,
): boolean => {
	const entries = getAvailabilityForRoom(roomId, startDate, endDate);
	return entries.length > 0 && entries.every((entry) => entry.isAvailable);
};

export const getAvailableRoomsForDates = (
	startDate: string,
	endDate: string,
): string[] => {
	return rooms
		.filter((room) => isRoomAvailableForDates(room.id, startDate, endDate))
		.map((room) => room.id);
};

export const getAvailabilityByDateRange = (
	startDate: string,
	endDate: string,
	roomId?: string,
): AvailabilityEntry[] => {
	return availability.filter(
		(entry) =>
			entry.date >= startDate &&
			entry.date <= endDate &&
			(roomId ? entry.roomId === roomId : true),
	);
};
