import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  pt: {
    translation: {
      app: {
        title: 'Search Devs',
      },
      home: {
        title: 'Buscar perfis do GitHub',
        description:
          'Digite um usuario para visualizar perfil e repositorios com scroll infinito.',
      },
      profile: {
        title: 'Perfil de {{username}}',
        description:
          'A pagina de perfil sera implementada nas proximas etapas do desafio.',
      },
    },
  },
  en: {
    translation: {
      app: {
        title: 'Search Devs',
      },
      home: {
        title: 'Search GitHub profiles',
        description:
          'Type a username to view profile and repositories with infinite scroll.',
      },
      profile: {
        title: 'Profile: {{username}}',
        description:
          'The profile page will be implemented in the next challenge stages.',
      },
    },
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
