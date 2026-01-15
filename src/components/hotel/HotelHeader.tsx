import { Link } from "@tanstack/react-router";
import { Waves, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CreatePaymentRequestDialog } from "@/components/CreatePaymentRequestDialog";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function HotelHeader() {
	const { t } = useTranslation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-zinc-100">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2 group">
						<Waves className="h-8 w-8 text-resort-ocean group-hover:text-resort-ocean-dark transition-colors" />
						<span className="text-xl font-semibold text-zinc-900 tracking-tight">
							Coral Cove
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						<Link
							to="/"
							className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
							activeProps={{ className: "text-zinc-900" }}
						>
							{t("header.home")}
						</Link>
						<Link
							to="/rooms"
							className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
							activeProps={{ className: "text-zinc-900" }}
						>
							{t("header.rooms")}
						</Link>
						<Link
							to="/checkout"
							search={{ step: 1 }}
							className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
							activeProps={{ className: "text-zinc-900" }}
						>
							{t("header.reservations")}
						</Link>
					</nav>

					{/* Desktop CTA */}
					<div className="hidden md:flex items-center gap-3">
						<LanguageSwitcher />
						<Button
							variant="outline"
							className="border-resort-ocean text-resort-ocean hover:bg-resort-ocean hover:text-white"
							onClick={() => setIsPaymentDialogOpen(true)}
						>
							<Globe className="mr-2 h-4 w-4" />
							{t("header.createPaymentRequest")}
						</Button>
						<Link to="/checkout" search={{ step: 1 }}>
							<Button className="bg-resort-ocean hover:bg-resort-ocean-dark text-white">
								{t("common.bookNow")}
							</Button>
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center gap-2">
						<LanguageSwitcher />
						<button
							type="button"
							className="p-2 text-zinc-600 hover:text-zinc-900"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						>
							{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-zinc-100">
						<nav className="flex flex-col gap-4">
							<Link
								to="/"
								className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2"
								activeProps={{ className: "text-zinc-900" }}
								onClick={() => setIsMenuOpen(false)}
							>
								{t("header.home")}
							</Link>
							<Link
								to="/rooms"
								className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2"
								activeProps={{ className: "text-zinc-900" }}
								onClick={() => setIsMenuOpen(false)}
							>
								{t("header.rooms")}
							</Link>
							<Link
								to="/checkout"
								search={{ step: 1 }}
								className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2"
								activeProps={{ className: "text-zinc-900" }}
								onClick={() => setIsMenuOpen(false)}
							>
								{t("header.reservations")}
							</Link>
							<Button
								variant="outline"
								className="w-full border-resort-ocean text-resort-ocean hover:bg-resort-ocean hover:text-white mt-2"
								onClick={() => {
									setIsMenuOpen(false);
									setIsPaymentDialogOpen(true);
								}}
							>
								<Globe className="mr-2 h-4 w-4" />
								{t("paymentDialog.title")}
							</Button>
							<Link
								to="/checkout"
								search={{ step: 1 }}
								onClick={() => setIsMenuOpen(false)}
							>
								<Button className="w-full bg-resort-ocean hover:bg-resort-ocean-dark text-white mt-2">
									{t("common.bookNow")}
								</Button>
							</Link>
						</nav>
					</div>
				)}
			</div>

			{/* Payment Request Dialog */}
			<CreatePaymentRequestDialog
				open={isPaymentDialogOpen}
				onOpenChange={setIsPaymentDialogOpen}
			/>
		</header>
	);
}
