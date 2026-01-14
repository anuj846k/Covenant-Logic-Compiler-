"use client";
import { ExternalLink, Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import React from "react";

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Product",
    links: [
      { title: "Features", href: "#features" },
      { title: "How It Works", href: "#how-it-works" },
      { title: "Pricing", href: "#" },
      { title: "Demo", href: "/dashboard" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "About Us", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Documentation", href: "#" },
      { title: "API Docs", href: "#" },
      { title: "Help Center", href: "#" },
      { title: "LMA Standards", href: "#" },
    ],
  },
  {
    label: "Social",
    links: [
      { title: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
      { title: "Twitter", href: "https://twitter.com", icon: Twitter },
      { title: "GitHub", href: "https://github.com", icon: Github },
      { title: "YouTube", href: "https://youtube.com", icon: Youtube },
    ],
  },
];

export function Footer() {
  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 border-2 border-[#A4F1F5] rounded-full">
              <Image
                src="/logo.png"
                alt="Axiom Logo"
                fill
                className="object-contain rounded-full scale-150"
              />
            </div>
            <span className="font-bold text-xl tracking-tight">Axiom</span>
          </div>
          <p className="text-muted-foreground mt-4 text-sm max-w-xs">
            Transforming covenant compliance with AI-powered automation for
            syndicated loans.
          </p>
          <p className="text-muted-foreground text-xs mt-8">
            © {new Date().getFullYear()} Axiom. All rights reserved.
          </p>
          <Link
            href="https://www.lma.eu.com"
            target="_blank"
            className="flex items-center gap-1 text-xs mt-1 hover:text-blue-500 hover:cursor-pointer"
          >
            <Image src="/lma.ico" alt="Lma Logo" width={15} height={15} />
            Built during Lma edge Hackathon
            <ExternalLink size={12} />
          </Link>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold">{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="hover:text-foreground inline-flex items-center transition-all duration-300"
                      >
                        {link.icon && <link.icon className="me-1 size-4" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
