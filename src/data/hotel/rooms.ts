import type { Room } from "@/types/hotel";

export const rooms: Room[] = [
	{
		id: "room-001",
		slug: "standard-garden-view",
		type: "standard",
		name: "Standard Garden View",
		shortDescription: "Comfortable retreat with serene garden views",
		fullDescription: `Experience tranquility in our Standard Garden View room.
This thoughtfully designed space offers a peaceful retreat with views of our
lush tropical gardens. Perfect for couples or solo travelers seeking comfort
without compromise.`,
		pricePerNight: 165000,
		currency: "CLP",
		images: [
			{
				id: "img-001-1",
				url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
				alt: "Standard room main view",
				isPrimary: true,
			},
			{
				id: "img-001-2",
				url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
				alt: "Standard room bathroom",
				isPrimary: false,
			},
			{
				id: "img-001-3",
				url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
				alt: "Garden view from balcony",
				isPrimary: false,
			},
		],
		amenityIds: ["wifi", "ac", "tv", "minibar", "safe", "coffee-maker"],
		capacity: {
			maxGuests: 2,
			beds: [{ type: "queen", count: 1 }],
		},
		size: { value: 320, unit: "sqft" },
		floorLevel: "Ground - 3rd",
		viewType: "garden",
		isAvailable: true,
		featuredOrder: 6,
	},
	{
		id: "room-002",
		slug: "ocean-view-deluxe",
		type: "ocean-view",
		name: "Ocean View Deluxe",
		shortDescription: "Wake up to breathtaking ocean panoramas",
		fullDescription: `Immerse yourself in the beauty of the Caribbean Sea from
our Ocean View Deluxe room. Floor-to-ceiling windows frame stunning ocean
vistas, while the private balcony provides the perfect spot to enjoy your
morning coffee as the sun rises over the water.`,
		pricePerNight: 255000,
		currency: "CLP",
		images: [
			{
				id: "img-002-1",
				url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
				alt: "Ocean view room panorama",
				isPrimary: true,
			},
			{
				id: "img-002-2",
				url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
				alt: "Private balcony",
				isPrimary: false,
			},
			{
				id: "img-002-3",
				url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
				alt: "Bedroom detail",
				isPrimary: false,
			},
			{
				id: "img-002-4",
				url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
				alt: "En-suite bathroom",
				isPrimary: false,
			},
		],
		amenityIds: [
			"wifi",
			"ac",
			"tv",
			"minibar",
			"safe",
			"coffee-maker",
			"balcony",
			"ocean-view",
			"bathrobes",
		],
		capacity: {
			maxGuests: 2,
			beds: [{ type: "king", count: 1 }],
		},
		size: { value: 420, unit: "sqft" },
		floorLevel: "4th - 8th",
		viewType: "ocean",
		isAvailable: true,
		featuredOrder: 2,
	},
	{
		id: "room-003",
		slug: "superior-pool-access",
		type: "superior",
		name: "Superior Pool Access",
		shortDescription: "Direct access to our infinity pool paradise",
		fullDescription: `Step directly from your room into our stunning infinity pool.
The Superior Pool Access room combines luxury with convenience, featuring a
private terrace with sun loungers and immediate access to crystal-clear waters.
Perfect for those who love to start their day with a refreshing swim.`,
		pricePerNight: 305000,
		currency: "CLP",
		images: [
			{
				id: "img-003-1",
				url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
				alt: "Pool access room exterior",
				isPrimary: true,
			},
			{
				id: "img-003-2",
				url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
				alt: "Room interior",
				isPrimary: false,
			},
			{
				id: "img-003-3",
				url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
				alt: "Private terrace",
				isPrimary: false,
			},
		],
		amenityIds: [
			"wifi",
			"ac",
			"tv",
			"minibar",
			"safe",
			"coffee-maker",
			"pool-access",
			"terrace",
			"bathrobes",
			"sun-loungers",
		],
		capacity: {
			maxGuests: 3,
			beds: [
				{ type: "king", count: 1 },
				{ type: "sofa-bed", count: 1 },
			],
		},
		size: { value: 480, unit: "sqft" },
		floorLevel: "Ground",
		viewType: "pool",
		isAvailable: true,
		featuredOrder: 3,
	},
	{
		id: "room-004",
		slug: "oceanfront-suite",
		type: "suite",
		name: "Oceanfront Suite",
		shortDescription: "Spacious suite with separate living and panoramic views",
		fullDescription: `Indulge in the epitome of coastal luxury with our Oceanfront Suite.
This expansive accommodation features a separate living area, dining space, and
bedroom, all oriented to capture the magnificent ocean views. The wrap-around
balcony offers multiple vantage points to watch dolphins play or boats sail by.`,
		pricePerNight: 485000,
		currency: "CLP",
		images: [
			{
				id: "img-004-1",
				url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
				alt: "Suite living area",
				isPrimary: true,
			},
			{
				id: "img-004-2",
				url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
				alt: "Master bedroom",
				isPrimary: false,
			},
			{
				id: "img-004-3",
				url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
				alt: "Wrap-around balcony",
				isPrimary: false,
			},
			{
				id: "img-004-4",
				url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
				alt: "Marble bathroom",
				isPrimary: false,
			},
			{
				id: "img-004-5",
				url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
				alt: "Dining area",
				isPrimary: false,
			},
		],
		amenityIds: [
			"wifi",
			"ac",
			"tv",
			"minibar",
			"safe",
			"coffee-maker",
			"balcony",
			"ocean-view",
			"bathrobes",
			"living-room",
			"dining-area",
			"jacuzzi-tub",
			"premium-toiletries",
		],
		capacity: {
			maxGuests: 4,
			beds: [
				{ type: "king", count: 1 },
				{ type: "sofa-bed", count: 1 },
			],
		},
		size: { value: 850, unit: "sqft" },
		floorLevel: "6th - 10th",
		viewType: "ocean",
		isAvailable: true,
		featuredOrder: 4,
	},
	{
		id: "room-005",
		slug: "family-beach-suite",
		type: "family-suite",
		name: "Family Beach Suite",
		shortDescription: "Ideal for families with connecting rooms and beach access",
		fullDescription: `Create unforgettable family memories in our Family Beach Suite.
This thoughtfully designed accommodation features a master bedroom with king bed,
a connecting kids' room with twin beds, and a shared living space. Direct beach
access means sandcastles are just steps away, while the in-room entertainment
center keeps everyone happy during downtime.`,
		pricePerNight: 555000,
		currency: "CLP",
		images: [
			{
				id: "img-005-1",
				url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
				alt: "Family suite overview",
				isPrimary: true,
			},
			{
				id: "img-005-2",
				url: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80",
				alt: "Kids room",
				isPrimary: false,
			},
			{
				id: "img-005-3",
				url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
				alt: "Master bedroom",
				isPrimary: false,
			},
			{
				id: "img-005-4",
				url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
				alt: "Beach access path",
				isPrimary: false,
			},
		],
		amenityIds: [
			"wifi",
			"ac",
			"tv",
			"minibar",
			"safe",
			"coffee-maker",
			"beach-access",
			"connecting-rooms",
			"kids-amenities",
			"game-console",
			"bathrobes",
			"two-bathrooms",
		],
		capacity: {
			maxGuests: 6,
			beds: [
				{ type: "king", count: 1 },
				{ type: "twin", count: 2 },
				{ type: "sofa-bed", count: 1 },
			],
		},
		size: { value: 1100, unit: "sqft" },
		floorLevel: "Ground - 2nd",
		viewType: "ocean",
		isAvailable: true,
		featuredOrder: 5,
	},
	{
		id: "room-006",
		slug: "presidential-penthouse",
		type: "presidential",
		name: "Presidential Penthouse",
		shortDescription: "Ultimate luxury with private rooftop and butler service",
		fullDescription: `Experience unparalleled luxury in our Presidential Penthouse.
Occupying the entire top floor, this magnificent residence features three bedrooms,
a gourmet kitchen, formal dining room, private cinema, and an expansive rooftop
terrace with infinity pool and outdoor kitchen. Personal butler service ensures
your every wish is anticipated and fulfilled.`,
		pricePerNight: 2200000,
		currency: "CLP",
		images: [
			{
				id: "img-006-1",
				url: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80",
				alt: "Penthouse living room",
				isPrimary: true,
			},
			{
				id: "img-006-2",
				url: "https://images.unsplash.com/photo-1572331165267-854da2b021aa?w=800&q=80",
				alt: "Rooftop infinity pool",
				isPrimary: false,
			},
			{
				id: "img-006-3",
				url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
				alt: "Master suite",
				isPrimary: false,
			},
			{
				id: "img-006-4",
				url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
				alt: "Private cinema",
				isPrimary: false,
			},
			{
				id: "img-006-5",
				url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
				alt: "Gourmet kitchen",
				isPrimary: false,
			},
			{
				id: "img-006-6",
				url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80",
				alt: "Formal dining room",
				isPrimary: false,
			},
		],
		amenityIds: [
			"wifi",
			"ac",
			"tv",
			"minibar",
			"safe",
			"coffee-maker",
			"balcony",
			"ocean-view",
			"bathrobes",
			"living-room",
			"dining-area",
			"jacuzzi-tub",
			"premium-toiletries",
			"butler-service",
			"private-pool",
			"private-cinema",
			"gourmet-kitchen",
			"rooftop-terrace",
			"outdoor-kitchen",
		],
		capacity: {
			maxGuests: 8,
			beds: [
				{ type: "king", count: 2 },
				{ type: "queen", count: 1 },
				{ type: "sofa-bed", count: 1 },
			],
		},
		size: { value: 3500, unit: "sqft" },
		floorLevel: "Penthouse",
		viewType: "ocean",
		isAvailable: true,
		featuredOrder: 1,
	},
];

export const getRoomBySlug = (slug: string): Room | undefined =>
	rooms.find((room) => room.slug === slug);

export const getRoomById = (id: string): Room | undefined =>
	rooms.find((room) => room.id === id);

export const getFeaturedRooms = (): Room[] =>
	rooms
		.filter((room) => room.featuredOrder)
		.sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
