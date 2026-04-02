import { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Avatar,
  Button,
  Heading,
  HStack,
  Link,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { GithubUser } from "../domain/github-user.ts";
import {
  getGithubUserByUsername,
  GithubUserNotFoundError,
} from "../services/github-service.ts";

export function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { t } = useTranslation();
  const [user, setUser] = useState<GithubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const profileUser = await getGithubUserByUsername(username);

        if (isMounted) {
          setUser(profileUser);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setUser(null);

        if (error instanceof GithubUserNotFoundError) {
          setErrorMessage(t("profile.userNotFound"));
          return;
        }

        setErrorMessage(t("profile.genericError"));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [username, t]);

  if (isLoading) {
    return (
      <VStack spacing={4} minH="50vh" justify="center" align="center">
        <Spinner size="xl" color="blue.500" />
        <Text>{t("profile.loading")}</Text>
      </VStack>
    );
  }

  if (errorMessage) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {errorMessage}
      </Alert>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <VStack align="stretch" spacing={6} maxW="760px" mx="auto" w="100%">
      <HStack spacing={5} align="flex-start">
        <Avatar
          size="2xl"
          name={user.name ?? user.login}
          src={user.avatar_url}
          bg="blue.500"
        />

        <VStack align="flex-start" spacing={2} flex="1">
          <Heading as="h2" size="lg">
            {user.name ?? user.login}
          </Heading>
          <Text color="gray.600">@{user.login}</Text>
          {user.bio ? <Text>{user.bio}</Text> : null}

          <Button as={Link} href={user.html_url} isExternal colorScheme="blue" size="sm">
            {t("profile.openGithub")}
          </Button>
        </VStack>
      </HStack>

      <HStack spacing={6} flexWrap="wrap" align="stretch">
        <Stat>
          <StatLabel>{t("profile.followers")}</StatLabel>
          <StatNumber>{user.followers}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>{t("profile.following")}</StatLabel>
          <StatNumber>{user.following}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>{t("profile.publicRepos")}</StatLabel>
          <StatNumber>{user.public_repos}</StatNumber>
        </Stat>
      </HStack>
    </VStack>
  );
}
