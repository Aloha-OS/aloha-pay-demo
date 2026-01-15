import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Check, CreditCard, Globe, Shield, Loader2, ExternalLink, Copy, CheckCircle } from "lucide-react";
import type { BookingState, Room } from "@/types/hotel";
import { type AlohaCurrency, type CreatePaymentLinkResponse, convertUsdToLocal, USD_EXCHANGE_RATES } from "@/lib/aloha-pay";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/hotel/price-utils";

// Format local currency amount
function formatLocalCurrency(amount: number, currency: AlohaCurrency): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

interface PaymentMethodProps {
	selectedMethod: "aloha-pay" | "credit-card" | null;
	onMethodSelect: (method: "aloha-pay" | "credit-card") => void;
	onConfirm: () => void;
	onBack: () => void;
	bookingState: BookingState;
	selectedRoom: Room | undefined;
	isSubmitting?: boolean;
}

const CURRENCY_OPTIONS: { value: AlohaCurrency; labelKey: string; flag: string }[] = [
	{ value: "ARS", labelKey: "currencies.ARS", flag: "🇦🇷" },
	{ value: "BRL", labelKey: "currencies.BRL", flag: "🇧🇷" },
	{ value: "CLP", labelKey: "currencies.CLP", flag: "🇨🇱" },
	{ value: "COP", labelKey: "currencies.COP", flag: "🇨🇴" },
	{ value: "MXN", labelKey: "currencies.MXN", flag: "🇲🇽" },
];

export function PaymentMethod({
	selectedMethod,
	onMethodSelect,
	onConfirm,
	onBack,
	bookingState,
	selectedRoom,
	isSubmitting = false,
}: PaymentMethodProps) {
	const { t } = useTranslation();
	const [selectedCurrency, setSelectedCurrency] = useState<AlohaCurrency | "">("");
	const [paymentLink, setPaymentLink] = useState<CreatePaymentLinkResponse["data"] | null>(null);
	const [copied, setCopied] = useState(false);

	const canProceed = Boolean(selectedMethod);

	// Calculate converted amount when currency is selected
	const convertedAmount = selectedCurrency
		? convertUsdToLocal(bookingState.totalPrice, selectedCurrency)
		: 0;

	// Mutation to create payment link
	const createPaymentMutation = useMutation({
		mutationFn: async () => {
			if (!selectedCurrency || !selectedRoom) {
				throw new Error("Please select a currency");
			}

			const amountInLocalCurrency = convertUsdToLocal(bookingState.totalPrice, selectedCurrency);

			const response = await fetch("/api/payment-links", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					amount: amountInLocalCurrency,
					currency: selectedCurrency,
					description: `Coral Cove Resort - ${selectedRoom.name} (${bookingState.numberOfNights} nights)`,
					amount_type: "receive",
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create payment link");
			}

			return response.json() as Promise<CreatePaymentLinkResponse>;
		},
		onSuccess: (data) => {
			setPaymentLink(data.data);
		},
	});

	const handleCopyLink = async () => {
		if (paymentLink?.url) {
			await navigator.clipboard.writeText(paymentLink.url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
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

			{/* Aloha Pay Integration */}
			{selectedMethod === "aloha-pay" && (
				<Card className="bg-resort-ocean-light/10 border-resort-ocean/20">
					<CardContent className="p-6 space-y-6">
						<div>
							<h4 className="font-medium text-zinc-900 mb-2">
								{t("payment.createPaymentRequest")}
							</h4>
							<p className="text-sm text-zinc-600">
								{t("payment.createPaymentRequestDesc")}
							</p>
						</div>

						{/* Booking Summary */}
						<div className="bg-white/60 rounded-lg p-4 space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-zinc-600">{t("bookingSummary.room")}</span>
								<span className="font-medium text-zinc-900">{selectedRoom?.name}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-zinc-600">{t("bookingSummary.nights")}</span>
								<span className="font-medium text-zinc-900">{bookingState.numberOfNights}</span>
							</div>
							<div className="flex justify-between text-sm pt-2 border-t">
								<span className="text-zinc-600">{t("payment.totalUsd")}</span>
								<span className="font-medium text-zinc-900">{formatPrice(bookingState.totalPrice)}</span>
							</div>
							{selectedCurrency && (
								<div className="flex justify-between text-sm font-medium">
									<span className="text-zinc-900">{t("payment.totalLocal", { currency: selectedCurrency })}</span>
									<span className="text-resort-ocean text-lg">
										{formatLocalCurrency(convertedAmount, selectedCurrency)}
									</span>
								</div>
							)}
						</div>

						{/* Exchange Rate Note */}
						{selectedCurrency && (
							<p className="text-xs text-zinc-500">
								* {t("payment.exchangeRate", { rate: USD_EXCHANGE_RATES[selectedCurrency].toLocaleString(), currency: selectedCurrency })}
							</p>
						)}

						{/* Currency Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-zinc-900">
								{t("payment.selectCurrency")}
							</label>
							<Select
								value={selectedCurrency}
								onValueChange={(value) => setSelectedCurrency(value as AlohaCurrency)}
								disabled={createPaymentMutation.isPending || !!paymentLink}
							>
								<SelectTrigger className="w-full bg-white">
									<SelectValue placeholder={t("payment.chooseCurrency")} />
								</SelectTrigger>
								<SelectContent>
									{CURRENCY_OPTIONS.map((currency) => (
										<SelectItem key={currency.value} value={currency.value}>
											<span className="flex items-center gap-2">
												<span>{currency.flag}</span>
												<span>{currency.value}</span>
												<span className="text-zinc-500">- {t(currency.labelKey)}</span>
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Create Payment Link Button */}
						{!paymentLink && (
							<Button
								className="w-full bg-resort-ocean hover:bg-resort-ocean-dark"
								onClick={() => createPaymentMutation.mutate()}
								disabled={!selectedCurrency || createPaymentMutation.isPending}
							>
								{createPaymentMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{t("payment.creatingLink")}
									</>
								) : (
									<>
										<Globe className="mr-2 h-4 w-4" />
										{t("payment.createPaymentLink")}
									</>
								)}
							</Button>
						)}

						{/* Error Message */}
						{createPaymentMutation.isError && (
							<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-700">
									{createPaymentMutation.error instanceof Error
										? createPaymentMutation.error.message
										: "Failed to create payment link"}
								</p>
							</div>
						)}

						{/* Payment Link Success */}
						{paymentLink && (
							<div className="space-y-4">
								<div className="flex items-center gap-2 text-resort-palm">
									<CheckCircle className="h-5 w-5" />
									<span className="font-medium">{t("payment.linkCreated")}</span>
								</div>

								<div className="bg-white rounded-lg p-4 space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-zinc-600">{t("payment.paymentId")}</span>
										<code className="text-xs bg-zinc-100 px-2 py-1 rounded">
											{paymentLink.id.slice(0, 8)}...
										</code>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-zinc-600">{t("payment.expires")}</span>
										<span className="text-sm text-zinc-900">
											{new Date(paymentLink.expires_at).toLocaleString()}
										</span>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										className="flex-1"
										onClick={handleCopyLink}
									>
										{copied ? (
											<>
												<Check className="mr-2 h-4 w-4" />
												{t("payment.copied")}
											</>
										) : (
											<>
												<Copy className="mr-2 h-4 w-4" />
												{t("payment.copyLink")}
											</>
										)}
									</Button>
									<Button
										className="flex-1 bg-resort-ocean hover:bg-resort-ocean-dark"
										onClick={() => window.open(paymentLink.url, "_blank")}
									>
										<ExternalLink className="mr-2 h-4 w-4" />
										{t("payment.openPaymentPage")}
									</Button>
								</div>

								<p className="text-xs text-center text-zinc-500">
									{t("payment.openPaymentPageHint")}
								</p>
							</div>
						)}

						<div className="flex items-center gap-2 pt-2">
							<Globe className="h-4 w-4 text-resort-ocean" />
							<span className="text-sm text-resort-ocean font-medium">
								{t("common.poweredBy")} Aloha Pay
							</span>
						</div>
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
