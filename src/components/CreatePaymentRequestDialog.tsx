import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, Copy, ExternalLink, Check, Globe } from "lucide-react";
import {
	PAYER_CURRENCIES,
	CURRENCY_INFO,
	type PayerCurrency,
	type AmountType,
	type GetWalletsResponse,
	type CreatePaymentLinkResponse,
} from "@/lib/aloha-pay";
import { cn } from "@/lib/utils";

interface CreatePaymentRequestDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreatePaymentRequestDialog({
	open,
	onOpenChange,
}: CreatePaymentRequestDialogProps) {
	const { t } = useTranslation();

	// Form state
	const [payerCurrency, setPayerCurrency] = useState<PayerCurrency | "">("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [amountType, setAmountType] = useState<AmountType>("charge");

	// Result state
	const [paymentLink, setPaymentLink] = useState<CreatePaymentLinkResponse["data"] | null>(null);
	const [copied, setCopied] = useState(false);

	// Fetch wallets to know what currencies the business can receive
	const walletsQuery = useQuery({
		queryKey: ["wallets"],
		queryFn: async () => {
			const res = await fetch("/api/wallets");
			if (!res.ok) throw new Error("Failed to fetch wallets");
			return res.json() as Promise<GetWalletsResponse>;
		},
		enabled: open,
	});

	const wallets = walletsQuery.data?.data ?? [];
	const walletCurrency = wallets[0]?.currency ?? "";

	// Visual currency display: shows wallet currency for "receive", payer currency for "charge"
	const displayCurrency = amountType === "receive" ? walletCurrency : payerCurrency;

	// Create payment link mutation
	const createMutation = useMutation({
		mutationFn: async () => {
			if (!payerCurrency || !amount || !description) {
				throw new Error("Please fill all required fields");
			}

			const response = await fetch("/api/payment-links", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					amount: Number.parseFloat(amount),
					currency: payerCurrency, // Always the payer's currency
					description,
					amount_type: amountType,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create payment request");
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

	const handleReset = () => {
		setPayerCurrency("");
		setAmount("");
		setDescription("");
		setAmountType("charge");
		setPaymentLink(null);
		createMutation.reset();
	};

	const handleClose = () => {
		handleReset();
		onOpenChange(false);
	};

	const isFormValid = payerCurrency && amount && Number.parseFloat(amount) > 0 && description;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Globe className="h-5 w-5 text-resort-ocean" />
						Crear Solicitud de Pago
					</DialogTitle>
					<DialogDescription>
						Crea un link de pago para que tu cliente pueda pagar en su moneda local.
					</DialogDescription>
				</DialogHeader>

				{/* Success State */}
				{paymentLink ? (
					<div className="space-y-6 py-4">
						<div className="flex items-center gap-2 text-resort-palm">
							<CheckCircle className="h-5 w-5" />
							<span className="font-medium">¡Solicitud de pago creada!</span>
						</div>

						<div className="bg-zinc-50 rounded-lg p-4 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-600">ID</span>
								<code className="text-xs bg-zinc-200 px-2 py-1 rounded">
									{paymentLink.id.slice(0, 12)}...
								</code>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-600">Expira</span>
								<span className="text-sm text-zinc-900">
									{new Date(paymentLink.expires_at).toLocaleString()}
								</span>
							</div>
						</div>

						<div className="flex gap-2">
							<Button variant="outline" className="flex-1" onClick={handleCopyLink}>
								{copied ? (
									<>
										<Check className="mr-2 h-4 w-4" />
										¡Copiado!
									</>
								) : (
									<>
										<Copy className="mr-2 h-4 w-4" />
										Copiar Link
									</>
								)}
							</Button>
							<Button
								className="flex-1 bg-resort-ocean hover:bg-resort-ocean-dark"
								onClick={() => window.open(paymentLink.url, "_blank")}
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								Abrir Checkout
							</Button>
						</div>

						<Button variant="outline" className="w-full" onClick={handleReset}>
							Crear otra solicitud
						</Button>
					</div>
				) : (
					<div className="space-y-6 py-4">
						{/* Payer Currency Selection */}
						<div className="space-y-2">
							<Label>Moneda del pagador</Label>
							<Select
								value={payerCurrency}
								onValueChange={(v) => setPayerCurrency(v as PayerCurrency)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona la moneda del cliente" />
								</SelectTrigger>
								<SelectContent>
									{PAYER_CURRENCIES.map((currency) => {
										const info = CURRENCY_INFO[currency];
										return (
											<SelectItem key={currency} value={currency}>
												<span className="flex items-center gap-2">
													<span>{info.flag}</span>
													<span>{currency}</span>
													<span className="text-zinc-500">- {info.label}</span>
												</span>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
							<p className="text-xs text-zinc-500">
								La moneda en la que tu cliente realizará el pago
							</p>
						</div>

						{/* Amount */}
						<div className="space-y-2">
							<Label htmlFor="amount">Monto</Label>
							<div className="relative">
								<Input
									id="amount"
									type="number"
									min="0"
									step="0.01"
									placeholder="0.00"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="pr-16"
								/>
								{displayCurrency && (
									<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
										{displayCurrency}
									</span>
								)}
							</div>
						</div>

						{/* Amount Type */}
						<div className="space-y-3">
							<Label>Tipo de monto</Label>
							<div className="grid gap-3">
								<Card
									className={cn(
										"cursor-pointer transition-all",
										amountType === "charge" && "ring-2 ring-resort-ocean",
									)}
									onClick={() => setAmountType("charge")}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											<div
												className={cn(
													"w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center",
													amountType === "charge"
														? "bg-resort-ocean border-resort-ocean"
														: "border-zinc-300",
												)}
											>
												{amountType === "charge" && (
													<Check className="h-3 w-3 text-white" />
												)}
											</div>
											<div>
												<p className="font-medium text-sm">
													El cliente paga el monto exacto
												</p>
												<p className="text-xs text-zinc-500 mt-1">
													Tu cliente paga exactamente {amount || "X"} {payerCurrency || "..."}.
													Tú recibes el equivalente en {walletCurrency || "tu billetera"}.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card
									className={cn(
										"cursor-pointer transition-all",
										amountType === "receive" && "ring-2 ring-resort-ocean",
									)}
									onClick={() => setAmountType("receive")}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											<div
												className={cn(
													"w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center",
													amountType === "receive"
														? "bg-resort-ocean border-resort-ocean"
														: "border-zinc-300",
												)}
											>
												{amountType === "receive" && (
													<Check className="h-3 w-3 text-white" />
												)}
											</div>
											<div>
												<p className="font-medium text-sm">
													Yo recibo el monto exacto
												</p>
												<p className="text-xs text-zinc-500 mt-1">
													Tú recibes exactamente {amount || "X"} {walletCurrency || "en tu billetera"}.
													El cliente paga el equivalente en {payerCurrency || "su moneda"}.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Descripción</Label>
							<Input
								id="description"
								placeholder="Ej: Reserva habitación - 2 noches"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								maxLength={255}
							/>
							<p className="text-xs text-zinc-500">
								{description.length}/255 caracteres
							</p>
						</div>

						{/* Wallets Info */}
						{wallets.length > 0 && (
							<div className="bg-zinc-50 rounded-lg p-3">
								<p className="text-xs text-zinc-600">
									<span className="font-medium">Tus billeteras:</span>{" "}
									{wallets.map((w) => w.currency).join(", ")}
								</p>
							</div>
						)}

						{/* Error Message */}
						{createMutation.isError && (
							<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-700">
									{createMutation.error instanceof Error
										? createMutation.error.message
										: "Error al crear la solicitud"}
								</p>
							</div>
						)}

						{/* Actions */}
						<div className="flex gap-3 pt-2">
							<Button variant="outline" onClick={handleClose} className="flex-1">
								Cancelar
							</Button>
							<Button
								className="flex-1 bg-resort-ocean hover:bg-resort-ocean-dark"
								onClick={() => createMutation.mutate()}
								disabled={!isFormValid || createMutation.isPending}
							>
								{createMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creando...
									</>
								) : (
									"Crear Solicitud"
								)}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
