import { caseStudies } from "@/data/case-studies";
import { profile } from "@/data/site";
import type { Repo } from "@/lib/github";

export default function WorkSection({ repos }: { repos: Repo[] }) {
  return (
    <section
      id="work"
      className="story-beat work-beat"
      aria-labelledby="work-title"
    >
      <div>
        <p className="eyebrow">Selected work</p>
        <h2 id="work-title">Public projects, private depth.</h2>
        <p>
          Most of my professional work is private, so these public repositories
          show how I structure and ship software.
        </p>
        {caseStudies.length > 0 ? (
          <ul className="work-grid">
            {caseStudies.map((study) => (
              <li key={study.title} className="work-card">
                <h3>{study.title}</h3>
                <p>{study.problem}</p>
                <p>{study.approach}</p>
                <p>{study.outcome}</p>
                <p className="work-meta">{study.stack.join(" / ")}</p>
              </li>
            ))}
          </ul>
        ) : null}
        {repos.length > 0 ? (
          <ul className="work-grid">
            {repos.map((repo) => (
              <li key={repo.name} className="work-card">
                <h3>
                  <a href={repo.url} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                </h3>
                <p>{repo.description}</p>
                <p className="work-meta">
                  {repo.language ? `${repo.language} / ` : ""}
                  Updated {new Date(repo.pushedAt).getUTCFullYear()}
                  {repo.homepage ? (
                    <>
                      {" / "}
                      <a href={repo.homepage} target="_blank" rel="noreferrer">
                        Live demo
                      </a>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        <a
          className="story-link"
          href={profile.githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          All repositories on GitHub →
        </a>
      </div>
    </section>
  );
}
