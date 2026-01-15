// Room Types
export type RoomType =
	| "standard"
	| "ocean-view"
	| "superior"
	| "suite"
	| "family-suite"
	| "presidential";

// Amenity Categories
export type AmenityCategory =
	| "connectivity"
	| "comfort"
	| "bathroom"
	| "entertainment"
	| "dining"
	| "wellness";

// Amenity Definition
export interface Amenity {
	id: string;
	name: string;
	icon: string; // Lucide icon name
	category: AmenityCategory;
}

// Room Image
export interface RoomImage {
	id: string;
	url: string;
	alt: string;
	isPrimary: boolean;
}

// Room Definition
export interface Room {
	id: string;
	slug: string;
	type: RoomType;
	name: string;
	shortDescription: string;
	fullDescription: string;
	pricePerNight: number;
	currency: "CLP";
	images: RoomImage[];
	amenityIds: string[];
	capacity: {
		maxGuests: number;
		beds: {
			type: "king" | "queen" | "twin" | "sofa-bed";
			count: number;
		}[];
	};
	size: {
		value: number;
		unit: "sqft" | "sqm";
	};
	floorLevel: string;
	viewType: "ocean" | "garden" | "pool" | "city";
	isAvailable: boolean;
	featuredOrder?: number;
}

// Availability Entry
export interface AvailabilityEntry {
	roomId: string;
	date: string; // ISO date string (YYYY-MM-DD)
	isAvailable: boolean;
	priceModifier?: number; // Percentage adjustment (e.g., 1.2 for +20%)
}

// Guest Information
export interface GuestInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	country: string;
	specialRequests?: string;
}

// Booking State (Wizard)
export interface BookingState {
	step: 1 | 2 | 3 | 4;
	checkInDate: string | null;
	checkOutDate: string | null;
	selectedRoomId: string | null;
	guestInfo: GuestInfo | null;
	paymentMethod: "aloha-pay" | "credit-card" | null;
	numberOfGuests: number;
	numberOfNights: number;
	totalPrice: number;
}

// Booking Actions
export type BookingAction =
	| { type: "SET_DATES"; checkIn: string; checkOut: string }
	| { type: "SELECT_ROOM"; roomId: string }
	| { type: "SET_GUEST_INFO"; info: GuestInfo }
	| { type: "SET_PAYMENT_METHOD"; method: "aloha-pay" | "credit-card" }
	| { type: "SET_GUESTS"; count: number }
	| { type: "NEXT_STEP" }
	| { type: "PREV_STEP" }
	| { type: "GO_TO_STEP"; step: 1 | 2 | 3 | 4 }
	| { type: "RESET" };

// Booking (for API response)
export interface Booking {
	id: string;
	roomId: string;
	checkIn: string;
	checkOut: string;
	guestInfo: GuestInfo;
	paymentMethod: "aloha-pay" | "credit-card";
	totalPrice: number;
	status: "pending" | "confirmed" | "cancelled";
	createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}
