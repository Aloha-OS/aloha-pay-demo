import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

// Supported countries for Aloha Pay
export const ALOHA_PAY_SUPPORTED_COUNTRIES = ["AR", "BR", "CL", "CO", "MX"] as const;
export type AlohaPayCountry = (typeof ALOHA_PAY_SUPPORTED_COUNTRIES)[number];

// Check if a country code is supported by Aloha Pay
export function isAlohaPaCountrySupported(countryCode: string): countryCode is AlohaPayCountry {
	return ALOHA_PAY_SUPPORTED_COUNTRIES.includes(countryCode as AlohaPayCountry);
}

// Customer data for prefilling the checkout form
interface CustomerData {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
}

// Custom styles for the checkout widget
interface CheckoutStyles {
	headerBackground?: string;
	amountColor?: string;
	buttonColor?: string;
	buttonTextColor?: string;
	linkColor?: string;
	maxWidth?: string;
}

// Props for the AlohaPayCheckout component
interface AlohaPayCheckoutProps {
	apiKey: string;
	amount: number;
	description?: string;
	locale?: "en" | "es" | "pt";
	defaultCountry?: AlohaPayCountry;
	useSandbox?: boolean;
	customer?: CustomerData;
	styles?: CheckoutStyles;
	onReady?: () => void;
	onError?: (error: Error) => void;
	onPaymentLinkCreated?: (data: { id: string; url: string }) => void;
	onPaymentComplete?: () => void;
	className?: string;
}

// Declare the global AlohaPay object
declare global {
	interface Window {
		AlohaPay?: {
			create: (config: {
				apiKey: string;
				container: string;
				amount: number;
				description?: string;
				locale?: string;
				defaultCountry?: string;
				useSandbox?: boolean;
				customer?: CustomerData;
				styles?: CheckoutStyles;
				onReady?: () => void;
				onError?: (error: Error) => void;
				onPaymentLinkCreated?: (data: { id: string; url: string }) => void;
				onPaymentComplete?: () => void;
			}) => void;
		};
	}
}

const ALOHA_PAY_SDK_URL = "https://cdn.alohapay.co/v1/aloha-pay.umd.js";

export function AlohaPayCheckout({
	apiKey,
	amount,
	description,
	locale = "es",
	defaultCountry,
	useSandbox = false,
	customer,
	styles,
	onReady,
	onError,
	onPaymentLinkCreated,
	onPaymentComplete,
	className,
}: AlohaPayCheckoutProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const initializationAttempted = useRef(false);

	// Load the Aloha Pay SDK script
	const loadScript = useCallback((): Promise<void> => {
		return new Promise((resolve, reject) => {
			// Check if script is already loaded
			if (window.AlohaPay) {
				resolve();
				return;
			}

			// Check if script is already in the DOM
			const existingScript = document.querySelector(`script[src="${ALOHA_PAY_SDK_URL}"]`);
			if (existingScript) {
				// Wait for it to load
				existingScript.addEventListener("load", () => resolve());
				existingScript.addEventListener("error", () => reject(new Error("Failed to load Aloha Pay SDK")));
				return;
			}

			// Create and append the script
			const script = document.createElement("script");
			script.src = ALOHA_PAY_SDK_URL;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error("Failed to load Aloha Pay SDK"));
			document.head.appendChild(script);
		});
	}, []);

	// Initialize the checkout widget
	const initializeCheckout = useCallback(() => {
		if (!window.AlohaPay || !containerRef.current || initializationAttempted.current) {
			return;
		}

		initializationAttempted.current = true;

		try {
			window.AlohaPay.create({
				apiKey,
				container: `#${containerRef.current.id}`,
				amount,
				description,
				locale,
				defaultCountry,
				useSandbox,
				customer,
				styles,
				onReady: () => {
					setIsLoading(false);
					onReady?.();
				},
				onError: (err: Error) => {
					setIsLoading(false);
					setError(err.message || "An error occurred with the payment widget");
					onError?.(err);
				},
				onPaymentLinkCreated,
				onPaymentComplete,
			});
		} catch (err) {
			setIsLoading(false);
			const errorMessage = err instanceof Error ? err.message : "Failed to initialize checkout";
			setError(errorMessage);
			onError?.(new Error(errorMessage));
		}
	}, [
		apiKey,
		amount,
		description,
		locale,
		defaultCountry,
		useSandbox,
		customer,
		styles,
		onReady,
		onError,
		onPaymentLinkCreated,
		onPaymentComplete,
	]);

	useEffect(() => {
		let mounted = true;

		const setup = async () => {
			try {
				await loadScript();
				if (mounted) {
					initializeCheckout();
				}
			} catch (err) {
				if (mounted) {
					setIsLoading(false);
					const errorMessage = err instanceof Error ? err.message : "Failed to load payment SDK";
					setError(errorMessage);
					onError?.(new Error(errorMessage));
				}
			}
		};

		setup();

		return () => {
			mounted = false;
		};
	}, [loadScript, initializeCheckout, onError]);

	// Generate a unique ID for the container
	const containerId = useRef(`aloha-checkout-${Math.random().toString(36).slice(2, 9)}`);

	if (error) {
		return (
			<div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className || ""}`}>
				<p className="text-sm text-red-700">{error}</p>
			</div>
		);
	}

	return (
		<div className={className}>
			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
					<span className="ml-2 text-sm text-zinc-600">Loading payment widget...</span>
				</div>
			)}
			<div
				id={containerId.current}
				ref={containerRef}
				className={isLoading ? "hidden" : ""}
			/>
		</div>
	);
}
