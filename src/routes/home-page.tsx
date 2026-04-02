import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Heading, HStack, Input, VStack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const [username, setUsername] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return;
    }

    void navigate({
      to: "/profile/$username",
      params: { username: trimmedUsername },
    });
  };

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit}
      spacing={4}
      maxW="560px"
      w="100%"
      mx="auto"
      minH={{ base: "70vh", md: "78vh" }}
      justify="center"
      align="stretch"
    >
      <Heading as="h1" size="2xl" textAlign="center" letterSpacing="tight">
        {t("home.title")}
      </Heading>

      <HStack spacing={3} align="stretch">
        <Input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder={t("home.searchPlaceholder")}
          size="lg"
          bg="white"
          flex="1"
        />

        <Button
          type="submit"
          size="lg"
          colorScheme="blue"
          isDisabled={!username.trim()}
          px={8}
        >
          {t("home.searchButton")}
        </Button>
      </HStack>
    </VStack>
  );
}
