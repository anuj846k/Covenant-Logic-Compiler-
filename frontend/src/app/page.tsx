"use client";

import { FeaturesGrid } from "@/components/features-grid";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { HowItWorks } from "@/components/ui/how-it-works";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Content constants for maintainability
const HERO_CONTENT = {
  badge: "New: AI Logic Compiler",
  headline: "Compliance Feels Empty Without",
  headlineAccent: "Accuracy",
  description:
    "We translate complex legal prose into verifiable digital logic. Eliminate 49 hours of manual ambiguity per loan, per quarter.",
} as const;

const STATS = [
  {
    icon: Zap,
    value: "49h",
    label: "Saved / Qtr",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Accuracy",
  },
  {
    icon: Users,
    value: "15+",
    label: "Banks Sync",
  },
] as const;

// Reusable stat card component
function StatCard({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-card p-4 rounded-xl shadow-sm border",
        className
      )}
    >
      <div className="bg-secondary p-2.5 rounded-lg">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div>
        <div className="text-2xl font-bold leading-none text-foreground">
          {value}
        </div>
        <div className="text-xs text-muted-foreground font-medium mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <BackgroundPaths>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
                <div className="space-y-6 opacity-0 animate-fade-in-up">
                  <div className="inline-flex items-center justify-center lg:justify-start">
                    <span className="inline-flex items-center rounded-full border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {HERO_CONTENT.badge}
                    </span>
                  </div>
                  <h1
                    id="hero-heading"
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-foreground leading-tight"
                  >
                    {HERO_CONTENT.headline.split(" ").map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="inline-block mr-2 last:mr-0"
                      >
                        {word.split("").map((letter, letterIndex) => (
                          <motion.span
                            key={`${wordIndex}-${letterIndex}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              delay: wordIndex * 0.1 + letterIndex * 0.03,
                              type: "spring",
                              stiffness: 150,
                              damping: 25,
                            }}
                            className="inline-block"
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </span>
                    ))}{" "}
                    <span className="text-primary inline-block">
                      {HERO_CONTENT.headlineAccent
                        .split("")
                        .map((letter, letterIndex) => (
                          <motion.span
                            key={`accent-${letterIndex}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              delay:
                                HERO_CONTENT.headline.split(" ").length * 0.1 +
                                letterIndex * 0.03,
                              type: "spring",
                              stiffness: 150,
                              damping: 25,
                            }}
                            className="inline-block"
                          >
                            {letter}
                          </motion.span>
                        ))}
                    </span>
                  </h1>
                  <p className="max-w-[600px] mx-auto lg:mx-0 text-muted-foreground md:text-lg leading-relaxed">
                    {HERO_CONTENT.description}
                  </p>
                </div>

                {/* Stats Cards Row */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 opacity-0 animate-fade-in-up animation-delay-100"
                  role="list"
                  aria-label="Key statistics"
                >
                  {STATS.map((stat, index) => (
                    <StatCard
                      key={index}
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                    />
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start opacity-0 animate-fade-in-up animation-delay-200">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="h-12 px-6 text-base focus-ring w-full sm:w-auto"
                    >
                      Start Compiling <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-6 text-base focus-ring w-full sm:w-auto"
                    >
                      View Interactive Demo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Visual (Hero Image) with Enhanced Blending */}
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none aspect-[4/3] opacity-0 animate-fade-in-up animation-delay-300 group/hero">
                {/* Backing Glow / Aura to bridge with background */}
                <div className="absolute inset-x-0 inset-y-8 bg-cyan-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />

                <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl bg-card border mask-[radial-gradient(circle_at_center,white_85%,transparent_100%)]">
                  <Image
                    src="/hero.png"
                    alt="Covenant Logic Compiler Interface showing AI-powered covenant analysis"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                </div>
              </div>
            </div>
          </div>
        </BackgroundPaths>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 md:py-24 bg-secondary/30"
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              What We Deliver
            </span>
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-foreground max-w-2xl"
            >
              The Operating System for Syndicated Loans
            </h2>
          </div>

          <FeaturesGrid />
        </div>
      </section>

      {/* See It In Action Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              See It In Action
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-2xl">
              Enterprise-Grade Covenant Management
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              From code generation to compliance certificates, see how Axiom
              streamlines your entire workflow.
            </p>
          </div>

          <StickyScroll
            content={[
              {
                title: "Real-Time Dashboard",
                description:
                  "Monitor all covenant metrics in one place with instant status updates and trend analysis. Track compliance across all your syndicated loans.",
                content: (
                  <Image
                    src="/dashboard.png"
                    alt="Axiom Dashboard"
                    fill
                    className="object-cover rounded-lg"
                  />
                ),
              },
              {
                title: "Verifiable Digital Logic",
                description:
                  "AI translates legal definitions into clean, shareable logic that acts as a 'Digital Twin' of your contract. No more manual calculation ambiguity.",
                content: (
                  <Image
                    src="/code-editor.png"
                    alt="Code Editor"
                    fill
                    className="object-cover rounded-lg"
                  />
                ),
              },
              {
                title: "Advanced Analytics",
                description:
                  "Deep insights into covenant performance with interactive charts and 100% compliance tracking. Visualize trends over time.",
                content: (
                  <Image
                    src="/analytics.png"
                    alt="Analytics Dashboard"
                    fill
                    className="object-cover rounded-lg"
                  />
                ),
              },
              {
                title: "Compliance Certificates",
                description:
                  "Generate professional, audit-ready PDF certificates with official seals and signatures. Full audit trail included.",
                content: (
                  <Image
                    src="/certificate.png"
                    alt="Compliance Certificate"
                    fill
                    className="object-cover rounded-lg"
                  />
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* How it Works Section */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Automate Your Covenant Compliance?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Join the leading financial institutions using Axiom to eliminate
              manual covenant monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-6 text-base focus-ring w-full sm:w-auto"
                >
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-12 px-6 text-base focus-ring w-full sm:w-auto text-primary-foreground hover:bg-primary-foreground/20 border border-primary-foreground/40"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
