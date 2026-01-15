import { Users, Bed } from "lucide-react";
import type { Room } from "@/types/hotel";
import { cn } from "@/lib/utils";

interface GuestCapacityProps {
	capacity: Room["capacity"];
	variant?: "icon-only" | "detailed";
	className?: string;
}

const bedTypeLabels: Record<string, string> = {
	king: "King",
	queen: "Queen",
	twin: "Twin",
	"sofa-bed": "Sofa Bed",
};

export function GuestCapacity({
	capacity,
	variant = "icon-only",
	className,
}: GuestCapacityProps) {
	const totalBeds = capacity.beds.reduce((acc, bed) => acc + bed.count, 0);

	if (variant === "icon-only") {
		return (
			<div className={cn("flex items-center gap-4 text-sm text-zinc-500", className)}>
				<span className="flex items-center gap-1">
					<Users className="h-4 w-4" />
					{capacity.maxGuests}
				</span>
				<span className="flex items-center gap-1">
					<Bed className="h-4 w-4" />
					{totalBeds}
				</span>
			</div>
		);
	}

	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex items-center gap-2 text-sm">
				<Users className="h-4 w-4 text-zinc-500" />
				<span className="text-zinc-600">
					Up to {capacity.maxGuests} guest{capacity.maxGuests > 1 ? "s" : ""}
				</span>
			</div>
			<div className="flex items-start gap-2 text-sm">
				<Bed className="h-4 w-4 text-zinc-500 mt-0.5" />
				<div className="text-zinc-600">
					{capacity.beds.map((bed, index) => (
						<span key={bed.type}>
							{bed.count} {bedTypeLabels[bed.type]}
							{bed.count > 1 ? "s" : ""}
							{index < capacity.beds.length - 1 ? ", " : ""}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
