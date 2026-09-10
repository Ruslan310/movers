import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://northline-movers-vancouver.candy-note-7909.chatgpt.site"),
  title: "Northline Movers | Greater Vancouver Moving Company",
  description: "Careful apartment, house, café and restaurant moving across Greater Vancouver. Transparent quotes, insured local crews and seven-day availability.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Northline Movers | Greater Vancouver",
    description: "Your move. Handled beautifully.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Northline Movers in Greater Vancouver" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
