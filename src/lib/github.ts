import { hiddenRepos, pinnedRepos, profile } from "@/data/site";

export type Repo = {
  name: string;
  description: string;
  language: string | null;
  url: string;
  homepage: string | null;
  pushedAt: string;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

const GITHUB_USER = profile.githubUser;
const EXCLUDED = new Set([
  GITHUB_USER,
  `${GITHUB_USER}.github.io`,
  ...hiddenRepos,
]);
const MAX_REPOS = 6;

/**
 * Runs at build time (static export). Only repos with a description are
 * shown, so the list never advertises unfinished work. Pinned repos come
 * first; the rest keep GitHub's most-recently-pushed order. Any failure
 * returns an empty list and the Work section falls back to a plain GitHub
 * link.
 */
export async function getFeaturedRepos(): Promise<Repo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      {
        headers: { Accept: "application/vnd.github+json" },
        // Next's fetch cache survives builds (and the CI cache), which would
        // publish a stale repo list. "no-store" would make the page dynamic,
        // so use a window short enough that every build refetches.
        next: { revalidate: 1 },
      },
    );
    if (!response.ok) return [];

    const repos = (await response.json()) as GitHubRepo[];
    const rank = (name: string) => {
      const index = pinnedRepos.indexOf(name);
      return index === -1 ? pinnedRepos.length : index;
    };
    return repos
      .filter(
        (repo) =>
          !repo.fork &&
          !repo.archived &&
          !EXCLUDED.has(repo.name) &&
          repo.description,
      )
      .sort((a, b) => rank(a.name) - rank(b.name))
      .slice(0, MAX_REPOS)
      .map((repo) => ({
        name: repo.name,
        description: repo.description ?? "",
        language: repo.language,
        url: repo.html_url,
        homepage: repo.homepage || null,
        pushedAt: repo.pushed_at,
      }));
  } catch {
    return [];
  }
}
