import { Link } from "@tanstack/react-router";
import { ArrowRight, Maximize2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Room } from "@/types/hotel";
import { PriceDisplay } from "./PriceDisplay";
import { GuestCapacity } from "./GuestCapacity";
import { AmenitiesList } from "./AmenitiesList";
import { cn } from "@/lib/utils";

interface RoomCardProps {
	room: Room;
	variant?: "grid" | "list";
	showAvailability?: boolean;
	isAvailable?: boolean;
	onSelect?: (roomId: string) => void;
	className?: string;
}

const roomTypeLabels: Record<string, string> = {
	standard: "Standard",
	"ocean-view": "Ocean View",
	superior: "Superior",
	suite: "Suite",
	"family-suite": "Family Suite",
	presidential: "Presidential",
};

export function RoomCard({
	room,
	variant = "grid",
	showAvailability = false,
	isAvailable = true,
	onSelect,
	className,
}: RoomCardProps) {
	const primaryImage = room.images.find((img) => img.isPrimary) || room.images[0];

	if (variant === "list") {
		return (
			<Card
				className={cn(
					"overflow-hidden transition-shadow hover:shadow-lg",
					!isAvailable && "opacity-60",
					className,
				)}
			>
				<div className="flex flex-col md:flex-row">
					{/* Image */}
					<div className="md:w-80 flex-shrink-0">
						<Link to="/rooms/$roomId" params={{ roomId: room.slug }}>
							<div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
								<img
									src={primaryImage?.url}
									alt={primaryImage?.alt}
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
								/>
							</div>
						</Link>
					</div>

					{/* Content */}
					<CardContent className="flex-1 p-6 flex flex-col">
						<div className="flex items-start justify-between mb-2">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<Badge variant="secondary" className="text-xs">
										{roomTypeLabels[room.type]}
									</Badge>
									{showAvailability && (
										<Badge
											variant={isAvailable ? "default" : "secondary"}
											className={cn(
												"text-xs",
												isAvailable
													? "bg-resort-palm text-white"
													: "bg-zinc-200 text-zinc-500",
											)}
										>
											{isAvailable ? "Available" : "Unavailable"}
										</Badge>
									)}
								</div>
								<Link to="/rooms/$roomId" params={{ roomId: room.slug }}>
									<h3 className="text-xl font-medium text-zinc-900 hover:text-resort-ocean transition-colors">
										{room.name}
									</h3>
								</Link>
							</div>
							<PriceDisplay amount={room.pricePerNight} size="lg" />
						</div>

						<p className="text-sm text-zinc-600 mb-4 line-clamp-2">
							{room.shortDescription}
						</p>

						<div className="flex items-center gap-6 mb-4 text-sm text-zinc-500">
							<GuestCapacity capacity={room.capacity} />
							<span className="flex items-center gap-1">
								<Maximize2 className="h-4 w-4" />
								{room.size.value} {room.size.unit}
							</span>
						</div>

						<AmenitiesList
							amenityIds={room.amenityIds}
							variant="compact"
							maxItems={5}
							className="mb-4"
						/>

						<div className="mt-auto flex items-center gap-3">
							<Link to="/rooms/$roomId" params={{ roomId: room.slug }}>
								<Button variant="outline" size="sm">
									View Details
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							{onSelect && isAvailable && (
								<Button
									size="sm"
									className="bg-resort-ocean hover:bg-resort-ocean-dark"
									onClick={() => onSelect(room.id)}
								>
									Select Room
								</Button>
							)}
						</div>
					</CardContent>
				</div>
			</Card>
		);
	}

	// Grid variant
	return (
		<Card
			className={cn(
				"overflow-hidden group transition-shadow hover:shadow-lg",
				!isAvailable && "opacity-60",
				className,
			)}
		>
			{/* Image */}
			<Link to="/rooms/$roomId" params={{ roomId: room.slug }}>
				<div className="aspect-[4/3] overflow-hidden relative">
					<img
						src={primaryImage?.url}
						alt={primaryImage?.alt}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
					{showAvailability && (
						<div className="absolute top-3 right-3">
							<Badge
								className={cn(
									"text-xs",
									isAvailable
										? "bg-resort-palm text-white"
										: "bg-zinc-200 text-zinc-600",
								)}
							>
								{isAvailable ? "Available" : "Unavailable"}
							</Badge>
						</div>
					)}
				</div>
			</Link>

			{/* Content */}
			<CardContent className="p-5">
				<div className="flex items-center gap-2 mb-2">
					<Badge variant="secondary" className="text-xs">
						{roomTypeLabels[room.type]}
					</Badge>
				</div>

				<Link to="/rooms/$roomId" params={{ roomId: room.slug }}>
					<h3 className="text-lg font-medium text-zinc-900 mb-2 group-hover:text-resort-ocean transition-colors">
						{room.name}
					</h3>
				</Link>

				<p className="text-sm text-zinc-600 mb-4 line-clamp-2">
					{room.shortDescription}
				</p>

				<div className="flex items-center justify-between">
					<GuestCapacity capacity={room.capacity} />
					<PriceDisplay amount={room.pricePerNight} size="md" />
				</div>

				{onSelect && isAvailable && (
					<Button
						className="w-full mt-4 bg-resort-ocean hover:bg-resort-ocean-dark"
						onClick={() => onSelect(room.id)}
					>
						Select Room
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
