import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, CreditCard, Globe, Shield, CheckCircle, Loader2 } from "lucide-react";
import type { BookingState, Room, GuestInfo } from "@/types/hotel";
import { cn } from "@/lib/utils";
import { AlohaPayCheckout, isAlohaPaCountrySupported, type AlohaPayCountry } from "@/components/aloha-pay/AlohaPayCheckout";

interface PaymentMethodProps {
	selectedMethod: "aloha-pay" | "credit-card" | null;
	onMethodSelect: (method: "aloha-pay" | "credit-card") => void;
	onConfirm: () => void;
	onBack: () => void;
	bookingState: BookingState;
	selectedRoom: Room | undefined;
	guestInfo: GuestInfo | null;
	isSubmitting?: boolean;
}

export function PaymentMethod({
	selectedMethod,
	onMethodSelect,
	onConfirm,
	onBack,
	bookingState,
	selectedRoom,
	guestInfo,
	isSubmitting = false,
}: PaymentMethodProps) {
	const { t } = useTranslation();
	const [paymentCompleted, setPaymentCompleted] = useState(false);

	// For Aloha Pay, require payment to be completed before confirming
	const canProceed = selectedMethod === "aloha-pay"
		? paymentCompleted
		: Boolean(selectedMethod);

	// Get the API key from environment (exposed via Vite)
	const apiKey = import.meta.env.VITE_ALOHA_PAY_API_KEY || "";

	// Determine if the guest's country is supported by Aloha Pay
	const guestCountry = guestInfo?.country;
	const defaultCountry = guestCountry && isAlohaPaCountrySupported(guestCountry)
		? guestCountry as AlohaPayCountry
		: undefined;

	// Handle payment completion
	const handlePaymentComplete = () => {
		setPaymentCompleted(true);
	};

	const paymentOptions = [
		{
			id: "aloha-pay" as const,
			name: t("payment.alohaPay"),
			description: t("payment.alohaPayDesc"),
			icon: Globe,
			badge: t("payment.recommended"),
			benefits: [
				t("payment.benefits.localCurrency"),
				t("payment.benefits.noFees"),
				t("payment.benefits.instant"),
				t("payment.benefits.secure"),
			],
		},
		{
			id: "credit-card" as const,
			name: t("payment.creditCard"),
			description: t("payment.creditCardDesc"),
			icon: CreditCard,
			badge: null,
			comingSoonBadge: t("payment.comingSoon"),
			benefits: [
				t("payment.benefits.allCards"),
				t("payment.benefits.3dSecure"),
				t("payment.benefits.usdPricing"),
			],
			disabled: true,
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-2xl font-light text-zinc-900 mb-2">
					{t("payment.title")}
				</h2>
				<p className="text-zinc-600">
					{t("payment.subtitle")}
				</p>
			</div>

			{/* Payment Options */}
			<div className="space-y-4">
				{paymentOptions.map((option) => {
					const isSelected = selectedMethod === option.id;
					const isDisabled = option.disabled;

					return (
						<Card
							key={option.id}
							className={cn(
								"cursor-pointer transition-all",
								isSelected && "ring-2 ring-resort-ocean ring-offset-2",
								isDisabled && "opacity-50 cursor-not-allowed",
							)}
							onClick={() => !isDisabled && onMethodSelect(option.id)}
						>
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									{/* Selection Indicator */}
									<div
										className={cn(
											"flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5",
											isSelected
												? "bg-resort-ocean border-resort-ocean"
												: "border-zinc-300",
										)}
									>
										{isSelected && <Check className="h-4 w-4 text-white" />}
									</div>

									{/* Content */}
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<option.icon
												className={cn(
													"h-5 w-5",
													isSelected ? "text-resort-ocean" : "text-zinc-500",
												)}
											/>
											<h3 className="font-medium text-zinc-900">{option.name}</h3>
											{option.badge && (
												<Badge className="bg-resort-coral text-white text-xs">
													{option.badge}
												</Badge>
											)}
											{isDisabled && option.comingSoonBadge && (
												<Badge variant="secondary" className="text-xs">
													{option.comingSoonBadge}
												</Badge>
											)}
										</div>
										<p className="text-sm text-zinc-600 mb-3">
											{option.description}
										</p>
										<ul className="space-y-1">
											{option.benefits.map((benefit) => (
												<li
													key={benefit}
													className="flex items-center gap-2 text-sm text-zinc-500"
												>
													<Check className="h-3 w-3 text-resort-palm" />
													{benefit}
												</li>
											))}
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Security Note */}
			<div className="flex items-center gap-3 p-4 bg-resort-sand rounded-lg">
				<Shield className="h-5 w-5 text-resort-ocean flex-shrink-0" />
				<div className="text-sm">
					<p className="font-medium text-zinc-900">{t("payment.securePayment")}</p>
					<p className="text-zinc-600">
						{t("payment.securePaymentDesc")}
					</p>
				</div>
			</div>

			{/* Aloha Pay Embedded Checkout */}
			{selectedMethod === "aloha-pay" && (
				<Card className="bg-resort-ocean-light/10 border-resort-ocean/20">
					<CardContent className="p-6 space-y-6">
						{/* Payment Completed State */}
						{paymentCompleted ? (
							<div className="space-y-4">
								<div className="flex items-center gap-2 text-resort-palm">
									<CheckCircle className="h-5 w-5" />
									<span className="font-medium">{t("payment.paymentCompleted")}</span>
								</div>
								<p className="text-sm text-zinc-600">
									{t("payment.paymentCompletedDesc")}
								</p>
							</div>
						) : (
							<>
								{/* Auto-selected country notice */}
								{defaultCountry && (
									<div className="text-sm text-zinc-600 bg-white/60 rounded-lg p-3">
										{t("payment.countryAutoSelected", { country: guestInfo?.country })}
									</div>
								)}

								{/* Embedded Checkout Widget */}
								<AlohaPayCheckout
									apiKey={apiKey}
									amount={bookingState.totalPrice}
									description={`Coral Cove Resort - ${selectedRoom?.name} (${bookingState.numberOfNights} ${t("bookingSummary.nights")})`}
									locale="es"
									defaultCountry={defaultCountry}
									useSandbox={true}
									customer={guestInfo ? {
										firstName: guestInfo.firstName,
										lastName: guestInfo.lastName,
										email: guestInfo.email,
										phone: guestInfo.phone,
									} : undefined}
									styles={{
										// Ocean teal gradient header (resort-ocean theme)
										headerBackground: "linear-gradient(135deg, #3B9AAD 0%, #2D7A8A 100%)",
										// Dark text for amount display
										amountColor: "#ffffff",
										// Ocean teal button matching the site theme
										buttonColor: "#3B9AAD",
										// White text on button
										buttonTextColor: "#ffffff",
										// Coral accent for links (resort-coral)
										linkColor: "#D97056",
									}}
									onPaymentComplete={handlePaymentComplete}
									onError={(err) => console.error("Payment error:", err)}
								/>
							</>
						)}
					</CardContent>
				</Card>
			)}

			{/* Navigation */}
			<div className="flex items-center justify-between pt-6 border-t border-zinc-200">
				<Button variant="outline" onClick={onBack} disabled={isSubmitting}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t("common.back")}
				</Button>
				<Button
					className={cn(
						"min-w-40",
						canProceed
							? "bg-resort-ocean hover:bg-resort-ocean-dark"
							: "bg-zinc-200 text-zinc-500 cursor-not-allowed",
					)}
					disabled={!canProceed || isSubmitting}
					onClick={onConfirm}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t("checkout.processing")}
						</>
					) : (
						t("checkout.confirmBooking")
					)}
				</Button>
			</div>
		</div>
	);
}
