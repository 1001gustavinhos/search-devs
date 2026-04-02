import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Link,
  Select,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { GithubRepository } from "../domain/github-repository.ts";
import type { GithubUser } from "../domain/github-user.ts";
import {
  type GithubRepoDirection,
  type GithubRepoSort,
  getGithubUserByUsername,
  GithubUserNotFoundError,
  listGithubUserRepositories,
} from "../services/github-service.ts";

function resolveWebsiteUrl(blog: string | null) {
  if (!blog) {
    return null;
  }

  const trimmedBlog = blog.trim();
  if (!trimmedBlog) {
    return null;
  }

  if (trimmedBlog.startsWith("http://") || trimmedBlog.startsWith("https://")) {
    return trimmedBlog;
  }

  return `https://${trimmedBlog}`;
}

export function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { t } = useTranslation();
  const [user, setUser] = useState<GithubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [repositories, setRepositories] = useState<GithubRepository[]>([]);
  const [isLoadingRepositories, setIsLoadingRepositories] = useState(false);
  const [isLoadingMoreRepositories, setIsLoadingMoreRepositories] =
    useState(false);
  const [repositoriesErrorMessage, setRepositoriesErrorMessage] = useState("");
  const [hasMoreRepositories, setHasMoreRepositories] = useState(false);
  const [currentRepositoryPage, setCurrentRepositoryPage] = useState(1);
  const [repositorySort, setRepositorySort] = useState<GithubRepoSort>("updated");
  const [repositoryDirection, setRepositoryDirection] =
    useState<GithubRepoDirection>("desc");
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      setIsLoading(true);
      setErrorMessage("");
      setRepositories([]);
      setRepositoriesErrorMessage("");
      setHasMoreRepositories(false);
      setCurrentRepositoryPage(1);

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

  useEffect(() => {
    if (!user) {
      return;
    }

    const usernameForRepositories = user.login;

    let isMounted = true;

    async function loadFirstRepositoriesPage() {
      setIsLoadingRepositories(true);
      setRepositoriesErrorMessage("");
      setRepositories([]);
      setHasMoreRepositories(false);
      setCurrentRepositoryPage(1);

      try {
        const firstPageRepositories = await listGithubUserRepositories({
          username: usernameForRepositories,
          page: 1,
          perPage: 10,
          sort: repositorySort,
          direction: repositoryDirection,
        });

        if (isMounted) {
          setRepositories(firstPageRepositories);
          setHasMoreRepositories(firstPageRepositories.length === 10);
        }
      } catch {
        if (isMounted) {
          setRepositoriesErrorMessage(t("profile.repositoriesLoadError"));
        }
      } finally {
        if (isMounted) {
          setIsLoadingRepositories(false);
        }
      }
    }

    void loadFirstRepositoriesPage();

    return () => {
      isMounted = false;
    };
  }, [repositoryDirection, repositorySort, t, user]);

  const handleLoadMoreRepositories = useCallback(async () => {
    if (!user || isLoadingMoreRepositories || !hasMoreRepositories) {
      return;
    }

    setRepositoriesErrorMessage("");
    setIsLoadingMoreRepositories(true);

    const nextPage = currentRepositoryPage + 1;

    try {
      const nextRepositories = await listGithubUserRepositories({
        username: user.login,
        page: nextPage,
        perPage: 10,
        sort: repositorySort,
        direction: repositoryDirection,
      });

      setRepositories((previousRepositories) => [
        ...previousRepositories,
        ...nextRepositories,
      ]);
      setCurrentRepositoryPage(nextPage);
      setHasMoreRepositories(nextRepositories.length === 10);
    } catch {
      setRepositoriesErrorMessage(t("profile.repositoriesLoadError"));
      setHasMoreRepositories(false);
    } finally {
      setIsLoadingMoreRepositories(false);
    }
  }, [
    currentRepositoryPage,
    hasMoreRepositories,
    isLoadingMoreRepositories,
    repositoryDirection,
    repositorySort,
    t,
    user,
  ]);

  useEffect(() => {
    if (!hasMoreRepositories || !loadMoreTriggerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void handleLoadMoreRepositories();
        }
      },
      {
        root: null,
        rootMargin: "160px 0px",
        threshold: 0,
      },
    );

    observer.observe(loadMoreTriggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMoreRepositories, hasMoreRepositories]);

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

  const websiteUrl = resolveWebsiteUrl(user.blog);
  const twitterUrl = user.twitter_username
    ? `https://x.com/${user.twitter_username}`
    : null;

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

          <HStack spacing={2} flexWrap="wrap">
            <Button
              as={Link}
              href={user.html_url}
              isExternal
              colorScheme="blue"
              size="sm"
            >
              {t("profile.openGithub")}
            </Button>

            {websiteUrl ? (
              <Button
                as={Link}
                href={websiteUrl}
                isExternal
                variant="outline"
                size="sm"
              >
                {t("profile.openWebsite")}
              </Button>
            ) : null}

            {twitterUrl ? (
              <Button
                as={Link}
                href={twitterUrl}
                isExternal
                variant="outline"
                size="sm"
              >
                {t("profile.openTwitter")}
              </Button>
            ) : null}
          </HStack>
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

      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" align={{ base: "stretch", md: "end" }} flexDir={{ base: "column", md: "row" }} spacing={4}>
          <Heading as="h3" size="md">
            {t("profile.repositoriesTitle")}
          </Heading>

          <HStack spacing={3} flexWrap="wrap">
            <FormControl minW="180px">
              <FormLabel mb={1} fontSize="sm">
                {t("profile.repositoriesSortLabel")}
              </FormLabel>
              <Select
                size="sm"
                bg="white"
                value={repositorySort}
                onChange={(event) => {
                  setRepositorySort(event.target.value as GithubRepoSort);
                }}
              >
                <option value="created">{t("profile.sortCreated")}</option>
                <option value="updated">{t("profile.sortUpdated")}</option>
                <option value="pushed">{t("profile.sortPushed")}</option>
                <option value="full_name">{t("profile.sortFullName")}</option>
              </Select>
            </FormControl>

            <FormControl minW="140px">
              <FormLabel mb={1} fontSize="sm">
                {t("profile.repositoriesDirectionLabel")}
              </FormLabel>
              <Select
                size="sm"
                bg="white"
                value={repositoryDirection}
                onChange={(event) => {
                  setRepositoryDirection(event.target.value as GithubRepoDirection);
                }}
              >
                <option value="desc">{t("profile.directionDesc")}</option>
                <option value="asc">{t("profile.directionAsc")}</option>
              </Select>
            </FormControl>
          </HStack>
        </HStack>

        {isLoadingRepositories ? (
          <HStack spacing={3}>
            <Spinner size="sm" color="blue.500" />
            <Text>{t("profile.repositoriesLoading")}</Text>
          </HStack>
        ) : null}

        {repositoriesErrorMessage ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {repositoriesErrorMessage}
          </Alert>
        ) : null}

        {!isLoadingRepositories &&
        !repositoriesErrorMessage &&
        repositories.length === 0 ? (
          <Text color="gray.600">{t("profile.noRepositories")}</Text>
        ) : null}

        <VStack align="stretch" spacing={3}>
          {repositories.map((repository) => (
            <Box
              key={repository.id}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              bg="white"
            >
              <Link
                href={repository.html_url}
                isExternal
                fontWeight="semibold"
                color="blue.600"
              >
                {repository.name}
              </Link>
              <Text mt={2} color="gray.700" fontSize="sm">
                {repository.description ??
                  t("profile.repositoryWithoutDescription")}
              </Text>
            </Box>
          ))}
        </VStack>

        {hasMoreRepositories ? <Box ref={loadMoreTriggerRef} h="1px" /> : null}

        {isLoadingMoreRepositories ? (
          <HStack spacing={3}>
            <Spinner size="sm" color="blue.500" />
            <Text>{t("profile.repositoriesLoadingMore")}</Text>
          </HStack>
        ) : null}
      </VStack>
    </VStack>
  );
}
