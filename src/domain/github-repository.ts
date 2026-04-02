import { z } from "zod";

export const githubRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.url(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  updated_at: z.iso.datetime(),
});

export type GithubRepository = z.infer<typeof githubRepositorySchema>;
