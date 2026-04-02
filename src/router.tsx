import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { HomePage } from './routes/home-page.tsx'
import { ProfilePage } from './routes/profile-page.tsx'
import { RootLayout } from './routes/root-layout.tsx'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$username',
  component: ProfilePage,
})

const routeTree = rootRoute.addChildren([indexRoute, profileRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
