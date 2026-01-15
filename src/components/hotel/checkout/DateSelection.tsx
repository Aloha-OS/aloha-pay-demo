import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { formatISODate, formatDisplayDate, calculateNights } from "@/lib/hotel/date-utils";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DateSelectionProps {
	checkIn: string | null;
	checkOut: string | null;
	numberOfGuests: number;
	onDatesChange: (checkIn: string, checkOut: string) => void;
	onGuestsChange: (guests: number) => void;
	onNext: () => void;
}

export function DateSelection({
	checkIn,
	checkOut,
	numberOfGuests,
	onDatesChange,
	onGuestsChange,
	onNext,
}: DateSelectionProps) {
	const { t } = useTranslation();
	const [dateRange, setDateRange] = useState<DateRange | undefined>(
		checkIn && checkOut
			? { from: new Date(checkIn), to: new Date(checkOut) }
			: undefined,
	);

	// Sync external state changes
	useEffect(() => {
		if (checkIn && checkOut) {
			setDateRange({ from: new Date(checkIn), to: new Date(checkOut) });
		}
	}, [checkIn, checkOut]);

	const handleSelect = (range: DateRange | undefined) => {
		setDateRange(range);
		if (range?.from && range?.to) {
			onDatesChange(formatISODate(range.from), formatISODate(range.to));
		}
	};

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const nights =
		dateRange?.from && dateRange?.to
			? calculateNights(formatISODate(dateRange.from), formatISODate(dateRange.to))
			: 0;

	const canProceed = Boolean(dateRange?.from && dateRange?.to && nights > 0);

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-2xl font-light text-zinc-900 mb-2">
					{t("checkout.whenStay")}
				</h2>
				<p className="text-zinc-600">
					{t("checkout.selectDatesAvailability")}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Calendar */}
				<Card>
					<CardContent className="p-4">
						<Calendar
							mode="range"
							selected={dateRange}
							onSelect={handleSelect}
							disabled={{ before: today }}
							numberOfMonths={1}
							className="rounded-md"
							classNames={{
								day_selected: "bg-resort-ocean text-white hover:bg-resort-ocean-dark",
								day_range_middle: "bg-resort-ocean-light/30",
							}}
						/>
					</CardContent>
				</Card>

				{/* Summary & Guests */}
				<div className="space-y-6">
					{/* Selected Dates Summary */}
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<CalendarDays className="h-5 w-5 text-resort-ocean" />
								<h3 className="font-medium text-zinc-900">{t("checkout.yourStay")}</h3>
							</div>

							<div className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<Label className="text-xs text-zinc-500 uppercase tracking-wider">
										{t("checkout.checkIn")}
									</Label>
									<p className="text-lg font-medium text-zinc-900 mt-1">
										{dateRange?.from
											? formatDisplayDate(dateRange.from)
											: t("checkout.selectDate")}
									</p>
								</div>
								<div>
									<Label className="text-xs text-zinc-500 uppercase tracking-wider">
										{t("checkout.checkOut")}
									</Label>
									<p className="text-lg font-medium text-zinc-900 mt-1">
										{dateRange?.to
											? formatDisplayDate(dateRange.to)
											: t("checkout.selectDate")}
									</p>
								</div>
							</div>

							{nights > 0 && (
								<div className="p-3 bg-resort-sand rounded-lg text-center">
									<span className="text-2xl font-semibold text-resort-ocean">
										{nights}
									</span>
									<span className="text-zinc-600 ml-2">
										{nights !== 1 ? t("common.nights") : t("common.night")}
									</span>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Number of Guests */}
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<Users className="h-5 w-5 text-resort-ocean" />
								<h3 className="font-medium text-zinc-900">{t("bookingSummary.guests")}</h3>
							</div>

							<Select
								value={numberOfGuests.toString()}
								onValueChange={(v) => onGuestsChange(Number.parseInt(v))}
							>
								<SelectTrigger>
									<SelectValue placeholder={t("bookingSummary.guests")} />
								</SelectTrigger>
								<SelectContent>
									{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
										<SelectItem key={num} value={num.toString()}>
											{num} {num !== 1 ? t("common.guests") : t("common.guest")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					{/* Continue Button */}
					<Button
						size="lg"
						className={cn(
							"w-full",
							canProceed
								? "bg-resort-ocean hover:bg-resort-ocean-dark"
								: "bg-zinc-200 text-zinc-500 cursor-not-allowed",
						)}
						disabled={!canProceed}
						onClick={onNext}
					>
						{t("checkout.continueToRoom")}
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
