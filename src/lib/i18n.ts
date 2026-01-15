import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

// Available languages
export const languages = [
	{ code: "es", name: "Español", flag: "🇪🇸" },
	{ code: "en", name: "English", flag: "🇺🇸" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

i18n.use(initReactI18next).init({
	resources: {
		es: { translation: es },
		en: { translation: en },
	},
	lng: "es", // Default language
	fallbackLng: "es",
	interpolation: {
		escapeValue: false, // React already escapes values
	},
});

export default i18n;
