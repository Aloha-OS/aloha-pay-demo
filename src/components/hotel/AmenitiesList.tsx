import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAmenitiesByIds, groupAmenitiesByCategory } from "@/data/hotel/amenities";
import type { Amenity } from "@/types/hotel";
import { cn } from "@/lib/utils";

interface AmenitiesListProps {
	amenityIds: string[];
	variant?: "compact" | "full" | "grouped";
	maxItems?: number;
	className?: string;
}

const categoryLabels: Record<string, string> = {
	connectivity: "Connectivity",
	comfort: "Comfort & Space",
	bathroom: "Bathroom",
	entertainment: "Entertainment",
	dining: "Dining",
	wellness: "Wellness",
};

function getIcon(iconName: string): LucideIcon {
	const icons = LucideIcons as Record<string, LucideIcon>;
	return icons[iconName] || LucideIcons.Circle;
}

function AmenityItem({
	amenity,
	showLabel = true,
}: {
	amenity: Amenity;
	showLabel?: boolean;
}) {
	const Icon = getIcon(amenity.icon);

	return (
		<div className="flex items-center gap-2 text-sm text-zinc-600">
			<Icon className="h-4 w-4 text-resort-ocean flex-shrink-0" />
			{showLabel && <span>{amenity.name}</span>}
		</div>
	);
}

export function AmenitiesList({
	amenityIds,
	variant = "compact",
	maxItems,
	className,
}: AmenitiesListProps) {
	const amenities = getAmenitiesByIds(amenityIds);
	const displayAmenities = maxItems ? amenities.slice(0, maxItems) : amenities;
	const remainingCount = maxItems ? Math.max(0, amenities.length - maxItems) : 0;

	if (variant === "compact") {
		return (
			<div className={cn("flex flex-wrap gap-x-4 gap-y-2", className)}>
				{displayAmenities.map((amenity) => (
					<AmenityItem key={amenity.id} amenity={amenity} />
				))}
				{remainingCount > 0 && (
					<span className="text-sm text-zinc-400">+{remainingCount} more</span>
				)}
			</div>
		);
	}

	if (variant === "full") {
		return (
			<div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", className)}>
				{amenities.map((amenity) => (
					<AmenityItem key={amenity.id} amenity={amenity} />
				))}
			</div>
		);
	}

	// Grouped variant
	const grouped = groupAmenitiesByCategory(amenities);

	return (
		<div className={cn("space-y-6", className)}>
			{Object.entries(grouped).map(([category, items]) => (
				<div key={category}>
					<h4 className="text-sm font-medium text-zinc-900 mb-3">
						{categoryLabels[category] || category}
					</h4>
					<div className="grid grid-cols-2 gap-3">
						{items.map((amenity) => (
							<AmenityItem key={amenity.id} amenity={amenity} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
