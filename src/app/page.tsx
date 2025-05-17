import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkillBadge from "@/components/skill-badge";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import TerminalJoke from "@/components/terminal-joke";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="font-bold text-xl">
            <span className="text-primary">Dev</span>Portfolio
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#about"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="#skills"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Skills
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Available for new opportunities
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                  Full-Stack Developer{" "}
                  <span className="text-primary">
                    Crafting Digital Experiences
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground pt-6">
                  Specializing in .NET, React, Angular, Vue, and modern database
                  solutions to build scalable, efficient applications.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="#contact">
                      Contact Me <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Link
                    href="https://github.com/enriquemartinez-emc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-6 w-6" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/enrique-martinez-centeno/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link
                    href="mailto:enrique.martinez.swe@outlook.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-6 w-6" />
                    <span className="sr-only">Email</span>
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-background to-background/50 rounded-lg flex items-start justify-center pt-0 mt-1">
                <TerminalJoke />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Me
              </h2>
              <div className="w-12 h-1 bg-primary my-4"></div>
              <p className="text-muted-foreground max-w-[700px]">
                Get to know more about my background and approach to software
                development
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg"></div>
                <Image
                  height={400}
                  width={600}
                  src="/developer-portrait.jpg"
                  alt="Developer portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">
                  Passionate Software Developer
                </h3>
                <p className="text-muted-foreground">
                  I&apos;m a full-stack developer with a passion for creating
                  elegant, efficient, and user-friendly applications. With
                  expertise in .NET, Vertical Slice Architecture, and modern
                  frontend frameworks, I bring a comprehensive approach to
                  software development.
                </p>
                <p className="text-muted-foreground">
                  My experience spans across various projects, working in
                  different areas to deliver scalable solutions that solve
                  real-world problems. I&apos;m particularly interested in
                  building applications that are not only functional but also
                  provide exceptional user experiences.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Name:</h4>
                    <p className="text-muted-foreground">Enrique Martinez</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Availability:</h4>
                    <p className="text-primary font-medium">
                      Open to opportunities
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Email:</h4>
                    <p className="text-muted-foreground">
                      enrique.martinez.swe@outlook.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Technical Skills
              </h2>
              <div className="w-12 h-1 bg-primary my-4"></div>
              <p className="text-muted-foreground max-w-[700px]">
                My expertise spans across various technologies and frameworks
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-bold mb-6">Backend Development</h3>
                <div className="flex flex-wrap gap-3">
                  <SkillBadge name=".NET Core" level={95} />
                  <SkillBadge name="C#" level={90} />
                  <SkillBadge name="ASP.NET" level={90} />
                  <SkillBadge name="Vertical Slice Architecture" level={85} />
                  <SkillBadge name="RESTful APIs" level={90} />
                  <SkillBadge name="Nestjs" level={80} />
                  <SkillBadge name="Spring Boot" level={70} />
                  <SkillBadge name="FastApi" level={70} />
                  <SkillBadge name="Microservices" level={85} />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6">Frontend Development</h3>
                <div className="flex flex-wrap gap-3">
                  <SkillBadge name="React" level={90} />
                  <SkillBadge name="Next.js" level={85} />
                  <SkillBadge name="Angular" level={80} />
                  <SkillBadge name="Vue.js" level={95} />
                  <SkillBadge name="Nuxt" level={80} />
                  <SkillBadge name="TypeScript" level={85} />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6">
                  Database Technologies
                </h3>
                <div className="flex flex-wrap gap-3">
                  <SkillBadge name="SQL Server" level={90} />
                  <SkillBadge name="PostgreSQL" level={85} />
                  <SkillBadge name="MongoDB" level={80} />
                  <SkillBadge name="Entity Framework" level={90} />
                  <SkillBadge name="Dapper" level={85} />
                  <SkillBadge name="Redis" level={75} />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6">DevOps & Tools</h3>
                <div className="flex flex-wrap gap-3">
                  <SkillBadge name="Git" level={95} />
                  <SkillBadge name="Docker" level={85} />
                  <SkillBadge name="CI/CD" level={80} />
                  <SkillBadge name="Azure" level={85} />
                  <SkillBadge name="Kubernetes" level={70} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Get In Touch
              </h2>
              <div className="w-12 h-1 bg-primary my-4"></div>
              <p className="text-muted-foreground max-w-[700px]">
                Interested in working together? Feel free to contact me for any
                project or collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-lg">Email</h3>
                <a
                  href="mailto:enrique.martinez.swe@outlook.com"
                  className="text-primary hover:underline"
                >
                  enrique.martinez.swe
                </a>
              </div>

              <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <Linkedin className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-lg">LinkedIn</h3>
                <a
                  href="https://linkedin.com/in/enrique-martinez-centeno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Enrique Martinez
                </a>
              </div>

              <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <Github className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-lg">GitHub</h3>
                <a
                  href="https://github.com/enriquemartinez-emc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  enriquemartinez-emc
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">
                <span className="text-primary">Dev</span>Portfolio
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Enrique Martinez. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
