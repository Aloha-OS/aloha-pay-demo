import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Maximize2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomGallery } from "@/components/hotel/RoomGallery";
import { AmenitiesList } from "@/components/hotel/AmenitiesList";
import { GuestCapacity } from "@/components/hotel/GuestCapacity";
import { PriceDisplay } from "@/components/hotel/PriceDisplay";
import { AvailabilityCalendar } from "@/components/hotel/AvailabilityCalendar";
import type { Room, ApiResponse } from "@/types/hotel";

export const Route = createFileRoute("/rooms/$roomId")({
	component: RoomDetailPage,
	head: ({ params }) => ({
		meta: [
			{ title: `${params.roomId} - Coral Cove Resort` },
		],
	}),
});

function RoomDetailPage() {
	const { t } = useTranslation();
	const { roomId } = Route.useParams();
	const navigate = useNavigate();

	const { data: roomData, isLoading, error } = useQuery({
		queryKey: ["room", roomId],
		queryFn: async () => {
			const res = await fetch(`/api/rooms/${roomId}`);
			return res.json() as Promise<ApiResponse<Room>>;
		},
	});

	const room = roomData?.data;

	const handleBookNow = () => {
		if (room) {
			navigate({
				to: "/checkout",
				search: { step: 1, roomId: room.id },
			});
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
					<div className="animate-pulse space-y-8">
						<div className="h-8 w-48 bg-zinc-200 rounded" />
						<div className="aspect-[16/10] bg-zinc-200 rounded-xl" />
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2 space-y-4">
								<div className="h-8 w-3/4 bg-zinc-200 rounded" />
								<div className="h-24 bg-zinc-200 rounded" />
							</div>
							<div className="h-80 bg-zinc-200 rounded-xl" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !room) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-medium text-zinc-900 mb-4">
						{t("rooms.roomNotFound")}
					</h1>
					<p className="text-zinc-600 mb-6">
						{t("rooms.roomNotFoundDesc")}
					</p>
					<Link to="/rooms">
						<Button>
							<ArrowLeft className="mr-2 h-4 w-4" />
							{t("rooms.backToRooms")}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pb-12">
			<div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
				{/* Back Button */}
				<Link
					to="/rooms"
					className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-6"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t("rooms.backToAllRooms")}
				</Link>

				{/* Gallery */}
				<RoomGallery images={room.images} roomName={room.name} className="mb-8" />

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Header */}
						<div>
							<div className="flex items-center gap-2 mb-3">
								<Badge variant="secondary">{t(`roomTypes.${room.type}`)}</Badge>
								<Badge variant="outline" className="text-resort-ocean border-resort-ocean">
									{t(`viewTypes.${room.viewType}`)}
								</Badge>
							</div>
							<h1 className="text-3xl md:text-4xl font-light text-zinc-900 mb-4">
								{room.name}
							</h1>
							<p className="text-lg text-zinc-600 leading-relaxed">
								{room.fullDescription}
							</p>
						</div>

						<Separator />

						{/* Room Details */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							<div>
								<p className="text-sm text-zinc-500 mb-1">{t("rooms.size")}</p>
								<p className="text-lg font-medium text-zinc-900 flex items-center gap-1">
									<Maximize2 className="h-4 w-4" />
									{room.size.value} {room.size.unit}
								</p>
							</div>
							<div>
								<p className="text-sm text-zinc-500 mb-1">{t("rooms.floor")}</p>
								<p className="text-lg font-medium text-zinc-900 flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									{room.floorLevel}
								</p>
							</div>
							<div className="col-span-2">
								<p className="text-sm text-zinc-500 mb-1">{t("rooms.capacity")}</p>
								<GuestCapacity capacity={room.capacity} variant="detailed" />
							</div>
						</div>

						<Separator />

						{/* Amenities */}
						<div>
							<h2 className="text-xl font-medium text-zinc-900 mb-4">
								{t("rooms.roomAmenities")}
							</h2>
							<AmenitiesList
								amenityIds={room.amenityIds}
								variant="grouped"
							/>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Booking Card */}
						<Card className="sticky top-24">
							<CardHeader>
								<CardTitle className="text-lg">{t("rooms.bookThisRoom")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-baseline justify-between">
									<span className="text-sm text-zinc-500">{t("common.from")}</span>
									<PriceDisplay amount={room.pricePerNight} size="lg" />
								</div>

								<Separator />

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("rooms.roomType")}</span>
										<span className="font-medium">{t(`roomTypes.${room.type}`)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("rooms.maxGuestsLabel")}</span>
										<span className="font-medium">{room.capacity.maxGuests}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("rooms.viewLabel")}</span>
										<span className="font-medium">{t(`viewTypes.${room.viewType}`)}</span>
									</div>
								</div>

								<Button
									className="w-full bg-resort-ocean hover:bg-resort-ocean-dark"
									size="lg"
									onClick={handleBookNow}
								>
									{t("common.bookNow")}
								</Button>

								<p className="text-xs text-center text-zinc-500">
									{t("rooms.freeCancellation")}
								</p>
							</CardContent>
						</Card>

						{/* Availability Calendar */}
						<AvailabilityCalendar roomId={room.id} />
					</div>
				</div>
			</div>
		</div>
	);
}
