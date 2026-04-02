import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    translation: {
      home: {
        title: "Search d_evs",
        description: "Busque um usuário do GitHub para abrir o perfil.",
        searchPlaceholder: "Digite o username do GitHub",
        searchButton: "Buscar",
        loading: "Buscando",
        userNotFound: "Não há usuários com esse nome",
        genericError:
          "Não foi possível consultar o GitHub agora. Tente novamente.",
      },
      profile: {
        title: "Perfil de {{username}}",
        loading: "Carregando perfil...",
        userNotFound: "Não há usuários com esse nome",
        genericError:
          "Não foi possível carregar o perfil agora. Tente novamente.",
        openGithub: "Abrir no GitHub",
        openWebsite: "Abrir site",
        openTwitter: "Abrir Twitter",
        followers: "Seguidores",
        following: "Seguindo",
        publicRepos: "Repositórios públicos",
        repositoriesTitle: "Repositórios",
        repositoriesSortLabel: "Ordenar por",
        repositoriesDirectionLabel: "Direção",
        sortCreated: "Criação",
        sortUpdated: "Atualização",
        sortPushed: "Último push",
        sortFullName: "Nome completo",
        directionAsc: "Ascendente",
        directionDesc: "Descendente",
        repositoriesLoading: "Carregando repositórios...",
        repositoriesLoadError:
          "Não foi possível carregar os repositórios agora. Tente novamente.",
        noRepositories: "Este usuário não possui repositórios públicos.",
        repositoryWithoutDescription: "Sem descrição.",
        loadMoreRepositories: "Carregar mais",
        repositoriesLoadingMore: "Carregando mais",
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
        openWebsite: "Open website",
        openTwitter: "Open Twitter",
        followers: "Followers",
        following: "Following",
        publicRepos: "Public repositories",
        repositoriesTitle: "Repositories",
        repositoriesSortLabel: "Sort by",
        repositoriesDirectionLabel: "Direction",
        sortCreated: "Created",
        sortUpdated: "Updated",
        sortPushed: "Last pushed",
        sortFullName: "Full name",
        directionAsc: "Ascending",
        directionDesc: "Descending",
        repositoriesLoading: "Loading repositories...",
        repositoriesLoadError:
          "Could not load repositories right now. Please try again.",
        noRepositories: "This user has no public repositories.",
        repositoryWithoutDescription: "No description.",
        loadMoreRepositories: "Load more",
        repositoriesLoadingMore: "Loading more",
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
