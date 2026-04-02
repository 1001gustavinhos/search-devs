import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  AlertIcon,
  Button,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  getGithubUserByUsername,
  GithubUserNotFoundError,
} from "../services/github-service.ts";

export function HomePage() {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await getGithubUserByUsername(trimmedUsername);

      await navigate({
        to: "/profile/$username",
        params: { username: trimmedUsername },
      });
    } catch (error) {
      if (error instanceof GithubUserNotFoundError) {
        setErrorMessage(t("home.userNotFound"));
        return;
      }

      setErrorMessage(t("home.genericError"));
    } finally {
      setIsSubmitting(false);
    }
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
        <Text
          as="span"
          color="brand.searchBlue"
          fontFamily="'Nunito', sans-serif"
        >
          Search
        </Text>{" "}
        <Text as="span" color="brand.title" fontFamily="'Nunito', sans-serif">
          d_evs
        </Text>
      </Heading>

      <HStack spacing={3} align="stretch">
        <Input
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            if (errorMessage) {
              setErrorMessage("");
            }
          }}
          placeholder={t("home.searchPlaceholder")}
          size="lg"
          bg="brand.surface"
          flex="1"
        />

        <Button
          type="submit"
          size="lg"
          isDisabled={!username.trim() || isSubmitting}
          isLoading={isSubmitting}
          loadingText={t("home.loading")}
          px={8}
        >
          {t("home.searchButton")}
        </Button>
      </HStack>

      {errorMessage ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {errorMessage}
        </Alert>
      ) : null}
    </VStack>
  );
}
