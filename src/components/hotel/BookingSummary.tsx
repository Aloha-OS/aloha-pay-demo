import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Moon } from "lucide-react";
import type { Room } from "@/types/hotel";
import { formatPrice } from "@/lib/hotel/price-utils";
import { formatDateRange } from "@/lib/hotel/date-utils";
import { cn } from "@/lib/utils";

interface BookingSummaryProps {
	room: Room | null;
	checkIn: string | null;
	checkOut: string | null;
	numberOfNights: number;
	numberOfGuests: number;
	totalPrice: number;
	isSticky?: boolean;
	className?: string;
}

export function BookingSummary({
	room,
	checkIn,
	checkOut,
	numberOfNights,
	numberOfGuests,
	totalPrice,
	isSticky = true,
	className,
}: BookingSummaryProps) {
	const hasRoom = Boolean(room);
	const hasDates = Boolean(checkIn && checkOut);

	if (!hasRoom && !hasDates) {
		return (
			<Card className={cn(isSticky && "sticky top-24", className)}>
				<CardHeader>
					<CardTitle className="text-lg">Booking Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-zinc-500 text-center py-4">
						Select dates and a room to see your booking summary.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn(isSticky && "sticky top-24", className)}>
			<CardHeader className="pb-4">
				<CardTitle className="text-lg">Booking Summary</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Room Preview */}
				{room && (
					<div className="flex gap-3">
						<div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
							<img
								src={room.images[0]?.url}
								alt={room.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<Badge variant="secondary" className="text-xs mb-1">
								{room.type.replace("-", " ")}
							</Badge>
							<h4 className="font-medium text-zinc-900 text-sm truncate">
								{room.name}
							</h4>
						</div>
					</div>
				)}

				{hasDates && (
					<>
						<Separator />

						{/* Dates */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm">
								<CalendarDays className="h-4 w-4 text-zinc-400" />
								<span className="text-zinc-600">
									{formatDateRange(checkIn!, checkOut!)}
								</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Moon className="h-4 w-4 text-zinc-400" />
								<span className="text-zinc-600">
									{numberOfNights} night{numberOfNights !== 1 ? "s" : ""}
								</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Users className="h-4 w-4 text-zinc-400" />
								<span className="text-zinc-600">
									{numberOfGuests} guest{numberOfGuests !== 1 ? "s" : ""}
								</span>
							</div>
						</div>
					</>
				)}

				{room && numberOfNights > 0 && (
					<>
						<Separator />

						{/* Price Breakdown */}
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-zinc-600">
									{formatPrice(room.pricePerNight)} × {numberOfNights} night
									{numberOfNights !== 1 ? "s" : ""}
								</span>
								<span className="text-zinc-900">
									{formatPrice(room.pricePerNight * numberOfNights)}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-zinc-600">Taxes & fees</span>
								<span className="text-zinc-900">Included</span>
							</div>
						</div>

						<Separator />

						{/* Total */}
						<div className="flex justify-between items-center">
							<span className="font-medium text-zinc-900">Total</span>
							<span className="text-2xl font-semibold text-resort-ocean">
								{formatPrice(totalPrice)}
							</span>
						</div>

						<p className="text-xs text-zinc-500 text-center">
							Free cancellation up to 24 hours before check-in
						</p>
					</>
				)}
			</CardContent>
		</Card>
	);
}
