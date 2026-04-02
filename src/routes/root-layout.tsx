import { Box, Container, Heading } from '@chakra-ui/react'
import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function RootLayout() {
  const { t } = useTranslation()

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.lg" py={{ base: 6, md: 10 }}>
        <Heading as="h1" size="lg" mb={6}>
          {t('app.title')}
        </Heading>
        <Outlet />
      </Container>
    </Box>
  )
}
