import { afterEach, describe, expect, it, vi } from "vitest";
import { getFeaturedRepos } from "./github";

const repo = (overrides: Record<string, unknown> = {}) => ({
  name: "demo",
  description: "A demo",
  language: "TypeScript",
  html_url: "https://github.com/enriquemartinez-emc/demo",
  homepage: "",
  pushed_at: "2026-01-01T00:00:00Z",
  fork: false,
  archived: false,
  ...overrides,
});

const mockFetch = (body: unknown, ok = true) =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: async () => body }),
  );

afterEach(() => vi.unstubAllGlobals());

describe("getFeaturedRepos", () => {
  it("keeps only described, non-fork, non-archived, non-site repos", async () => {
    mockFetch([
      repo({ name: "keep" }),
      repo({ name: "no-description", description: null }),
      repo({ name: "forked", fork: true }),
      repo({ name: "old", archived: true }),
      repo({ name: "enriquemartinez-emc" }),
      repo({ name: "enriquemartinez-emc.github.io" }),
      repo({ name: "window-shop" }),
      repo({ name: "habits-tracker-app" }),
    ]);

    const repos = await getFeaturedRepos();

    expect(repos.map((item) => item.name)).toEqual(["keep"]);
  });

  it("puts pinned repos first, in pinned order, and keeps the rest in API order", async () => {
    mockFetch([
      repo({ name: "recent" }),
      repo({ name: "vitrum" }),
      repo({ name: "older" }),
      repo({ name: "DevDesk" }),
    ]);

    const repos = await getFeaturedRepos();

    expect(repos.map((item) => item.name)).toEqual([
      "DevDesk",
      "vitrum",
      "recent",
      "older",
    ]);
  });

  it("maps fields and turns an empty homepage into null", async () => {
    mockFetch([
      repo({ homepage: "" }),
      repo({ name: "live", homepage: "https://x.dev" }),
    ]);

    const [first, second] = await getFeaturedRepos();

    expect(first).toMatchObject({
      url: "https://github.com/enriquemartinez-emc/demo",
      homepage: null,
      language: "TypeScript",
    });
    expect(second.homepage).toBe("https://x.dev");
  });

  it("limits the list to six repos", async () => {
    mockFetch(
      Array.from({ length: 10 }, (_, i) => repo({ name: `repo-${i}` })),
    );

    expect(await getFeaturedRepos()).toHaveLength(6);
  });

  it("returns an empty list when the API responds with an error", async () => {
    mockFetch({ message: "rate limited" }, false);

    expect(await getFeaturedRepos()).toEqual([]);
  });

  it("returns an empty list when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    expect(await getFeaturedRepos()).toEqual([]);
  });
});
