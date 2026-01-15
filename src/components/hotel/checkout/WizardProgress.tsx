import { Check, Calendar, Home, User, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
	currentStep: 1 | 2 | 3 | 4;
	completedSteps: number[];
	onStepClick?: (step: 1 | 2 | 3 | 4) => void;
}

export function WizardProgress({
	currentStep,
	completedSteps,
	onStepClick,
}: WizardProgressProps) {
	const { t } = useTranslation();

	const steps = [
		{ number: 1, label: t("wizard.dates"), icon: Calendar },
		{ number: 2, label: t("wizard.room"), icon: Home },
		{ number: 3, label: t("wizard.guestInfo"), icon: User },
		{ number: 4, label: t("wizard.payment"), icon: CreditCard },
	];

	return (
		<div className="w-full">
			{/* Desktop View */}
			<div className="hidden md:flex items-center justify-between">
				{steps.map((step, index) => {
					const isCompleted = completedSteps.includes(step.number);
					const isCurrent = currentStep === step.number;
					const isClickable =
						onStepClick && (isCompleted || step.number <= Math.max(...completedSteps, currentStep));

					return (
						<div key={step.number} className="flex items-center flex-1">
							{/* Step Circle */}
							<button
								type="button"
								onClick={() => isClickable && onStepClick?.(step.number as 1 | 2 | 3 | 4)}
								disabled={!isClickable}
								className={cn(
									"relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
									isCompleted
										? "bg-resort-ocean border-resort-ocean text-white"
										: isCurrent
											? "bg-white border-resort-ocean text-resort-ocean"
											: "bg-white border-zinc-200 text-zinc-400",
									isClickable && !isCurrent && "cursor-pointer hover:border-resort-ocean-light",
								)}
							>
								{isCompleted ? (
									<Check className="h-5 w-5" />
								) : (
									<step.icon className="h-5 w-5" />
								)}
							</button>

							{/* Step Label */}
							<div className="ml-3">
								<p
									className={cn(
										"text-sm font-medium",
										isCurrent ? "text-zinc-900" : "text-zinc-500",
									)}
								>
									{t("wizard.step")} {step.number}
								</p>
								<p
									className={cn(
										"text-sm",
										isCurrent ? "text-resort-ocean font-medium" : "text-zinc-400",
									)}
								>
									{step.label}
								</p>
							</div>

							{/* Connector Line */}
							{index < steps.length - 1 && (
								<div className="flex-1 mx-4">
									<div
										className={cn(
											"h-0.5 w-full",
											isCompleted ? "bg-resort-ocean" : "bg-zinc-200",
										)}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Mobile View */}
			<div className="md:hidden">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-zinc-900">
						{t("checkout.stepOf", { current: currentStep, total: 4 })}
					</span>
					<span className="text-sm text-resort-ocean font-medium">
						{steps.find((s) => s.number === currentStep)?.label}
					</span>
				</div>
				<div className="flex gap-1">
					{steps.map((step) => (
						<div
							key={step.number}
							className={cn(
								"h-1.5 flex-1 rounded-full transition-colors",
								step.number <= currentStep
									? "bg-resort-ocean"
									: "bg-zinc-200",
							)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
