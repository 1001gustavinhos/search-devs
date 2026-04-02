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
        loading: "Carregando perfil...",
        userNotFound: "Nao ha usuarios com esse nome",
        genericError:
          "Nao foi possivel carregar o perfil agora. Tente novamente.",
        openGithub: "Abrir no GitHub",
        followers: "Seguidores",
        following: "Seguindo",
        publicRepos: "Repositorios publicos",
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
        loading: "Loading profile...",
        userNotFound: "No users found with this name",
        genericError: "Could not load the profile right now. Please try again.",
        openGithub: "Open on GitHub",
        followers: "Followers",
        following: "Following",
        publicRepos: "Public repositories",
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
