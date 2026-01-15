import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { GuestInfo } from "@/types/hotel";
import { cn } from "@/lib/utils";

interface GuestInfoFormProps {
	initialValues?: Partial<GuestInfo>;
	onSubmit: (info: GuestInfo) => void;
	onBack: () => void;
}

const countries = [
	{ code: "AR", name: "Argentina" },
	{ code: "BR", name: "Brazil" },
	{ code: "CL", name: "Chile" },
	{ code: "CO", name: "Colombia" },
	{ code: "MX", name: "Mexico" },
	{ code: "US", name: "United States" },
	{ code: "CA", name: "Canada" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "ES", name: "Spain" },
	{ code: "FR", name: "France" },
	{ code: "DE", name: "Germany" },
	{ code: "IT", name: "Italy" },
	{ code: "OTHER", name: "Other" },
];

interface FormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	country?: string;
}

export function GuestInfoForm({
	initialValues,
	onSubmit,
	onBack,
}: GuestInfoFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<Partial<GuestInfo>>({
		firstName: initialValues?.firstName ?? "",
		lastName: initialValues?.lastName ?? "",
		email: initialValues?.email ?? "",
		phone: initialValues?.phone ?? "",
		country: initialValues?.country ?? "",
		specialRequests: initialValues?.specialRequests ?? "",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const validateField = (name: string, value: string): string | undefined => {
		switch (name) {
			case "firstName":
				if (!value.trim()) return t("validation.firstNameRequired");
				if (value.length < 2) return t("validation.firstNameMin");
				break;
			case "lastName":
				if (!value.trim()) return t("validation.lastNameRequired");
				if (value.length < 2) return t("validation.lastNameMin");
				break;
			case "email":
				if (!value.trim()) return t("validation.emailRequired");
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
					return t("validation.emailInvalid");
				break;
			case "phone":
				if (!value.trim()) return t("validation.phoneRequired");
				if (!/^[+]?[\d\s()-]{10,}$/.test(value))
					return t("validation.phoneInvalid");
				break;
			case "country":
				if (!value) return t("validation.countryRequired");
				break;
		}
		return undefined;
	};

	const handleChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (touched[name]) {
			const error = validateField(name, value);
			setErrors((prev) => ({ ...prev, [name]: error }));
		}
	};

	const handleBlur = (name: string) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
		const error = validateField(name, formData[name as keyof GuestInfo] ?? "");
		setErrors((prev) => ({ ...prev, [name]: error }));
	};

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};
		const fields = ["firstName", "lastName", "email", "phone", "country"];

		for (const field of fields) {
			const error = validateField(field, formData[field as keyof GuestInfo] ?? "");
			if (error) newErrors[field as keyof FormErrors] = error;
		}

		setErrors(newErrors);
		setTouched(
			fields.reduce(
				(acc, field) => ({ ...acc, [field]: true }),
				{},
			),
		);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData as GuestInfo);
		}
	};

	const hasErrors = Object.values(errors).some((error) => error);

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-2xl font-light text-zinc-900 mb-2">
					{t("checkout.guestInfo")}
				</h2>
				<p className="text-zinc-600">
					{t("checkout.guestInfoDesc")}
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<Card>
					<CardContent className="p-6 space-y-6">
						{/* Name Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">
									{t("checkout.firstName")} <span className="text-red-500">*</span>
								</Label>
								<Input
									id="firstName"
									value={formData.firstName}
									onChange={(e) => handleChange("firstName", e.target.value)}
									onBlur={() => handleBlur("firstName")}
									className={cn(
										errors.firstName && touched.firstName && "border-red-500",
									)}
									placeholder="John"
								/>
								{errors.firstName && touched.firstName && (
									<p className="text-sm text-red-500">{errors.firstName}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName">
									{t("checkout.lastName")} <span className="text-red-500">*</span>
								</Label>
								<Input
									id="lastName"
									value={formData.lastName}
									onChange={(e) => handleChange("lastName", e.target.value)}
									onBlur={() => handleBlur("lastName")}
									className={cn(
										errors.lastName && touched.lastName && "border-red-500",
									)}
									placeholder="Doe"
								/>
								{errors.lastName && touched.lastName && (
									<p className="text-sm text-red-500">{errors.lastName}</p>
								)}
							</div>
						</div>

						{/* Email */}
						<div className="space-y-2">
							<Label htmlFor="email">
								{t("checkout.email")} <span className="text-red-500">*</span>
							</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => handleChange("email", e.target.value)}
								onBlur={() => handleBlur("email")}
								className={cn(errors.email && touched.email && "border-red-500")}
								placeholder="john.doe@example.com"
							/>
							{errors.email && touched.email && (
								<p className="text-sm text-red-500">{errors.email}</p>
							)}
						</div>

						{/* Phone & Country Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="phone">
									{t("checkout.phone")} <span className="text-red-500">*</span>
								</Label>
								<Input
									id="phone"
									type="tel"
									value={formData.phone}
									onChange={(e) => handleChange("phone", e.target.value)}
									onBlur={() => handleBlur("phone")}
									className={cn(errors.phone && touched.phone && "border-red-500")}
									placeholder="+1 (555) 123-4567"
								/>
								{errors.phone && touched.phone && (
									<p className="text-sm text-red-500">{errors.phone}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="country">
									{t("checkout.country")} <span className="text-red-500">*</span>
								</Label>
								<Select
									value={formData.country}
									onValueChange={(value) => handleChange("country", value)}
								>
									<SelectTrigger
										className={cn(
											errors.country && touched.country && "border-red-500",
										)}
									>
										<SelectValue placeholder={t("checkout.selectCountry")} />
									</SelectTrigger>
									<SelectContent>
										{countries.map((country) => (
											<SelectItem key={country.code} value={country.code}>
												{country.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.country && touched.country && (
									<p className="text-sm text-red-500">{errors.country}</p>
								)}
							</div>
						</div>

						{/* Special Requests */}
						<div className="space-y-2">
							<Label htmlFor="specialRequests">{t("checkout.specialRequests")}</Label>
							<textarea
								id="specialRequests"
								value={formData.specialRequests}
								onChange={(e) => handleChange("specialRequests", e.target.value)}
								className="w-full min-h-24 px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-resort-ocean focus:border-transparent resize-none"
								placeholder={t("checkout.specialRequestsPlaceholder")}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Navigation */}
				<div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-200">
					<Button type="button" variant="outline" onClick={onBack}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						{t("common.back")}
					</Button>
					<Button
						type="submit"
						className={cn(
							!hasErrors
								? "bg-resort-ocean hover:bg-resort-ocean-dark"
								: "bg-resort-ocean hover:bg-resort-ocean-dark",
						)}
					>
						{t("checkout.continueToPayment")}
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</form>
		</div>
	);
}
