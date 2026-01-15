import { createFileRoute } from "@tanstack/react-router";
import { getWallets } from "@/lib/aloha-pay";

export const Route = createFileRoute("/api/wallets")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const result = await getWallets();
					return Response.json(result, { status: 200 });
				} catch (error) {
					console.error("Error fetching wallets:", error);
					return Response.json(
						{
							success: false,
							message:
								error instanceof Error
									? error.message
									: "Failed to fetch wallets",
						},
						{ status: 500 },
					);
				}
			},
		},
	},
});
