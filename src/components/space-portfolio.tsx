"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import GameScene from "@/components/game-scene";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const jokes = [
  "Compiling confidence... 99%",
  "There is no place like 127.0.0.1.",
  "Ship small. Observe closely. Improve often.",
];
const skillGroups = [
  ["FRONTEND", "React / Next.js / Vue / Angular"],
  ["BACKEND", ".NET / C# / APIs / NestJS"],
  ["DATA", "PostgreSQL / SQL Server / MongoDB"],
  ["SYSTEMS", "Docker / Azure / CI/CD / Git / AI"],
];

const subscribeToYear = () => () => {};
const getCurrentYear = () => new Date().getFullYear();
const getServerYear = () => undefined;

export default function SpacePortfolio() {
  const root = useRef<HTMLElement>(null);
  const sceneProgress = useRef(0);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [landing, setLanding] = useState(false);
  const [hasStartedJourney, setHasStartedJourney] = useState(false);
  const [atJourneyEnd, setAtJourneyEnd] = useState(false);
  const year = useSyncExternalStore(
    subscribeToYear,
    getCurrentYear,
    getServerYear,
  );
  const joke = jokes[jokeIndex];
  const scrollCue = atJourneyEnd
    ? {
        href: "#launch",
        label: "Back to top",
        ariaLabel: "Return to the top of the portfolio",
        arrow: "↑",
      }
    : {
        href: "#about",
        label: "Scroll to explore",
        ariaLabel: "Scroll to explore the portfolio",
        arrow: "↓",
      };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setJokeIndex((index) => (index + 1) % jokes.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const endBeat = root.current?.querySelector(".end-beat");
    if (!endBeat) return;

    const observer = new IntersectionObserver(
      ([entry]) => setAtJourneyEnd(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(endBeat);
    return () => observer.disconnect();
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
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".journey",
          start: "top top",
          end: "+=5600",
          scrub: 1,
          pin: ".journey-canvas",
          anticipatePin: 1,
        },
      });
      timeline.to({}, { duration: 1 }, 0);
      timeline.to(".signal-frontend", { autoAlpha: 1, duration: 0.2 }, 0.18);
      timeline.to(".signal-backend", { autoAlpha: 1, duration: 0.2 }, 0.3);
      timeline.to(".signal-data", { autoAlpha: 1, duration: 0.2 }, 0.42);
      timeline.to(".signal-systems", { autoAlpha: 1, duration: 0.2 }, 0.54);
      gsap.to(".skill-signal", {
        y: (index) => (index % 2 === 0 ? -10 : 10),
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
      });
      let wasLanding = false;
      timeline.eventCallback("onUpdate", () => {
        const progress = timeline.progress();
        sceneProgress.current = progress;
        const nextLanding = progress >= 0.72;
        if (nextLanding !== wasLanding) {
          wasLanding = nextLanding;
          setLanding(nextLanding);
        }
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
            Send signal
          </a>
        </nav>
      </header>
      <section className="journey" aria-label="Enrique's software expedition">
        <div className="journey-canvas">
          <GameScene progressRef={sceneProgress} />
          <div
            className={`skill-signals${landing ? " is-landing" : ""}`}
            aria-hidden="true"
          >
            <span className="skill-signal signal-frontend">Frontend</span>
            <span className="skill-signal signal-backend">Backend</span>
            <span className="skill-signal signal-data">Data</span>
            <span className="skill-signal signal-systems">Systems</span>
          </div>
        </div>
        <div className="journey-content">
          <section id="launch" className="story-beat landing">
            <div>
              <p className="eyebrow">01 / Landing sequence complete</p>
              <h1>
                Enrique
                <br />
                <span>Martinez</span>
              </h1>
              <p>
                Full-stack developer building useful, durable software from
                first signal to production.
              </p>
              <a className="story-link" href="#about">
                Begin the walk ↓
              </a>
            </div>
          </section>
          <section id="about" className="story-beat right">
            <div>
              <p className="eyebrow">02 / The walk begins</p>
              <h2>Make the complex feel navigable.</h2>
              <p>
                I build thoughtful web applications across frontend and backend
                systems. The work is equal parts clear architecture, practical
                delivery, and an interface people want to use.
              </p>
            </div>
          </section>
          <section id="skills" className="story-beat">
            <div>
              <p className="eyebrow">03 / Discoveries logged</p>
              <h2>A trail of working knowledge.</h2>
              <div className="skill-list">
                {skillGroups.map(([label, technologies]) => (
                  <span key={label}>
                    {label} / {technologies}
                  </span>
                ))}
              </div>
            </div>
          </section>
          <section id="contact" className="story-beat right">
            <div>
              <p className="eyebrow">04 / Comms waypoint</p>
              <h2>Open channel.</h2>
              <p>For a new build, a hard problem, or a useful conversation:</p>
              <a
                className="contact-email story-link"
                href="mailto:enrique.martinez.swe@outlook.com"
              >
                enrique.martinez.swe@outlook.com
              </a>
            </div>
          </section>
          <section id="arrival" className="story-beat right">
            <div>
              <p className="eyebrow">05 / Planetfall</p>
              <h2>Past the horizon.</h2>
              <p>
                The flight settles into its final state: a place for clear
                systems, useful software, and the next problem worth solving.
              </p>
              <a
                className="story-link"
                href="https://github.com/enriquemartinez-emc"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub →
              </a>
            </div>
          </section>
          <section className="story-beat end-beat">
            <div>
              <p className="eyebrow">06 / Expedition complete</p>
              <h2>Keep exploring.</h2>
              <p>{joke}</p>
              <a className="story-link" href="#launch">
                Return to launch ↑
              </a>
            </div>
          </section>
        </div>
        {!hasStartedJourney || atJourneyEnd ? (
          <a
            className="scroll-cue"
            href={scrollCue.href}
            aria-label={scrollCue.ariaLabel}
          >
            <span className="scroll-cue-label">{scrollCue.label}</span>
            <span className="scroll-cue-arrow" aria-hidden="true">
              {scrollCue.arrow}
            </span>
          </a>
        ) : null}
      </section>
      <footer className="site-footer">
        © {year} Enrique Martinez. Built for the long walk.
      </footer>
    </main>
  );
}
