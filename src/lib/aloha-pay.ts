// Aloha Pay API Configuration and Client

export const ALOHA_PAY_CONFIG = {
	baseUrl: process.env.ALOHA_PAY_API_URL || "https://api-dev.alohapay.co",
	apiKey: process.env.ALOHA_PAY_API_KEY || "",
};

// Supported payer currencies for Aloha Pay (currencies the payer can pay in)
export const PAYER_CURRENCIES = ["ARS", "BRL", "COP", "CLP", "MXN"] as const;
export type PayerCurrency = (typeof PAYER_CURRENCIES)[number];

// Currency info with labels and flags
export const CURRENCY_INFO: Record<PayerCurrency, { label: string; flag: string; country: string }> = {
	ARS: { label: "Peso Argentino", flag: "🇦🇷", country: "Argentina" },
	BRL: { label: "Real Brasileño", flag: "🇧🇷", country: "Brasil" },
	CLP: { label: "Peso Chileno", flag: "🇨🇱", country: "Chile" },
	COP: { label: "Peso Colombiano", flag: "🇨🇴", country: "Colombia" },
	MXN: { label: "Peso Mexicano", flag: "🇲🇽", country: "México" },
};

// Amount type determines how the amount is interpreted
// - "receive": You receive exactly the requested amount in your wallet currency.
//              The payer pays the equivalent in their local currency.
// - "charge": The payer pays exactly the specified amount in their currency.
//             You receive whatever the exchange rate gives you.
export type AmountType = "receive" | "charge";

// Alias for backward compatibility
export type AlohaCurrency = PayerCurrency;

// Demo exchange rates (approximate, for demo purposes only)
export const USD_EXCHANGE_RATES: Record<PayerCurrency, number> = {
	ARS: 875,
	BRL: 5,
	CLP: 880,
	COP: 4000,
	MXN: 17,
};

// Convert USD to local currency (for demo purposes)
export function convertUsdToLocal(usdAmount: number, currency: PayerCurrency): number {
	return Math.round(usdAmount * USD_EXCHANGE_RATES[currency]);
}

// ============ Wallets API ============

export interface Wallet {
	currency: string;
}

export interface GetWalletsResponse {
	success: boolean;
	message: string;
	data: Wallet[];
}

// Get available wallets for the business
export async function getWallets(): Promise<GetWalletsResponse> {
	const url = `${ALOHA_PAY_CONFIG.baseUrl}/api/external/v1/wallets`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"X-API-KEY": ALOHA_PAY_CONFIG.apiKey,
		},
	});

	const responseText = await response.text();

	if (!response.ok) {
		let errorMessage = "Failed to fetch wallets";
		try {
			const errorBody = JSON.parse(responseText);
			errorMessage = errorBody.message || errorMessage;
		} catch {
			errorMessage = `${errorMessage} (Status: ${response.status})`;
		}
		throw new Error(errorMessage);
	}

	return JSON.parse(responseText) as GetWalletsResponse;
}

// ============ Payment Links API ============

// Request payload for creating a payment link
export interface CreatePaymentLinkRequest {
	amount: number;
	currency: string; // Payer's currency
	description: string;
	amount_type?: AmountType;
	webhook_url?: string;
}

// Response from creating a payment link
export interface PaymentLinkData {
	id: string;
	url: string;
	expires_at: string;
}

export interface CreatePaymentLinkResponse {
	success: boolean;
	message: string;
	data: PaymentLinkData;
}

export interface AlohaPayError {
	success: false;
	message: string;
	errors?: Record<string, string[]>;
}

// Create a payment link using Aloha Pay API
export async function createPaymentLink(
	request: CreatePaymentLinkRequest,
): Promise<CreatePaymentLinkResponse> {
	const url = `${ALOHA_PAY_CONFIG.baseUrl}/api/external/v1/payment-links`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"X-API-KEY": ALOHA_PAY_CONFIG.apiKey,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	const responseText = await response.text();

	if (!response.ok) {
		let errorMessage = "Failed to create payment link";
		try {
			const errorBody = JSON.parse(responseText);

			if (errorBody.code === "ORIGIN_NOT_ALLOWED") {
				errorMessage = "Origin not allowed. Please configure the API key correctly.";
			} else if (errorBody.message) {
				errorMessage = errorBody.message;
			} else if (errorBody.error) {
				errorMessage = errorBody.error;
			}

			if (errorBody.errors) {
				const errorDetails = Object.entries(errorBody.errors)
					.map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
					.join("; ");
				errorMessage = `${errorMessage} - ${errorDetails}`;
			}
		} catch {
			errorMessage = `${errorMessage} (Status: ${response.status})`;
		}
		throw new Error(errorMessage);
	}

	return JSON.parse(responseText) as CreatePaymentLinkResponse;
}
