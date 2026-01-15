import { createFileRoute } from "@tanstack/react-router";
import { rooms, getFeaturedRooms } from "@/data/hotel/rooms";

export const Route = createFileRoute("/api/rooms")({
	server: {
		handlers: {
			GET: ({ request }) => {
				const url = new URL(request.url);
				const featured = url.searchParams.get("featured");
				const type = url.searchParams.get("type");

				let filteredRooms = [...rooms];

				// Filter by featured if requested
				if (featured === "true") {
					filteredRooms = getFeaturedRooms();
				}

				// Filter by room type if specified
				if (type && type !== "all") {
					filteredRooms = filteredRooms.filter((room) => room.type === type);
				}

				return Response.json({
					success: true,
					data: filteredRooms,
					message: "Rooms retrieved successfully",
				});
			},
		},
	},
});
