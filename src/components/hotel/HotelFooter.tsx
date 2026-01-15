import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Waves, MapPin, Phone, Mail } from "lucide-react";

export function HotelFooter() {
	const { t } = useTranslation();

	return (
		<footer className="bg-zinc-900 text-zinc-300">
			<div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="md:col-span-1">
						<Link to="/" className="flex items-center gap-2 mb-4">
							<Waves className="h-8 w-8 text-resort-ocean-light" />
							<span className="text-xl font-semibold text-white tracking-tight">
								Coral Cove
							</span>
						</Link>
						<p className="text-sm text-zinc-400 leading-relaxed">
							{t("footer.aboutDesc")}
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
							{t("footer.quickLinks")}
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									to="/"
									className="text-sm text-zinc-400 hover:text-white transition-colors"
								>
									{t("header.home")}
								</Link>
							</li>
							<li>
								<Link
									to="/rooms"
									className="text-sm text-zinc-400 hover:text-white transition-colors"
								>
									{t("header.rooms")}
								</Link>
							</li>
							<li>
								<Link
									to="/checkout"
									search={{ step: 1 }}
									className="text-sm text-zinc-400 hover:text-white transition-colors"
								>
									{t("common.bookNow")}
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
							{t("footer.contact")}
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start gap-2">
								<MapPin className="h-4 w-4 text-resort-ocean-light mt-0.5 flex-shrink-0" />
								<span className="text-sm text-zinc-400">
									123 Ocean Drive
									<br />
									Paradise Beach, FL 33139
								</span>
							</li>
							<li className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-resort-ocean-light flex-shrink-0" />
								<span className="text-sm text-zinc-400">+1 (555) 123-4567</span>
							</li>
							<li className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-resort-ocean-light flex-shrink-0" />
								<span className="text-sm text-zinc-400">
									reservaciones@coralcove.com
								</span>
							</li>
						</ul>
					</div>

					{/* Payment Info */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
							Pagos Seguros
						</h3>
						<p className="text-sm text-zinc-400 mb-4">
							Paga en tu moneda local con Aloha Pay
						</p>
						<div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-4 py-3">
							<img
								src="https://alohapay.co/logo-light.svg"
								alt="Aloha Pay"
								className="h-6"
								onError={(e) => {
									e.currentTarget.style.display = "none";
								}}
							/>
							<span className="text-sm text-zinc-300">{t("common.poweredBy")} Aloha Pay</span>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-zinc-500">
						© {new Date().getFullYear()} Coral Cove Resort. Todos los derechos reservados.
					</p>
					<p className="text-sm text-zinc-500">
						Proyecto demo para integración con{" "}
						<a
							href="https://alohapay.co"
							target="_blank"
							rel="noopener noreferrer"
							className="text-resort-ocean-light hover:text-white transition-colors"
						>
							Aloha Pay
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
