import ScrollToTop from "@/components/common/scroll-to-top";
import { ThemeProvider } from "@/components/theme/theme-context";
import { routing } from "@/i18n/routing";
import "@/styles/globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Script from "next/script";
import React from "react";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import notFound from "./not-found";

export const metadata: Metadata = {
  title: "Generative Hub App",
  description: "Generative Hub App: Powered by Forma NFTs",
  icons: "/favicon.ico",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  if (process.env.NODE_ENV === "production") console.log = () => {};

  return (
    <html lang={locale}>
      <body
        className={`bg-background text-text antialiased transition-colors duration-300 ease-out dark:bg-background-dark dark:text-text-dark`}
      >
        {process.env.NODE_ENV === "development" && (
          <>
            <Script
              crossOrigin="anonymous"
              src="//unpkg.com/react-scan/dist/auto.global.js"
              async
            />
          </>
        )}
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ScrollToTop />
            <Toaster closeButton richColors position="top-left" />
            <ThirdwebProvider>{children}</ThirdwebProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
