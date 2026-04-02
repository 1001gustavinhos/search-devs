import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
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
      <Heading
        as="h1"
        textAlign="center"
        letterSpacing="tight"
        fontSize={{ base: "50px", md: "6xl" }}
        lineHeight="1"
        fontWeight="medium"
      >
        <Text
          as="span"
          color="brand.searchBlue"
          fontFamily="'Nunito', sans-serif"
          fontWeight="medium"
        >
          Search
        </Text>{" "}
        <Text
          as="span"
          color="brand.accent"
          fontFamily="'Nunito', sans-serif"
          fontWeight="medium"
        >
          d
        </Text>
        <Text
          as="span"
          color="brand.accent"
          fontFamily="'Nunito', sans-serif"
          fontWeight="bold"
        >
          _
        </Text>
        <Text
          as="span"
          color="brand.accent"
          fontFamily="'Nunito', sans-serif"
          fontWeight="medium"
        >
          evs
        </Text>
      </Heading>

      <HStack spacing={3} align="stretch">
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none" color="brand.accent">
            <Box
              boxSize="24px"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
            >
              <Search size={18} />
            </Box>
          </InputLeftElement>

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
          />
        </InputGroup>

        <Button
          type="submit"
          size="lg"
          display={{ base: "none", md: "inline-flex" }}
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
