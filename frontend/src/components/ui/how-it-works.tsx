"use client";

import { cn } from "@/lib/utils";
import { FileCheck, FileUp, Sparkles } from "lucide-react";
import type React from "react";

// The main props for the HowItWorks component
interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

// The props for a single step card
interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  delay?: number;
}

/**
 * A single step card within the "How It Works" section.
 * It displays an icon, title, description, and a list of benefits.
 */
const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
  delay = 0,
}) => (
  <div
    className={cn(
      "relative rounded-2xl border bg-card p-6 text-card-foreground transition-all duration-300 ease-in-out overflow-hidden group/card",
      "hover:scale-105 hover:shadow-lg hover:border-primary/50 hover:bg-muted"
    )}
  >
    {/* Staggered Border Beam */}
    <div
      style={
        {
          "--duration": 6,
          "--size": 300,
          "--color-from": "var(--color-cyan-400)",
          "--color-to": "var(--color-emerald-400)",
          "--delay": `${delay}s`,
        } as React.CSSProperties
      }
      className="pointer-events-none absolute inset-0 rounded-[inherit] [border:1.5px_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:calc(var(--delay)*-1)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]"
    />
    {/* Icon */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
      {icon}
    </div>
    {/* Title and Description */}
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="mb-6 text-muted-foreground">{description}</p>
    {/* Benefits List */}
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          </div>
          <span className="text-muted-foreground">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * A responsive "How It Works" section that displays a 3-step process.
 * It is styled with shadcn/ui theme variables to support light and dark modes.
 */
export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  ...props
}) => {
  const stepsData = [
    {
      icon: <FileUp className="h-6 w-6" />,
      title: "Upload Document",
      description:
        "Drop your LMA covenant definitions or credit agreement PDF.",
      benefits: [
        "Supports all major LMA formats",
        "Secure document processing",
        "Instant upload confirmation",
      ],
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Analysis",
      description:
        "Our AI extracts and interprets covenant logic automatically.",
      benefits: [
        "Understands complex legal language",
        "Encodes syndicate-standard logic",
        "Eliminates calculation ambiguity",
      ],
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Get Results",
      description:
        "Access shared verifiable logic and professional compliance certificates.",
      benefits: [
        "Shared Logic-as-Code output",
        "Standardized Syndicate reports",
        "Full audit trail for all lenders",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full bg-background py-16 sm:py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From complex legal prose to verifiable syndicate logic in three
            simple steps
          </p>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-12 w-full max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute left-[16.6667%] top-1/2 h-0.5 w-[66.6667%] -translate-y-1/2 bg-border overflow-hidden"
          >
            {/* Horizontal flow beam */}
            <div
              className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400 to-transparent w-32 animate-[move-beam_4s_linear_infinite]"
              style={{ animationDelay: "1s" }}
            />
          </div>
          {/* Use grid to align numbers with the card grid below */}
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                // Center the number within its grid column
                className="relative flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-primary text-primary-foreground font-semibold ring-4 ring-background"
              >
                {index + 1}
                {/* Glow for individual indicator numbers when "active" in sequence */}
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse blur-sm -z-10" />
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
              delay={index * 2} // Stagger delays: 0s, 2s, 4s
            />
          ))}
        </div>
      </div>
    </section>
  );
};
