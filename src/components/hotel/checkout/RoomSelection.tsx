import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/hotel/RoomCard";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { formatDateRange } from "@/lib/hotel/date-utils";
import type { Room, ApiResponse } from "@/types/hotel";
import { cn } from "@/lib/utils";

interface RoomSelectionProps {
	checkIn: string;
	checkOut: string;
	numberOfGuests: number;
	selectedRoomId: string | null;
	onRoomSelect: (roomId: string) => void;
	onNext: () => void;
	onBack: () => void;
}

export function RoomSelection({
	checkIn,
	checkOut,
	numberOfGuests,
	selectedRoomId,
	onRoomSelect,
	onNext,
	onBack,
}: RoomSelectionProps) {
	const { t } = useTranslation();

	// Fetch rooms
	const { data: roomsData, isLoading: roomsLoading } = useQuery({
		queryKey: ["rooms"],
		queryFn: async () => {
			const res = await fetch("/api/rooms");
			return res.json() as Promise<ApiResponse<Room[]>>;
		},
	});

	// Fetch availability
	const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
		queryKey: ["availability", checkIn, checkOut],
		queryFn: async () => {
			const res = await fetch(
				`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}`,
			);
			return res.json() as Promise<
				ApiResponse<{ availableRoomIds: string[] }>
			>;
		},
	});

	const rooms = roomsData?.data ?? [];
	const availableRoomIds = availabilityData?.data?.availableRoomIds ?? [];

	const isLoading = roomsLoading || availabilityLoading;

	// Filter rooms by guest capacity and availability
	const filteredRooms = rooms.filter(
		(room) => room.capacity.maxGuests >= numberOfGuests,
	);

	const canProceed = Boolean(selectedRoomId);

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<h2 className="text-2xl font-light text-zinc-900 mb-2">
						{t("checkout.chooseRoom")}
					</h2>
					<p className="text-zinc-600">
						{t("checkout.chooseRoomDesc")}
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm text-zinc-600 bg-resort-sand px-4 py-2 rounded-lg">
					<CalendarDays className="h-4 w-4 text-resort-ocean" />
					<span>{formatDateRange(checkIn, checkOut)}</span>
					<span className="text-zinc-400">•</span>
					<span>
						{numberOfGuests} {numberOfGuests !== 1 ? t("common.guests") : t("common.guest")}
					</span>
				</div>
			</div>

			{/* Room List */}
			{isLoading ? (
				<div className="space-y-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="animate-pulse bg-zinc-100 rounded-xl h-48"
						/>
					))}
				</div>
			) : filteredRooms.length === 0 ? (
				<div className="text-center py-12 bg-zinc-50 rounded-xl">
					<p className="text-zinc-600 text-lg mb-2">
						{t("checkout.noRoomsAvailable", { count: numberOfGuests })}
					</p>
					<p className="text-zinc-500 text-sm">
						{t("checkout.noRoomsHint")}
					</p>
					<Button variant="outline" className="mt-4" onClick={onBack}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						{t("checkout.changeDates")}
					</Button>
				</div>
			) : (
				<div className="space-y-6">
					{filteredRooms.map((room) => {
						const isAvailable = availableRoomIds.includes(room.id);
						const isSelected = selectedRoomId === room.id;

						return (
							<div
								key={room.id}
								className={cn(
									"rounded-xl transition-all",
									isSelected && "ring-2 ring-resort-ocean ring-offset-2",
								)}
							>
								<RoomCard
									room={room}
									variant="list"
									showAvailability
									isAvailable={isAvailable}
									onSelect={isAvailable ? onRoomSelect : undefined}
								/>
							</div>
						);
					})}
				</div>
			)}

			{/* Navigation */}
			<div className="flex items-center justify-between pt-6 border-t border-zinc-200">
				<Button variant="outline" onClick={onBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t("common.back")}
				</Button>
				<Button
					className={cn(
						canProceed
							? "bg-resort-ocean hover:bg-resort-ocean-dark"
							: "bg-zinc-200 text-zinc-500 cursor-not-allowed",
					)}
					disabled={!canProceed}
					onClick={onNext}
				>
					{t("checkout.continueToGuest")}
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
