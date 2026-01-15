import { useTranslation } from "react-i18next";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { languages, type LanguageCode } from "@/lib/i18n";

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const currentLanguage = languages.find((l) => l.code === i18n.language) ?? languages[0];

	const handleChangeLanguage = (code: LanguageCode) => {
		i18n.changeLanguage(code);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2">
					<Languages className="h-4 w-4" />
					<span className="hidden sm:inline">{currentLanguage.flag}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => handleChangeLanguage(language.code)}
						className={i18n.language === language.code ? "bg-zinc-100" : ""}
					>
						<span className="mr-2">{language.flag}</span>
						{language.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
