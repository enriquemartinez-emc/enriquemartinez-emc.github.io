import SpacePortfolio from "@/components/space-portfolio";
import { getFeaturedRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getFeaturedRepos();
  return <SpacePortfolio repos={repos} />;
}
