import { createFileRoute } from "@tanstack/react-router";
import {
	getAvailabilityByDateRange,
	getAvailableRoomsForDates,
	isRoomAvailableForDates,
} from "@/data/hotel/availability";

export const Route = createFileRoute("/api/availability")({
	server: {
		handlers: {
			GET: ({ request }) => {
				const url = new URL(request.url);
				const checkIn = url.searchParams.get("checkIn");
				const checkOut = url.searchParams.get("checkOut");
				const roomId = url.searchParams.get("roomId");

				// Validate required parameters
				if (!checkIn || !checkOut) {
					return Response.json(
						{
							success: false,
							data: null,
							message: "checkIn and checkOut parameters are required",
						},
						{ status: 400 },
					);
				}

				// Validate date format (YYYY-MM-DD)
				const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
				if (!dateRegex.test(checkIn) || !dateRegex.test(checkOut)) {
					return Response.json(
						{
							success: false,
							data: null,
							message: "Dates must be in YYYY-MM-DD format",
						},
						{ status: 400 },
					);
				}

				// If roomId is specified, check specific room availability
				if (roomId) {
					const isAvailable = isRoomAvailableForDates(roomId, checkIn, checkOut);
					const availability = getAvailabilityByDateRange(checkIn, checkOut, roomId);

					return Response.json({
						success: true,
						data: {
							roomId,
							isAvailable,
							checkIn,
							checkOut,
							entries: availability,
						},
						message: "Availability checked successfully",
					});
				}

				// Return all available room IDs for the date range
				const availableRoomIds = getAvailableRoomsForDates(checkIn, checkOut);
				const availability = getAvailabilityByDateRange(checkIn, checkOut);

				return Response.json({
					success: true,
					data: {
						checkIn,
						checkOut,
						availableRoomIds,
						entries: availability,
					},
					message: "Availability retrieved successfully",
				});
			},
		},
	},
});
