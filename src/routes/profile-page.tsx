import { Box, Heading, Text } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { t } = useTranslation();

  return (
    <Box>
      <Heading as="h2" size="md" mb={3}>
        {t("profile.title", { username })}
      </Heading>
      <Text color="gray.600">{t("profile.description")}</Text>
    </Box>
  );
}
