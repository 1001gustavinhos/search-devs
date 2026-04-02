import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    translation: {
      home: {
        title: "Search d_evs",
        description: "Busque um usuario do GitHub para abrir o perfil.",
        searchPlaceholder: "Digite o username do GitHub",
        searchButton: "Buscar",
        loading: "Buscando",
        userNotFound: "Nao ha usuarios com esse nome",
        genericError:
          "Nao foi possivel consultar o GitHub agora. Tente novamente.",
      },
      profile: {
        title: "Perfil de {{username}}",
        description:
          "A pagina de perfil sera implementada nas proximas etapas do desafio.",
      },
    },
  },
  en: {
    translation: {
      home: {
        title: "Search d_evs",
        description: "Search for a GitHub user to open the profile.",
        searchPlaceholder: "Type the GitHub username",
        searchButton: "Search",
        loading: "Searching",
        userNotFound: "No users found with this name",
        genericError: "Could not reach GitHub right now. Please try again.",
      },
      profile: {
        title: "Profile: {{username}}",
        description:
          "The profile page will be implemented in the next challenge stages.",
      },
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
