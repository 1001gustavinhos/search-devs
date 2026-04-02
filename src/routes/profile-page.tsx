import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode, SyntheticEvent } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  IconButton,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Clock3,
  Search,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SearchWordmark } from "../components/search-wordmark.tsx";
import { UserProfileCard } from "../components/user-profile-card.tsx";
import type { GithubRepository } from "../domain/github-repository.ts";
import type { GithubUser } from "../domain/github-user.ts";
import {
  type GithubRepoDirection,
  type GithubRepoSort,
  getGithubUserByUsername,
  GithubUserNotFoundError,
  listGithubUserRepositories,
} from "../services/github-service.ts";

function formatTimeSinceLastUpdate(updatedAt: string, language: string) {
  const locale = language.startsWith("pt") ? "pt-BR" : "en-US";
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const now = Date.now();
  const updatedTimestamp = new Date(updatedAt).getTime();
  const diffInSeconds = Math.round((updatedTimestamp - now) / 1000);
  const absoluteSeconds = Math.abs(diffInSeconds);

  if (absoluteSeconds < 60) {
    return formatter.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, "hour");
  }

  const diffInDays = Math.round(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return formatter.format(diffInDays, "day");
  }

  const diffInMonths = Math.round(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return formatter.format(diffInMonths, "month");
  }

  const diffInYears = Math.round(diffInMonths / 12);
  return formatter.format(diffInYears, "year");
}

function InfoIcon({ children }: { children: ReactNode }) {
  return (
    <Box
      boxSize="24px"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {children}
    </Box>
  );
}

export function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchUsername, setSearchUsername] = useState("");
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
  const [repositorySort, setRepositorySort] =
    useState<GithubRepoSort>("updated");
  const [repositoryDirection, setRepositoryDirection] =
    useState<GithubRepoDirection>("desc");
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearchUsername("");
  }, [username]);

  const handleSearchSubmit = async (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();

    const trimmedUsername = searchUsername.trim();
    if (!trimmedUsername || trimmedUsername === username) {
      return;
    }

    try {
      await getGithubUserByUsername(trimmedUsername);

      await navigate({
        to: "/profile/$username",
        params: { username: trimmedUsername },
      });
    } catch (error) {
      if (error instanceof GithubUserNotFoundError) {
        toast({
          title: t("profile.userNotFound"),
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

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
        <Spinner size="xl" color="brand.accent" />
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
    <VStack align="stretch" spacing={6} maxW="1200px" mx="auto" w="100%">
      <Stack
        as="form"
        onSubmit={handleSearchSubmit}
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 6, md: 8 }}
        align="center"
        w="100%"
        display={{ base: "none", md: "flex" }}
      >
        <Box w={{ base: "100%", md: "280px" }} flexShrink={0}>
          <Link
            href="/"
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
          >
            <SearchWordmark fontSize="32px" textAlign="left" />
          </Link>
        </Box>

        <HStack justify="flex-start" w="100%" flex="1">
          <InputGroup flex="1" maxW="590px">
            <InputLeftElement
              pointerEvents="none"
              color="brand.usernameDesktop"
            >
              <Search size={18} />
            </InputLeftElement>
            <Input
              value={searchUsername}
              onChange={(event) => {
                setSearchUsername(event.target.value);
              }}
              placeholder={username}
              size="md"
              bg="brand.surface"
              textAlign="left"
              _placeholder={{
                color: "brand.usernameDesktop",
              }}
            />
          </InputGroup>
        </HStack>
      </Stack>

      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 6, md: 8 }}
        align="flex-start"
        w="100%"
      >
        <VStack
          align="stretch"
          spacing={6}
          w={{ base: "100%", md: "280px" }}
          flexShrink={0}
        >
          <UserProfileCard user={user} />

          {/* Placeholder: Figma design has this contact button but no behavior guidance was found; for now it opens the user's GitHub profile and should be replaced after orientation. */}
          <Button
            as={Link}
            href={user.html_url}
            isExternal
            rel="noopener noreferrer"
            display={{ base: "none", md: "inline-flex" }}
            w="100%"
            color="brand.surface"
            _hover={{
              bg: "#7C12BA",
              color: "brand.surface",
            }}
            _active={{
              bg: "#6E0FA8",
              color: "brand.surface",
            }}
          >
            {t("profile.contactButton")}
          </Button>
        </VStack>

        <Box
          bg="brand.surface"
          borderRadius="4px"
          p={3}
          shadow="md"
          flex="1"
          w="100%"
          minW={0}
        >
          <VStack align="stretch" spacing={4}>
            <HStack justify="flex-end" align="center" spacing={4}>
              <HStack spacing={3} w="100%" justify="flex-end">
                <Menu>
                  <MenuButton
                    as={Button}
                    type="button"
                    size="sm"
                    variant="outline"
                    borderColor="gray.200"
                    leftIcon={<ArrowUpDown size={18} />}
                    minW="220px"
                    textAlign="left"
                  >
                    {t("profile.repositoriesSortLabel")}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      fontWeight={
                        repositorySort === "created" ? "semibold" : "normal"
                      }
                      onClick={() => {
                        setRepositorySort("created");
                      }}
                    >
                      {t("profile.sortCreated")}
                    </MenuItem>
                    <MenuItem
                      fontWeight={
                        repositorySort === "updated" ? "semibold" : "normal"
                      }
                      onClick={() => {
                        setRepositorySort("updated");
                      }}
                    >
                      {t("profile.sortUpdated")}
                    </MenuItem>
                    <MenuItem
                      fontWeight={
                        repositorySort === "pushed" ? "semibold" : "normal"
                      }
                      onClick={() => {
                        setRepositorySort("pushed");
                      }}
                    >
                      {t("profile.sortPushed")}
                    </MenuItem>
                    <MenuItem
                      fontWeight={
                        repositorySort === "full_name" ? "semibold" : "normal"
                      }
                      onClick={() => {
                        setRepositorySort("full_name");
                      }}
                    >
                      {t("profile.sortFullName")}
                    </MenuItem>
                  </MenuList>
                </Menu>

                <IconButton
                  type="button"
                  size="sm"
                  variant="outline"
                  borderColor="gray.200"
                  icon={
                    repositoryDirection === "asc" ? (
                      <ArrowUpWideNarrow size={18} />
                    ) : (
                      <ArrowDownWideNarrow size={18} />
                    )
                  }
                  boxSize="32px"
                  minW="32px"
                  minH="32px"
                  onClick={() => {
                    setRepositoryDirection((previousDirection) =>
                      previousDirection === "asc" ? "desc" : "asc",
                    );
                  }}
                  aria-label={`${t("profile.repositoriesDirectionLabel")}: ${
                    repositoryDirection === "asc"
                      ? t("profile.directionAsc")
                      : t("profile.directionDesc")
                  }`}
                />
              </HStack>
            </HStack>

            {isLoadingRepositories ? (
              <HStack spacing={3}>
                <Spinner size="sm" color="brand.accent" />
                <Text fontSize="14px">{t("profile.repositoriesLoading")}</Text>
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
              <Text color="brand.text" fontSize="14px">
                {t("profile.noRepositories")}
              </Text>
            ) : null}

            <VStack align="stretch" spacing={0}>
              {repositories.map((repository) => (
                <Box
                  key={repository.id}
                  borderRadius="4px"
                  px={{ base: 0, md: 3 }}
                  py={3}
                  bg="brand.surface"
                  borderBottomWidth="1px"
                  borderBottomColor="gray.100"
                  boxShadow={"none"}
                >
                  <Link
                    href={repository.html_url}
                    isExternal
                    fontWeight="bold"
                    fontSize="20px"
                    color="brand.title"
                  >
                    {repository.name}
                  </Link>
                  <Text
                    mt={2}
                    color="brand.text"
                    fontSize="16px"
                    fontWeight="normal"
                  >
                    {repository.description ??
                      t("profile.repositoryWithoutDescription")}
                  </Text>

                  <HStack
                    mt={3}
                    spacing={2}
                    color="brand.text"
                    fontSize="14px"
                    flexWrap="wrap"
                  >
                    <HStack spacing={1}>
                      <InfoIcon>
                        <Star size={18} />
                      </InfoIcon>
                      <Text>{repository.stargazers_count}</Text>
                    </HStack>

                    <Text aria-hidden="true">•</Text>

                    <HStack spacing={1}>
                      <InfoIcon>
                        <Clock3 size={18} />
                      </InfoIcon>
                      <Text>
                        {`${t("profile.updatedPrefix")} ${formatTimeSinceLastUpdate(
                          repository.updated_at,
                          i18n.language,
                        )}`}
                      </Text>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>

            {hasMoreRepositories ? (
              <Box ref={loadMoreTriggerRef} h="1px" />
            ) : null}

            {isLoadingMoreRepositories ? (
              <HStack spacing={3}>
                <Spinner size="sm" color="brand.accent" />
                <Text fontSize="14px">
                  {t("profile.repositoriesLoadingMore")}
                </Text>
              </HStack>
            ) : null}
          </VStack>
        </Box>
      </Stack>
    </VStack>
  );
}
