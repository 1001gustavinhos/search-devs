import { z } from "zod";

export const githubUserSchema = z.object({
  id: z.number(),
  login: z.string(),
  avatar_url: z.url(),
  html_url: z.url(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  followers: z.number(),
  following: z.number(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  public_repos: z.number(),
  blog: z.string().nullable(),
  twitter_username: z.string().nullable(),
});

export type GithubUser = z.infer<typeof githubUserSchema>;
