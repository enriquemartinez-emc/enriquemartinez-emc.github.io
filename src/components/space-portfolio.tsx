"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GameScene from "@/components/game-scene";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const jokes = ["Compiling confidence... 99%", "There is no place like 127.0.0.1.", "Ship small. Observe closely. Improve often."];
const skillGroups = [["FRONTEND", "React / Next.js / Vue / Angular"], ["BACKEND", ".NET / C# / APIs / NestJS"], ["DATA", "PostgreSQL / SQL Server / MongoDB"], ["SYSTEMS", "Docker / Azure / CI/CD / Git / AI"]];

export default function SpacePortfolio() {
  const root = useRef<HTMLElement>(null);
  const sceneProgress = useRef(0);
  const [jokeIndex, setJokeIndex] = useState(0);
  const joke = jokes[jokeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setJokeIndex((index) => (index + 1) % jokes.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reducedMotion || !desktop) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const timeline = gsap.timeline({ scrollTrigger: { trigger: ".journey", start: "top top", end: "+=5600", scrub: 1, pin: ".journey-canvas", anticipatePin: 1 } });
    timeline
      .to(".planet", { scale: 1.35, x: "-10vw", duration: 2.8, ease: "none" }, 0.8)
      .to(".skill-signal", { autoAlpha: 1, stagger: 0.22, duration: 0.3 }, 1.1)
      .to(".terminal-screen", { autoAlpha: 1, y: 0, duration: 0.5 }, 3.85);
    timeline.eventCallback("onUpdate", () => {
      sceneProgress.current = timeline.progress();
    });
    return () => { lenis.destroy(); lenis.off("scroll", ScrollTrigger.update); gsap.ticker.remove(update); };
  }, { scope: root });

  return <main className="space-site" ref={root}>
    <header className="site-nav"><Link href="#launch" className="wordmark"><span>EM</span>{" // expedition"}</Link><nav className="nav-links" aria-label="Portfolio navigation"><Link href="#about">About</Link><a href="https://github.com/enriquemartinez-emc" target="_blank" rel="noreferrer">GitHub</a><a className="nav-signal" href="mailto:enrique.martinez.swe@outlook.com">Send signal</a></nav></header>
    <section className="journey" aria-label="Enrique's software expedition">
      <div className="journey-canvas"><GameScene progressRef={sceneProgress} /><div className="scene-fallback" aria-hidden="true"><div className="star-field" /><div className="moon" /><div className="planet" /><div className="terminal-screen">$ planetfall --status=locked<p>{joke}</p></div></div><div className="skill-signals" aria-hidden="true"><span className="skill-signal signal-frontend">Frontend</span><span className="skill-signal signal-backend">Backend</span><span className="skill-signal signal-data">Data</span><span className="skill-signal signal-systems">Systems</span></div></div>
      <div className="journey-content">
        <section id="launch" className="story-beat landing"><div><p className="eyebrow">01 / Landing sequence complete</p><h1>Enrique<br /><span>Martinez</span></h1><p>Full-stack developer building useful, durable software from first signal to production.</p><a className="story-link" href="#about">Begin the walk ↓</a></div></section>
        <section id="about" className="story-beat right"><div><p className="eyebrow">02 / The walk begins</p><h2>Make the complex feel navigable.</h2><p>I build thoughtful web applications across frontend and backend systems. The work is equal parts clear architecture, practical delivery, and an interface people want to use.</p></div></section>
        <section id="skills" className="story-beat"><div><p className="eyebrow">03 / Discoveries logged</p><h2>A trail of working knowledge.</h2><div className="skill-list">{skillGroups.map(([label, technologies]) => <span key={label}>{label} / {technologies}</span>)}</div></div></section>
        <section id="contact" className="story-beat right"><div><p className="eyebrow">04 / Comms waypoint</p><h2>Open channel.</h2><p>For a new build, a hard problem, or a useful conversation:</p><a className="contact-email story-link" href="mailto:enrique.martinez.swe@outlook.com">enrique.martinez.swe@outlook.com</a></div></section>
        <section id="arrival" className="story-beat right"><div><p className="eyebrow">05 / Planetfall</p><h2>Past the horizon.</h2><p>The flight settles into its final state: a place for clear systems, useful software, and the next problem worth solving.</p><a className="story-link" href="https://github.com/enriquemartinez-emc" target="_blank" rel="noreferrer">View GitHub →</a></div></section>
        <section className="story-beat end-beat"><div><p className="eyebrow">06 / Expedition complete</p><h2>Keep exploring.</h2><p>{joke}</p><a className="story-link" href="#launch">Return to launch ↑</a></div></section>
      </div>
    </section>
    <footer className="site-footer">© {new Date().getFullYear()} Enrique Martinez. Built for the long walk.</footer>
  </main>;
}
