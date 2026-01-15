import { createFileRoute } from "@tanstack/react-router";
import { amenities, getAmenitiesByIds } from "@/data/hotel/amenities";

export const Route = createFileRoute("/api/amenities")({
	server: {
		handlers: {
			GET: ({ request }) => {
				const url = new URL(request.url);
				const idsParam = url.searchParams.get("ids");

				// If specific IDs are requested, filter by them
				if (idsParam) {
					const ids = idsParam.split(",");
					const filteredAmenities = getAmenitiesByIds(ids);

					return Response.json({
						success: true,
						data: filteredAmenities,
						message: "Amenities retrieved successfully",
					});
				}

				// Return all amenities
				return Response.json({
					success: true,
					data: amenities,
					message: "Amenities retrieved successfully",
				});
			},
		},
	},
});
