import { createFileRoute } from "@tanstack/react-router";
import { getRoomById, getRoomBySlug } from "@/data/hotel/rooms";

export const Route = createFileRoute("/api/rooms/$roomId")({
	server: {
		handlers: {
			GET: ({ params }) => {
				const { roomId } = params;

				// Try to find by ID first, then by slug
				let room = getRoomById(roomId);
				if (!room) {
					room = getRoomBySlug(roomId);
				}

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

				return Response.json({
					success: true,
					data: room,
					message: "Room retrieved successfully",
				});
			},
		},
	},
});
