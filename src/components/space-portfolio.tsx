"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import GameScene from "@/components/game-scene";
import WorkSection from "@/components/work-section";
import type { Repo } from "@/lib/github";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const jokes = [
  "Compiling confidence... 99%",
  "There is no place like 127.0.0.1.",
  "Ship small. Observe closely. Improve often.",
];
const skillGroups = [
  ["Frontend", "React / Next.js / Vue / Angular"],
  ["Backend", ".NET / C# / APIs / NestJS"],
  ["Data", "PostgreSQL / SQL Server / MongoDB"],
  ["Systems", "Docker / Azure / CI/CD / Git / AI"],
];

const subscribeToYear = () => () => {};
const getCurrentYear = () => new Date().getFullYear();
const getServerYear = () => undefined;

export default function SpacePortfolio({ repos }: { repos: Repo[] }) {
  const root = useRef<HTMLElement>(null);
  const sceneProgress = useRef(0);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [hasStartedJourney, setHasStartedJourney] = useState(false);
  const year = useSyncExternalStore(
    subscribeToYear,
    getCurrentYear,
    getServerYear,
  );
  const joke = jokes[jokeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setJokeIndex((index) => (index + 1) % jokes.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: "#about",
        start: "top bottom",
        onEnter: () => setHasStartedJourney(true),
        onLeaveBack: () => setHasStartedJourney(false),
      });

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      if (reducedMotion || !desktop) return;

      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      const update = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
      // The canvas is sticky, so the flight is scrubbed by the page's own
      // scroll instead of a pinned spacer that delays the content.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".journey-content",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      timeline.to({}, { duration: 1 }, 0);
      timeline.to(".signal-frontend", { autoAlpha: 1, duration: 0.1 }, 0.12);
      timeline.to(".signal-backend", { autoAlpha: 1, duration: 0.1 }, 0.2);
      timeline.to(".signal-data", { autoAlpha: 1, duration: 0.1 }, 0.28);
      timeline.to(".signal-systems", { autoAlpha: 1, duration: 0.1 }, 0.36);
      timeline.to(".skill-signal", { autoAlpha: 0, duration: 0.1 }, 0.58);
      gsap.to(".skill-signal", {
        y: (index) => (index % 2 === 0 ? -10 : 10),
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
      });
      timeline.eventCallback("onUpdate", () => {
        sceneProgress.current = timeline.progress();
      });
      return () => {
        lenis.destroy();
        lenis.off("scroll", ScrollTrigger.update);
        gsap.ticker.remove(update);
      };
    },
    { scope: root },
  );

  return (
    <main className="space-site" ref={root}>
      <header className="site-nav">
        <Link href="#launch" className="wordmark">
          <span>EM</span>
          {" // expedition"}
        </Link>
        <nav className="nav-links" aria-label="Portfolio navigation">
          <Link href="#work">Work</Link>
          <Link href="#about">About</Link>
          <a
            href="https://github.com/enriquemartinez-emc"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="nav-signal"
            href="mailto:enrique.martinez.swe@outlook.com"
          >
            Contact
          </a>
        </nav>
      </header>
      <section className="journey" aria-label="Enrique's software portfolio">
        <div className="journey-canvas">
          <GameScene progressRef={sceneProgress} />
          <div className="skill-signals" aria-hidden="true">
            <span className="skill-signal signal-frontend">Frontend</span>
            <span className="skill-signal signal-backend">Backend</span>
            <span className="skill-signal signal-data">Data</span>
            <span className="skill-signal signal-systems">Systems</span>
          </div>
        </div>
        <div className="journey-content">
          <section id="launch" className="story-beat landing">
            <div className="landing-copy">
              <p className="eyebrow">Full-stack developer</p>
              <h1>
                Enrique
                <br />
                <span>Martinez</span>
              </h1>
              <p>
                I build useful, durable software across the stack: .NET and C#
                backends, React and Next.js frontends, PostgreSQL, and Azure.
              </p>
              <div className="hero-actions">
                <a className="story-link" href="#work">
                  View work ↓
                </a>
                <a
                  className="story-link"
                  href="https://github.com/enriquemartinez-emc"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub →
                </a>
                <a
                  className="story-link"
                  href="mailto:enrique.martinez.swe@outlook.com"
                >
                  Contact →
                </a>
              </div>
            </div>
          </section>
          <section
            id="about"
            className="story-beat right"
            aria-labelledby="about-title"
          >
            <div>
              <p className="eyebrow">About</p>
              <h2 id="about-title">Clear architecture, practical delivery.</h2>
              <p>
                I build thoughtful web applications across frontend and backend
                systems. The work is equal parts clear architecture, practical
                delivery, and an interface people want to use.
              </p>
            </div>
          </section>
          <section
            id="skills"
            className="story-beat"
            aria-labelledby="skills-title"
          >
            <div>
              <p className="eyebrow">Skills</p>
              <h2 id="skills-title">What I work with.</h2>
              <ul className="skill-list">
                {skillGroups.map(([label, technologies]) => (
                  <li key={label}>
                    <strong>{label}</strong> / {technologies}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <WorkSection repos={repos} />
          <section
            id="contact"
            className="story-beat right"
            aria-labelledby="contact-title"
          >
            <div>
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Let&apos;s talk.</h2>
              <p>For a new build, a hard problem, or a useful conversation:</p>
              <a
                className="contact-email story-link"
                href="mailto:enrique.martinez.swe@outlook.com"
              >
                enrique.martinez.swe@outlook.com
              </a>
            </div>
          </section>
        </div>
        {!hasStartedJourney ? (
          <a
            className="scroll-cue"
            href="#about"
            aria-label="Scroll to explore the portfolio"
          >
            <span className="scroll-cue-label">Scroll to explore</span>
            <span className="scroll-cue-arrow" aria-hidden="true">
              ↓
            </span>
          </a>
        ) : null}
      </section>
      <footer className="site-footer">
        © {year} Enrique Martinez. {joke}
      </footer>
    </main>
  );
}
