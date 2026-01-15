import type { Amenity } from "@/types/hotel";

export const amenities: Amenity[] = [
	// Connectivity
	{ id: "wifi", name: "High-Speed WiFi", icon: "Wifi", category: "connectivity" },
	{ id: "tv", name: "Smart TV", icon: "Tv", category: "entertainment" },

	// Comfort
	{ id: "ac", name: "Air Conditioning", icon: "Snowflake", category: "comfort" },
	{ id: "minibar", name: "Mini Bar", icon: "Wine", category: "dining" },
	{ id: "safe", name: "In-Room Safe", icon: "Lock", category: "comfort" },
	{ id: "coffee-maker", name: "Coffee Maker", icon: "Coffee", category: "dining" },
	{ id: "bathrobes", name: "Bathrobes & Slippers", icon: "Shirt", category: "comfort" },
	{ id: "sun-loungers", name: "Private Sun Loungers", icon: "Armchair", category: "comfort" },

	// Views & Outdoor
	{ id: "balcony", name: "Private Balcony", icon: "Home", category: "comfort" },
	{ id: "terrace", name: "Private Terrace", icon: "TreePalm", category: "comfort" },
	{ id: "ocean-view", name: "Ocean View", icon: "Waves", category: "comfort" },
	{ id: "pool-access", name: "Direct Pool Access", icon: "Droplets", category: "wellness" },
	{ id: "beach-access", name: "Beach Access", icon: "Umbrella", category: "wellness" },
	{ id: "rooftop-terrace", name: "Rooftop Terrace", icon: "Sun", category: "comfort" },

	// Bathroom
	{ id: "jacuzzi-tub", name: "Jacuzzi Tub", icon: "Bath", category: "bathroom" },
	{ id: "premium-toiletries", name: "Premium Toiletries", icon: "Sparkles", category: "bathroom" },
	{ id: "two-bathrooms", name: "Two Bathrooms", icon: "Bath", category: "bathroom" },

	// Living Space
	{ id: "living-room", name: "Separate Living Room", icon: "Sofa", category: "comfort" },
	{ id: "dining-area", name: "Dining Area", icon: "UtensilsCrossed", category: "dining" },
	{ id: "connecting-rooms", name: "Connecting Rooms", icon: "DoorOpen", category: "comfort" },
	{ id: "gourmet-kitchen", name: "Gourmet Kitchen", icon: "ChefHat", category: "dining" },
	{ id: "outdoor-kitchen", name: "Outdoor Kitchen", icon: "Flame", category: "dining" },

	// Entertainment
	{ id: "game-console", name: "Gaming Console", icon: "Gamepad2", category: "entertainment" },
	{ id: "private-cinema", name: "Private Cinema", icon: "Clapperboard", category: "entertainment" },

	// Services
	{ id: "butler-service", name: "24/7 Butler Service", icon: "BellRing", category: "comfort" },
	{ id: "kids-amenities", name: "Kids Amenities", icon: "Baby", category: "comfort" },

	// Wellness
	{ id: "private-pool", name: "Private Pool", icon: "Waves", category: "wellness" },
];

export const getAmenityById = (id: string): Amenity | undefined =>
	amenities.find((a) => a.id === id);

export const getAmenitiesByIds = (ids: string[]): Amenity[] =>
	ids.map((id) => getAmenityById(id)).filter((a): a is Amenity => a !== undefined);

export const groupAmenitiesByCategory = (
	amenityList: Amenity[],
): Record<string, Amenity[]> =>
	amenityList.reduce(
		(acc, amenity) => {
			if (!acc[amenity.category]) {
				acc[amenity.category] = [];
			}
			acc[amenity.category].push(amenity);
			return acc;
		},
		{} as Record<string, Amenity[]>,
	);
