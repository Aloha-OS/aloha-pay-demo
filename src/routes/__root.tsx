import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import { HotelHeader } from "@/components/hotel/HotelHeader";
import { HotelFooter } from "@/components/hotel/HotelFooter";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

// Initialize i18n
import "@/lib/i18n";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Coral Cove Resort - Tu Paraíso Tropical Te Espera",
			},
			{
				name: "description",
				content:
					"Experimenta el lujo frente al mar en Coral Cove Resort. Reserva tu escapada tropical hoy.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootComponent,
	shellComponent: RootDocument,
});

function RootComponent() {
	return (
		<div className="min-h-screen flex flex-col bg-white">
			<HotelHeader />
			<main className="flex-1">
				<Outlet />
			</main>
			<HotelFooter />
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
