"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
] as const;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-ring rounded-lg group"
          aria-label="Axiom - Home"
        >
          <div className="relative w-11 h-11 transition-transform group-hover:scale-105 border-2 border-[#A4F1F5] rounded-full">
            <Image
              src="/logo.png"
              alt="Axiom Logo"
              fill
              className="object-contain rounded-full scale-150"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Axiom
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1" role="menubar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg px-4 py-2"
              role="menuitem"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <Button size="sm" className="focus-ring">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
              className="focus-ring"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-75">
            <SheetHeader className="border-b pb-4 mb-6">
              <SheetTitle className="flex items-center gap-2">
                <div className="relative w-6 h-6">
                  <Image
                    src="/logo.png"
                    alt="Axiom Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>Axiom</span>
              </SheetTitle>
            </SheetHeader>
            <nav
              className="flex flex-col space-y-2"
              role="menu"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg px-3 py-3 hover:bg-accent"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <hr className="my-4" />
              <SheetClose asChild className="p-3">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full focus-ring"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild className="p-3">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button className="w-full focus-ring" size="lg">
                    Get Started
                  </Button>
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
