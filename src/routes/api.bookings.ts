import { createFileRoute } from "@tanstack/react-router";
import { getRoomById } from "@/data/hotel/rooms";
import { isRoomAvailableForDates } from "@/data/hotel/availability";
import { calculateNights } from "@/lib/hotel/date-utils";
import type { Booking, GuestInfo } from "@/types/hotel";

// In-memory bookings storage (for demo purposes)
const bookings: Booking[] = [];

interface CreateBookingBody {
	roomId: string;
	checkIn: string;
	checkOut: string;
	guestInfo: GuestInfo;
	paymentMethod: "aloha-pay" | "credit-card";
}

export const Route = createFileRoute("/api/bookings")({
	server: {
		handlers: {
			GET: () => {
				return Response.json({
					success: true,
					data: bookings,
					message: "Bookings retrieved successfully",
				});
			},
			POST: async ({ request }) => {
				const body = (await request.json()) as CreateBookingBody;
				const { roomId, checkIn, checkOut, guestInfo, paymentMethod } = body;

				// Validate required fields
				if (!roomId || !checkIn || !checkOut || !guestInfo || !paymentMethod) {
					return Response.json(
						{
							success: false,
							data: null,
							message: "Missing required fields",
						},
						{ status: 400 },
					);
				}

				// Validate room exists
				const room = getRoomById(roomId);
				if (!room) {
					return Response.json(
						{
							success: false,
							data: null,
							message: "Room not found",
						},
						{ status: 404 },
					);
				}

				// Check availability
				const isAvailable = isRoomAvailableForDates(roomId, checkIn, checkOut);
				if (!isAvailable) {
					return Response.json(
						{
							success: false,
							data: null,
							message: "Room is not available for the selected dates",
						},
						{ status: 409 },
					);
				}

				// Calculate total price
				const nights = calculateNights(checkIn, checkOut);
				const totalPrice = room.pricePerNight * nights;

				// Create booking
				const booking: Booking = {
					id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
					roomId,
					checkIn,
					checkOut,
					guestInfo,
					paymentMethod,
					totalPrice,
					status: "pending",
					createdAt: new Date().toISOString(),
				};

				bookings.push(booking);

				return Response.json(
					{
						success: true,
						data: booking,
						message: "Booking created successfully",
					},
					{ status: 201 },
				);
			},
		},
	},
});
