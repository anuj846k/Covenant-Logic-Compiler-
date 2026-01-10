import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Axiom | AI-Powered Covenant Logic Compiler",
  description:
    "Transform legal covenant definitions into executable Python code. Eliminate 49+ hours of manual work per loan quarter with AI-powered compliance automation.",
  keywords: [
    "covenant compliance",
    "loan monitoring",
    "LMA",
    "syndicated loans",
    "compliance automation",
    "fintech",
    "Axiom",
  ],
  authors: [{ name: "Axiom Team" }],
  openGraph: {
    title: "Axiom | AI-Powered Covenant Logic Compiler",
    description:
      "Transform legal covenant definitions into executable Python code. Automated compliance for syndicated loans.",
    type: "website",
    locale: "en_US",
    siteName: "Axiom",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axiom | AI-Powered Covenant Logic Compiler",
    description:
      "Transform legal covenant definitions into executable Python code. Automated compliance for syndicated loans.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.variable} antialiased min-h-screen flex flex-col`}
        style={{ fontFamily: "var(--font-mona-sans)" }}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
