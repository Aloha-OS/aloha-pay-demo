import { createFileRoute } from "@tanstack/react-router";
import {
	createPaymentLink,
	type CreatePaymentLinkRequest,
	type AlohaPayError,
} from "@/lib/aloha-pay";

export const Route = createFileRoute("/api/payment-links")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = (await request.json()) as CreatePaymentLinkRequest;

					// Validate required fields
					if (!body.amount || body.amount <= 0) {
						return Response.json(
							{
								success: false,
								message: "Amount is required and must be greater than 0",
							} as AlohaPayError,
							{ status: 400 },
						);
					}

					if (!body.currency) {
						return Response.json(
							{
								success: false,
								message: "Currency is required",
							} as AlohaPayError,
							{ status: 400 },
						);
					}

					if (!body.description) {
						return Response.json(
							{
								success: false,
								message: "Description is required",
							} as AlohaPayError,
							{ status: 400 },
						);
					}

					// Create payment link via Aloha Pay API
					const result = await createPaymentLink(body);

					return Response.json(result, { status: 201 });
				} catch (error) {
					console.error("Error creating payment link:", error);

					return Response.json(
						{
							success: false,
							message:
								error instanceof Error
									? error.message
									: "Failed to create payment link",
						} as AlohaPayError,
						{ status: 500 },
					);
				}
			},
		},
	},
});
