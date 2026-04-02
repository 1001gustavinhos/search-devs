import {
  Avatar,
  Card,
  CardBody,
  HStack,
  Link,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
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
    <Card bg={{ base: "brand.mobileProfileCardBg", md: "brand.surface" }} shadow="sm">
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
              <Text color="brand.text">@{user.login}</Text>
            </Stack>
          </HStack>

          {normalizedBio ? <Text>{normalizedBio}</Text> : null}

          <List spacing={2} color="brand.text">
            <ListItem>
              <HStack spacing={2} align="start">
                <Users size={16} />
                <Text>
                  {t("profile.statsFollowers")}: {user.followers}
                </Text>
              </HStack>
            </ListItem>

            <ListItem>
              <HStack spacing={2} align="start">
                <UserPlus size={16} />
                <Text>
                  {t("profile.statsFollowing")}: {user.following}
                </Text>
              </HStack>
            </ListItem>

            {user.company !== null ? (
              <ListItem>
                <HStack spacing={2} align="start">
                  <Building2 size={16} />
                  <Text>
                    {t("profile.userCompany")}: {user.company}
                  </Text>
                </HStack>
              </ListItem>
            ) : null}

            {normalizedLocation ? (
              <ListItem>
                <HStack spacing={2} align="start">
                  <MapPin size={16} />
                  <Text>
                    {t("profile.userLocation")}: {normalizedLocation}
                  </Text>
                </HStack>
              </ListItem>
            ) : null}

            {normalizedEmail ? (
              <ListItem>
                <HStack spacing={2} align="start">
                  <Mail size={16} />
                  <Text>{t("profile.userEmail")}:</Text>
                  <Link href={`mailto:${normalizedEmail}`} color="brand.accent">
                    {normalizedEmail}
                  </Link>
                </HStack>
              </ListItem>
            ) : null}

            {websiteUrl && websiteDisplayText ? (
              <ListItem>
                <HStack spacing={2} align="start">
                  <Globe size={16} />
                  <Text>{t("profile.userWebsite")}:</Text>
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
                <HStack spacing={2} align="start">
                  <AtSign size={16} />
                  <Text>{t("profile.userTwitter")}:</Text>
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
        </Stack>
      </CardBody>
    </Card>
  );
}
