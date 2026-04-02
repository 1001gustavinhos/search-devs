import { githubUserSchema } from "../domain/github-user.ts";
import { octokit } from "../lib/octokit.ts";

export class GithubUserNotFoundError extends Error {
  constructor(username: string) {
    super(`GitHub user not found: ${username}`);
    this.name = "GithubUserNotFoundError";
  }
}

export async function getGithubUserByUsername(username: string) {
  try {
    const response = await octokit.request("GET /users/{username}", {
      username,
    });

    return githubUserSchema.parse(response.data);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 404
    ) {
      throw new GithubUserNotFoundError(username);
    }

    throw error;
  }
}
