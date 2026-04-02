import { Box, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <Box>
      <Heading as="h2" size="md" mb={3}>
        {t('home.title')}
      </Heading>
      <Text color="gray.600">{t('home.description')}</Text>
    </Box>
  )
}
