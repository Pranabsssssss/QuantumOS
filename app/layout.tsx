import type { Metadata } from "next";
import { Orbitron, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quantum OS",
  description: "High-end browser-based Web OS",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${orbitron.variable} ${sora.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="h-full w-full overflow-hidden m-0 p-0">{children}</body>
    </html>
  );
}
