import { formatPrice } from "@/lib/hotel/price-utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
	amount: number;
	currency?: "CLP";
	period?: "night" | "total";
	originalAmount?: number;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function PriceDisplay({
	amount,
	currency = "CLP",
	period = "night",
	originalAmount,
	size = "md",
	className,
}: PriceDisplayProps) {
	const sizeClasses = {
		sm: "text-lg",
		md: "text-xl",
		lg: "text-2xl",
	};

	const periodLabel = period === "night" ? "/night" : " total";

	return (
		<div className={cn("flex items-baseline gap-2", className)}>
			{originalAmount && originalAmount > amount && (
				<span className="text-sm text-zinc-400 line-through">
					{formatPrice(originalAmount, currency)}
				</span>
			)}
			<span className={cn("font-semibold text-zinc-900", sizeClasses[size])}>
				{formatPrice(amount, currency)}
			</span>
			<span className="text-sm text-zinc-500">{periodLabel}</span>
		</div>
	);
}
