import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DonghuaStream — Streaming Donghua Gratuit & Legal",
  description:
    "Decouvrez les meilleurs donghua et animes chinois, legalement et gratuitement. Streaming HD, catalogue complet, sans pub.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          {/* Ambient background glows */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-[30%] left-1/2 h-[800px] w-[1000px] -translate-x-1/2 rounded-full bg-red-700/[0.04] blur-[150px]" />
            <div className="absolute top-[40%] -left-[10%] h-[600px] w-[600px] rounded-full bg-amber-600/[0.03] blur-[130px]" />
            <div className="absolute top-[70%] -right-[5%] h-[500px] w-[500px] rounded-full bg-red-900/[0.025] blur-[120px]" />
          </div>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
