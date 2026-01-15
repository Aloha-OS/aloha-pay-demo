import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RoomCard } from "@/components/hotel/RoomCard";
import type { Room, ApiResponse, RoomType } from "@/types/hotel";

const roomTypeKeys: { value: RoomType | "all"; labelKey: string }[] = [
	{ value: "all", labelKey: "rooms.filterAll" },
	{ value: "standard", labelKey: "rooms.filterStandard" },
	{ value: "ocean-view", labelKey: "rooms.filterOceanView" },
	{ value: "superior", labelKey: "rooms.filterSuperior" },
	{ value: "suite", labelKey: "rooms.filterSuite" },
	{ value: "family-suite", labelKey: "rooms.filterFamilySuite" },
	{ value: "presidential", labelKey: "rooms.filterPresidential" },
];

export const Route = createFileRoute("/rooms/")({
	component: RoomsListingPage,
	validateSearch: (search: Record<string, unknown>) => ({
		type: (search.type as RoomType | "all") || "all",
	}),
	head: () => ({
		meta: [
			{ title: "Rooms & Suites - Coral Cove Resort" },
			{
				name: "description",
				content:
					"Browse our collection of luxurious rooms and suites at Coral Cove Resort.",
			},
		],
	}),
});

function RoomsListingPage() {
	const { t } = useTranslation();
	const navigate = useNavigate({ from: "/rooms" });
	const { type } = Route.useSearch();
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const { data: roomsData, isLoading } = useQuery({
		queryKey: ["rooms", type],
		queryFn: async () => {
			const params = type !== "all" ? `?type=${type}` : "";
			const res = await fetch(`/api/rooms${params}`);
			return res.json() as Promise<ApiResponse<Room[]>>;
		},
	})

	const rooms = roomsData?.data ?? [];

	const handleTypeChange = (value: string) => {
		navigate({
			search: { type: value as RoomType | "all" },
		})
	}

	return (
		<div className="min-h-screen">
			{/* Hero Banner */}
			<section
				className="relative h-64 flex items-center"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="absolute inset-0 bg-black/50" />
				<div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
					<h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
						{t("rooms.title")}
					</h1>
					<p className="text-lg text-white/80 mt-2">
						{t("rooms.subtitle")}
					</p>
				</div>
			</section>

			{/* Filters & Content */}
			<section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
				{/* Filter Bar */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-200">
					<div className="flex items-center gap-4">
						<SlidersHorizontal className="h-5 w-5 text-zinc-400" />
						<Select value={type} onValueChange={handleTypeChange}>
							<SelectTrigger className="w-48">
								<SelectValue placeholder={t("rooms.roomType")} />
							</SelectTrigger>
							<SelectContent>
								{roomTypeKeys.map((roomType) => (
									<SelectItem key={roomType.value} value={roomType.value}>
										{t(roomType.labelKey)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-zinc-500 mr-2">
							{t("rooms.roomsFound", { count: rooms.length })}
						</span>
						<div className="flex items-center border rounded-lg overflow-hidden">
							<Button
								variant={viewMode === "grid" ? "secondary" : "ghost"}
								size="sm"
								className="rounded-none"
								onClick={() => setViewMode("grid")}
							>
								<LayoutGrid className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "secondary" : "ghost"}
								size="sm"
								className="rounded-none"
								onClick={() => setViewMode("list")}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Rooms Grid/List */}
				{isLoading ? (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
								: "space-y-6"
						}
					>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="animate-pulse bg-zinc-100 rounded-xl h-80"
							/>
						))}
					</div>
				) : rooms.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-zinc-500 text-lg">
							{t("rooms.noRoomsFound")}
						</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => handleTypeChange("all")}
						>
							{t("rooms.clearFilters")}
						</Button>
					</div>
				) : viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{rooms.map((room) => (
							<RoomCard key={room.id} room={room} variant="grid" />
						))}
					</div>
				) : (
					<div className="space-y-6">
						{rooms.map((room) => (
							<RoomCard key={room.id} room={room} variant="list" />
						))}
					</div>
				)}
			</section>
		</div>
	)
}
