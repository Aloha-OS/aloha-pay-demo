import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatISODate, getDateAfterDays } from "@/lib/hotel/date-utils";
import type { AvailabilityEntry, ApiResponse } from "@/types/hotel";
import { cn } from "@/lib/utils";
import type { DayProps } from "react-day-picker";

interface AvailabilityCalendarProps {
	roomId: string;
	selectedCheckIn?: Date;
	selectedCheckOut?: Date;
	onDateSelect?: (checkIn: Date, checkOut: Date) => void;
	className?: string;
}

export function AvailabilityCalendar({
	roomId,
	selectedCheckIn,
	selectedCheckOut,
	onDateSelect,
	className,
}: AvailabilityCalendarProps) {
	// Fetch availability for the next 90 days
	const startDate = formatISODate(new Date());
	const endDate = formatISODate(getDateAfterDays(90));

	const { data: availabilityData, isLoading } = useQuery({
		queryKey: ["availability", roomId, startDate, endDate],
		queryFn: async () => {
			const res = await fetch(
				`/api/availability?roomId=${roomId}&checkIn=${startDate}&checkOut=${endDate}`,
			);
			return res.json() as Promise<
				ApiResponse<{
					roomId: string;
					isAvailable: boolean;
					entries: AvailabilityEntry[];
				}>
			>;
		},
	});

	const availability = availabilityData?.data?.entries ?? [];

	// Create a map of date -> availability for quick lookup
	const availabilityMap = new Map<string, AvailabilityEntry>();
	for (const entry of availability) {
		availabilityMap.set(entry.date, entry);
	}

	// Custom day render to show availability
	const renderDay = (day: DayProps) => {
		const dateStr = formatISODate(day.day.date);
		const entry = availabilityMap.get(dateStr);
		const isAvailable = entry?.isAvailable ?? true;
		const hasModifier = entry?.priceModifier && entry.priceModifier > 1;

		return (
			<div
				className={cn(
					"relative w-full h-full flex items-center justify-center",
					!isAvailable && "text-zinc-300",
				)}
			>
				{day.day.date.getDate()}
				{hasModifier && isAvailable && (
					<span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-resort-sunset" />
				)}
			</div>
		);
	};

	// Disable unavailable dates
	const disabledDays = availability
		.filter((entry) => !entry.isAvailable)
		.map((entry) => new Date(entry.date));

	// Also disable past dates
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
		if (range?.from && range?.to && onDateSelect) {
			onDateSelect(range.from, range.to);
		}
	};

	if (isLoading) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle className="text-lg">Availability</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="animate-pulse h-64 bg-zinc-100 rounded-lg" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg">Availability</CardTitle>
				<div className="flex items-center gap-4 text-sm text-zinc-500">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-white border border-zinc-200" />
						<span>Available</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-zinc-100" />
						<span>Unavailable</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-1 h-1 rounded-full bg-resort-sunset" />
						<span>Weekend rate</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Calendar
					mode="range"
					selected={
						selectedCheckIn && selectedCheckOut
							? { from: selectedCheckIn, to: selectedCheckOut }
							: undefined
					}
					onSelect={handleSelect}
					disabled={[{ before: today }, ...disabledDays]}
					numberOfMonths={1}
					className="rounded-md border"
					classNames={{
						day_selected: "bg-resort-ocean text-white hover:bg-resort-ocean-dark",
						day_range_middle: "bg-resort-ocean-light/30",
						day_disabled: "text-zinc-300 opacity-50",
					}}
					components={{
						Day: renderDay,
					}}
				/>
				{selectedCheckIn && selectedCheckOut && (
					<div className="mt-4 p-3 bg-resort-sand rounded-lg">
						<Badge className="bg-resort-ocean text-white">Selected Dates</Badge>
						<p className="text-sm text-zinc-600 mt-2">
							{selectedCheckIn.toLocaleDateString()} -{" "}
							{selectedCheckOut.toLocaleDateString()}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
