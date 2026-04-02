import {
  Avatar,
  Card,
  CardBody,
  Box,
  HStack,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import {
  AtSign,
  Building2,
  Globe,
  Mail,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GithubUser } from "../domain/github-user.ts";

type UserProfileCardProps = {
  user: GithubUser;
};

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

function normalizeWebsiteUrl(url: string | null) {
  if (!url) {
    return null;
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return null;
  }

  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

function getWebsiteDisplayText(url: string | null) {
  const normalizedUrl = normalizeWebsiteUrl(url);
  if (!normalizedUrl) {
    return null;
  }

  return normalizedUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function normalizeLocation(location: string | null) {
  if (location === null) {
    return null;
  }

  const normalizedLocation = location.trim();
  return normalizedLocation || null;
}

function getTwitterProfileUrl(username: string | null) {
  if (username === null) {
    return null;
  }

  const normalizedUsername = username.trim().replace(/^@+/, "");
  if (!normalizedUsername) {
    return null;
  }

  return `https://x.com/${normalizedUsername}`;
}

function normalizeTwitterUsername(username: string | null) {
  if (username === null) {
    return null;
  }

  const normalizedUsername = username.trim().replace(/^@+/, "");
  return normalizedUsername || null;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const { t } = useTranslation();

  const displayName = user.name ?? user.login;
  const normalizedBio = user.bio?.trim() || null;
  const normalizedLocation = normalizeLocation(user.location);
  const normalizedEmail = user.email?.trim() || null;
  const websiteUrl = normalizeWebsiteUrl(user.blog);
  const websiteDisplayText = getWebsiteDisplayText(user.blog);
  const twitterUsername = normalizeTwitterUsername(user.twitter_username);
  const twitterUrl = getTwitterProfileUrl(user.twitter_username);

  return (
    <Card
      bg={{ base: "brand.mobileProfileCardBg", md: "brand.surface" }}
      shadow="sm"
    >
      <CardBody>
        <Stack spacing={4}>
          <HStack spacing={4} align="flex-start">
            <Avatar
              size="xl"
              name={displayName}
              src={user.avatar_url}
              bg="brand.accent"
            />

            <Stack spacing={1} minW={0}>
              <Link
                href={user.html_url}
                isExternal
                rel="noopener noreferrer"
                fontWeight="semibold"
                color="brand.title"
                wordBreak="break-word"
              >
                {displayName}
              </Link>
              <Text color={{ base: "brand.text", md: "brand.usernameDesktop" }}>
                @{user.login}
              </Text>
            </Stack>
          </HStack>

          <Box display={{ base: "block", md: "none" }}>
            <HStack spacing={6} align="center" flexWrap="wrap">
              <HStack spacing={1}>
                <InfoIcon>
                  <Users size={18} />
                </InfoIcon>
                <Text>
                  {t("profile.statsFollowers")}: {user.followers}
                </Text>
              </HStack>

              <HStack spacing={1}>
                <InfoIcon>
                  <UserPlus size={18} />
                </InfoIcon>
                <Text>
                  {t("profile.statsFollowing")}: {user.following}
                </Text>
              </HStack>
            </HStack>

            {normalizedBio ? (
              <Text mt={3} color="brand.text">
                {normalizedBio}
              </Text>
            ) : null}

            <Wrap mt={3} spacing={3} color="brand.text">
              {user.company !== null ? (
                <WrapItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <Building2 size={18} />
                    </InfoIcon>
                    <Text>{user.company}</Text>
                  </HStack>
                </WrapItem>
              ) : null}

              {normalizedLocation ? (
                <WrapItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <MapPin size={18} />
                    </InfoIcon>
                    <Text>{normalizedLocation}</Text>
                  </HStack>
                </WrapItem>
              ) : null}

              {normalizedEmail ? (
                <WrapItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <Mail size={18} />
                    </InfoIcon>
                    <Link
                      href={`mailto:${normalizedEmail}`}
                      color="brand.accent"
                    >
                      {normalizedEmail}
                    </Link>
                  </HStack>
                </WrapItem>
              ) : null}

              {websiteUrl && websiteDisplayText ? (
                <WrapItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <Globe size={18} />
                    </InfoIcon>
                    <Link
                      href={websiteUrl}
                      isExternal
                      rel="noopener noreferrer"
                      color="brand.text"
                      wordBreak="break-all"
                    >
                      {websiteDisplayText}
                    </Link>
                  </HStack>
                </WrapItem>
              ) : null}

              {twitterUrl && twitterUsername ? (
                <WrapItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <AtSign size={18} />
                    </InfoIcon>
                    <Link
                      href={twitterUrl}
                      isExternal
                      rel="noopener noreferrer"
                      color="brand.accent"
                    >
                      @{twitterUsername}
                    </Link>
                  </HStack>
                </WrapItem>
              ) : null}
            </Wrap>
          </Box>

          <Box display={{ base: "none", md: "block" }}>
            {normalizedBio ? <Text>{normalizedBio}</Text> : null}

            <List spacing={2} color="brand.text" mt={normalizedBio ? 3 : 0}>
              <ListItem>
                <HStack spacing={2} align="center">
                  <InfoIcon>
                    <Users size={18} />
                  </InfoIcon>
                  <Text>
                    {t("profile.statsFollowers")}: {user.followers}
                  </Text>
                </HStack>
              </ListItem>

              <ListItem>
                <HStack spacing={2} align="center">
                  <InfoIcon>
                    <UserPlus size={18} />
                  </InfoIcon>
                  <Text>
                    {t("profile.statsFollowing")}: {user.following}
                  </Text>
                </HStack>
              </ListItem>

              {user.company !== null ? (
                <ListItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <Building2 size={18} />
                    </InfoIcon>
                    <Text>{user.company}</Text>
                  </HStack>
                </ListItem>
              ) : null}

              {normalizedLocation ? (
                <ListItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <MapPin size={18} />
                    </InfoIcon>
                    <Text>{normalizedLocation}</Text>
                  </HStack>
                </ListItem>
              ) : null}

              {normalizedEmail ? (
                <ListItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <Mail size={18} />
                    </InfoIcon>
                    <Link
                      href={`mailto:${normalizedEmail}`}
                      color="brand.accent"
                    >
                      {normalizedEmail}
                    </Link>
                  </HStack>
                </ListItem>
              ) : null}

              {websiteUrl && websiteDisplayText ? (
                <ListItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <Globe size={18} />
                    </InfoIcon>
                    <Link
                      href={websiteUrl}
                      isExternal
                      rel="noopener noreferrer"
                      color="brand.accent"
                      wordBreak="break-all"
                    >
                      {websiteDisplayText}
                    </Link>
                  </HStack>
                </ListItem>
              ) : null}

              {twitterUrl && twitterUsername ? (
                <ListItem>
                  <HStack spacing={2} align="center">
                    <InfoIcon>
                      <AtSign size={18} />
                    </InfoIcon>
                    <Link
                      href={twitterUrl}
                      isExternal
                      rel="noopener noreferrer"
                      color="brand.accent"
                    >
                      @{twitterUsername}
                    </Link>
                  </HStack>
                </ListItem>
              ) : null}
            </List>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
