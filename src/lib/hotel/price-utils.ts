import type { Room, AvailabilityEntry } from "@/types/hotel";

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: "USD" = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

/**
 * Format price with decimal places
 */
export function formatPriceDetailed(
	amount: number,
	currency: "USD" = "USD",
): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}

/**
 * Calculate total price for a stay
 */
export function calculateTotalPrice(
	pricePerNight: number,
	numberOfNights: number,
	priceModifier: number = 1.0,
): number {
	return Math.round(pricePerNight * numberOfNights * priceModifier);
}

/**
 * Calculate total price with availability modifiers
 */
export function calculateTotalPriceWithAvailability(
	room: Room,
	availability: AvailabilityEntry[],
): number {
	if (availability.length === 0) return 0;

	// Sum up prices for each night (excluding checkout day)
	const nightsAvailability = availability.slice(0, -1);

	return nightsAvailability.reduce((total, entry) => {
		const modifier = entry.priceModifier ?? 1.0;
		return total + Math.round(room.pricePerNight * modifier);
	}, 0);
}

/**
 * Get average price per night including modifiers
 */
export function getAveragePricePerNight(
	room: Room,
	availability: AvailabilityEntry[],
): number {
	if (availability.length <= 1) return room.pricePerNight;

	const total = calculateTotalPriceWithAvailability(room, availability);
	const nights = availability.length - 1;

	return Math.round(total / nights);
}

/**
 * Check if price has weekend modifier
 */
export function hasWeekendModifier(availability: AvailabilityEntry[]): boolean {
	return availability.some((entry) => entry.priceModifier && entry.priceModifier > 1.0);
}

/**
 * Format price per night display
 */
export function formatPricePerNight(amount: number, currency: "USD" = "USD"): string {
	return `${formatPrice(amount, currency)}/night`;
}

/**
 * Calculate savings from original price
 */
export function calculateSavings(
	originalPrice: number,
	discountedPrice: number,
): number {
	return originalPrice - discountedPrice;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(
	originalPrice: number,
	discountedPrice: number,
): number {
	if (originalPrice === 0) return 0;
	return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
