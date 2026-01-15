import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Waves,
	Sun,
	Utensils,
	Sparkles,
	ArrowRight,
	Users,
	Bed,
} from "lucide-react";
import type { Room, ApiResponse } from "@/types/hotel";
import { formatPrice } from "@/lib/hotel/price-utils";

export const Route = createFileRoute("/")({
	component: HotelLandingPage,
	head: () => ({
		meta: [
			{ title: "Coral Cove Resort - Tu Paraíso Tropical Te Espera" },
			{
				name: "description",
				content:
					"Experimenta el lujo frente al mar en Coral Cove Resort. Reserva tu escapada tropical hoy.",
			},
		],
	}),
});

function HotelLandingPage() {
	const { t } = useTranslation();

	const { data: roomsData, isLoading } = useQuery({
		queryKey: ["rooms", "featured"],
		queryFn: async () => {
			const res = await fetch("/api/rooms?featured=true");
			return res.json() as Promise<ApiResponse<Room[]>>;
		},
	});

	const featuredRooms = roomsData?.data?.slice(0, 3) ?? [];

	return (
		<div>
			{/* Hero Section */}
			<section className="relative h-[80vh] min-h-[600px] flex items-center">
				{/* Background Image */}
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80')",
					}}
				>
					<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
				</div>

				{/* Content */}
				<div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
					<div className="max-w-2xl">
						<Badge className="bg-resort-ocean/90 text-white mb-6 text-sm px-4 py-1">
							Resort de Playa & Spa
						</Badge>
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-6">
							Tu Paraíso
							<br />
							<span className="font-medium">Tropical Te Espera</span>
						</h1>
						<p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-lg">
							Experimenta la combinación perfecta de lujo y belleza natural en Coral
							Cove Resort. Donde cada atardecer cuenta una historia.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Link to="/rooms">
								<Button
									size="lg"
									className="bg-resort-ocean hover:bg-resort-ocean-dark text-white px-8"
								>
									{t("hero.exploreRooms")}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							<Link to="/checkout" search={{ step: 1 }}>
								<Button
									size="lg"
									variant="outline"
									className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 px-8"
								>
									{t("common.bookNow")}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-resort-sand">
				<div className="max-w-7xl mx-auto px-4 md:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-light text-zinc-900 mb-4">
							Lo Mejor del Resort
						</h2>
						<p className="text-zinc-600 max-w-2xl mx-auto">
							Descubre las amenidades que hacen de Coral Cove el destino perfecto
							para tu próxima escapada.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								icon: Waves,
								title: "Playa Privada",
								description: "Acceso exclusivo a playas de arena blanca prístina",
							},
							{
								icon: Sun,
								title: "Piscina Infinita",
								description: "Impresionante piscina frente al mar con bar acuático",
							},
							{
								icon: Utensils,
								title: "Alta Cocina",
								description: "Restaurantes de clase mundial y cocina local",
							},
							{
								icon: Sparkles,
								title: "Spa & Bienestar",
								description: "Tratamientos rejuvenecedores y clases de yoga",
							},
						].map((feature) => (
							<div
								key={feature.title}
								className="text-center p-6 rounded-2xl bg-white shadow-sm"
							>
								<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-resort-ocean-light/30 mb-4">
									<feature.icon className="h-7 w-7 text-resort-ocean" />
								</div>
								<h3 className="text-lg font-medium text-zinc-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-sm text-zinc-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Rooms Section */}
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 md:px-8">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
						<div>
							<h2 className="text-3xl md:text-4xl font-light text-zinc-900 mb-4">
								Alojamientos Destacados
							</h2>
							<p className="text-zinc-600 max-w-xl">
								Desde acogedores retiros con jardín hasta amplias suites frente al mar,
								encuentra tu hogar perfecto lejos de casa.
							</p>
						</div>
						<Link to="/rooms" className="mt-4 md:mt-0">
							<Button variant="outline" className="group">
								Ver Todas las Habitaciones
								<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[1, 2, 3].map((i) => (
								<Card key={i} className="overflow-hidden animate-pulse">
									<div className="aspect-[4/3] bg-zinc-200" />
									<CardContent className="p-6">
										<div className="h-6 bg-zinc-200 rounded mb-2 w-3/4" />
										<div className="h-4 bg-zinc-200 rounded mb-4 w-full" />
										<div className="h-8 bg-zinc-200 rounded w-1/3" />
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{featuredRooms.map((room) => (
								<Link key={room.id} to="/rooms/$roomId" params={{ roomId: room.slug }}>
									<Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
										<div className="aspect-[4/3] overflow-hidden">
											<img
												src={room.images[0]?.url}
												alt={room.images[0]?.alt}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										</div>
										<CardContent className="p-6">
											<div className="flex items-center gap-2 mb-2">
												<Badge variant="secondary" className="text-xs">
													{room.type.replace("-", " ")}
												</Badge>
											</div>
											<h3 className="text-xl font-medium text-zinc-900 mb-2 group-hover:text-resort-ocean transition-colors">
												{room.name}
											</h3>
											<p className="text-sm text-zinc-600 mb-4 line-clamp-2">
												{room.shortDescription}
											</p>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4 text-sm text-zinc-500">
													<span className="flex items-center gap-1">
														<Users className="h-4 w-4" />
														{room.capacity.maxGuests}
													</span>
													<span className="flex items-center gap-1">
														<Bed className="h-4 w-4" />
														{room.capacity.beds.reduce((acc, b) => acc + b.count, 0)}
													</span>
												</div>
												<div className="text-right">
													<span className="text-xl font-semibold text-zinc-900">
														{formatPrice(room.pricePerNight)}
													</span>
													<span className="text-sm text-zinc-500">{t("common.perNight")}</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-resort-ocean">
				<div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
					<h2 className="text-3xl md:text-4xl font-light text-white mb-4">
						¿Listo para Escapar?
					</h2>
					<p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
						Reserva tu escapada tropical hoy y experimenta la magia de Coral
						Cove Resort.
					</p>
					<Link to="/checkout" search={{ step: 1 }}>
						<Button
							size="lg"
							className="bg-white text-resort-ocean hover:bg-white/90 px-8"
						>
							Iniciar tu Reservación
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
