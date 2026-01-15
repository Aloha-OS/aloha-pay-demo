import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WizardProgress } from "@/components/hotel/checkout/WizardProgress";
import { DateSelection } from "@/components/hotel/checkout/DateSelection";
import { RoomSelection } from "@/components/hotel/checkout/RoomSelection";
import { GuestInfoForm } from "@/components/hotel/checkout/GuestInfoForm";
import { PaymentMethod } from "@/components/hotel/checkout/PaymentMethod";
import { BookingSummary } from "@/components/hotel/BookingSummary";
import { useBookingWizard } from "@/hooks/useBookingWizard";
import { formatDateRange } from "@/lib/hotel/date-utils";
import { formatPrice } from "@/lib/hotel/price-utils";
import type { Booking, ApiResponse, GuestInfo } from "@/types/hotel";

export const Route = createFileRoute("/checkout")({
	component: CheckoutPage,
	validateSearch: (search: Record<string, unknown>) => ({
		step: (search.step as number) || 1,
		roomId: (search.roomId as string) || undefined,
		checkIn: (search.checkIn as string) || undefined,
		checkOut: (search.checkOut as string) || undefined,
	}),
	head: () => ({
		meta: [
			{ title: "Reserva tu Estadía - Coral Cove Resort" },
			{
				name: "description",
				content: "Completa tu reservación en Coral Cove Resort.",
			},
		],
	}),
});

function CheckoutPage() {
	const { t } = useTranslation();
	const navigate = useNavigate({ from: "/checkout" });
	const search = Route.useSearch();

	const { state, actions, selectedRoom, canProceed } = useBookingWizard(
		search.roomId,
	);

	const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

	// Sync URL params to state on mount
	useEffect(() => {
		if (search.checkIn && search.checkOut) {
			actions.setDates(search.checkIn, search.checkOut);
		}
		if (search.roomId && !state.selectedRoomId) {
			actions.selectRoom(search.roomId);
		}
		if (search.step && search.step !== state.step) {
			actions.goToStep(search.step as 1 | 2 | 3 | 4);
		}
	}, []);

	// Sync state changes to URL
	const updateUrl = (updates: Record<string, unknown>) => {
		navigate({
			search: (prev) => ({
				...prev,
				...updates,
			}),
			replace: true,
		});
	};

	// Booking mutation
	const bookingMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/bookings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					roomId: state.selectedRoomId,
					checkIn: state.checkInDate,
					checkOut: state.checkOutDate,
					guestInfo: state.guestInfo,
					paymentMethod: state.paymentMethod,
				}),
			});
			return res.json() as Promise<ApiResponse<Booking>>;
		},
		onSuccess: (data) => {
			if (data.success && data.data) {
				setConfirmedBooking(data.data);
			}
		},
	});

	// Step handlers
	const handleDatesChange = (checkIn: string, checkOut: string) => {
		actions.setDates(checkIn, checkOut);
		updateUrl({ checkIn, checkOut });
	};

	const handleRoomSelect = (roomId: string) => {
		actions.selectRoom(roomId);
		updateUrl({ roomId });
	};

	const handleGuestInfoSubmit = (info: GuestInfo) => {
		actions.setGuestInfo(info);
		actions.nextStep();
		updateUrl({ step: 4 });
	};

	const handleConfirmBooking = () => {
		bookingMutation.mutate();
	};

	const goToStep = (step: 1 | 2 | 3 | 4) => {
		actions.goToStep(step);
		updateUrl({ step });
	};

	const nextStep = () => {
		const next = Math.min(state.step + 1, 4) as 1 | 2 | 3 | 4;
		actions.nextStep();
		updateUrl({ step: next });
	};

	const prevStep = () => {
		const prev = Math.max(state.step - 1, 1) as 1 | 2 | 3 | 4;
		actions.prevStep();
		updateUrl({ step: prev });
	};

	// Calculate completed steps
	const completedSteps: number[] = [];
	if (canProceed.step1) completedSteps.push(1);
	if (canProceed.step2) completedSteps.push(2);
	if (canProceed.step3) completedSteps.push(3);
	if (canProceed.step4) completedSteps.push(4);

	// Show confirmation if booking is complete
	if (confirmedBooking) {
		return (
			<div className="min-h-screen bg-resort-sand">
				<div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
					<Card>
						<CardContent className="p-8 text-center">
							<div className="w-16 h-16 rounded-full bg-resort-palm/10 flex items-center justify-center mx-auto mb-6">
								<CheckCircle className="h-8 w-8 text-resort-palm" />
							</div>
							<h1 className="text-2xl font-medium text-zinc-900 mb-2">
								{t("confirmation.title", "¡Reservación Confirmada!")}
							</h1>
							<p className="text-zinc-600 mb-6">
								{t("confirmation.message", "Gracias por tu reservación. Se ha enviado un correo de confirmación a")} {confirmedBooking.guestInfo.email}.
							</p>

							<div className="bg-zinc-50 rounded-lg p-6 text-left mb-6">
								<h3 className="font-medium text-zinc-900 mb-4">
									{t("confirmation.details", "Detalles de la Reservación")}
								</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("confirmation.bookingId", "ID de Reservación")}</span>
										<span className="font-mono text-zinc-900">
											{confirmedBooking.id.slice(0, 15)}...
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("bookingSummary.room", "Habitación")}</span>
										<span className="text-zinc-900">{selectedRoom?.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("bookingSummary.dates", "Fechas")}</span>
										<span className="text-zinc-900">
											{formatDateRange(
												confirmedBooking.checkIn,
												confirmedBooking.checkOut,
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("confirmation.guest", "Huésped")}</span>
										<span className="text-zinc-900">
											{confirmedBooking.guestInfo.firstName}{" "}
											{confirmedBooking.guestInfo.lastName}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-600">{t("payment.title", "Método de Pago")}</span>
										<span className="text-zinc-900">Aloha Pay</span>
									</div>
									<div className="flex justify-between font-medium pt-2 border-t">
										<span className="text-zinc-900">{t("common.total", "Total")}</span>
										<span className="text-resort-ocean">
											{formatPrice(confirmedBooking.totalPrice)}
										</span>
									</div>
								</div>
							</div>

							<div className="p-4 bg-resort-ocean-light/20 rounded-lg mb-6">
								<p className="text-sm text-zinc-700">
									<strong>{t("confirmation.nextStep", "Siguiente paso")}:</strong> {t("confirmation.redirectMessage", "Serás redirigido a Aloha Pay para completar tu pago. En una integración real, esto sucedería automáticamente.")}
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 justify-center">
								<Button
									variant="outline"
									onClick={() => {
										setConfirmedBooking(null);
										actions.reset();
										navigate({ to: "/" });
									}}
								>
									{t("confirmation.returnHome", "Volver al Inicio")}
								</Button>
								<Button
									className="bg-resort-ocean hover:bg-resort-ocean-dark"
									onClick={() => {
										setConfirmedBooking(null);
										actions.reset();
										updateUrl({ step: 1, roomId: undefined, checkIn: undefined, checkOut: undefined });
									}}
								>
									{t("confirmation.anotherBooking", "Hacer Otra Reservación")}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-resort-sand">
			<div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
				{/* Progress */}
				<div className="mb-8">
					<WizardProgress
						currentStep={state.step}
						completedSteps={completedSteps}
						onStepClick={goToStep}
					/>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Step Content */}
					<div className="lg:col-span-2">
						<Card>
							<CardContent className="p-6 md:p-8">
								{state.step === 1 && (
									<DateSelection
										checkIn={state.checkInDate}
										checkOut={state.checkOutDate}
										numberOfGuests={state.numberOfGuests}
										onDatesChange={handleDatesChange}
										onGuestsChange={actions.setGuests}
										onNext={nextStep}
									/>
								)}

								{state.step === 2 && state.checkInDate && state.checkOutDate && (
									<RoomSelection
										checkIn={state.checkInDate}
										checkOut={state.checkOutDate}
										numberOfGuests={state.numberOfGuests}
										selectedRoomId={state.selectedRoomId}
										onRoomSelect={handleRoomSelect}
										onNext={nextStep}
										onBack={prevStep}
									/>
								)}

								{state.step === 3 && (
									<GuestInfoForm
										initialValues={state.guestInfo ?? undefined}
										onSubmit={handleGuestInfoSubmit}
										onBack={prevStep}
									/>
								)}

								{state.step === 4 && (
									<PaymentMethod
										selectedMethod={state.paymentMethod}
										onMethodSelect={actions.setPaymentMethod}
										onConfirm={handleConfirmBooking}
										onBack={prevStep}
										bookingState={state}
										selectedRoom={selectedRoom}
										guestInfo={state.guestInfo}
										isSubmitting={bookingMutation.isPending}
									/>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Sidebar - Booking Summary */}
					<div className="lg:col-span-1">
						<BookingSummary
							room={selectedRoom ?? null}
							checkIn={state.checkInDate}
							checkOut={state.checkOutDate}
							numberOfNights={state.numberOfNights}
							numberOfGuests={state.numberOfGuests}
							totalPrice={state.totalPrice}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
