import BackToTop from "@/components/common/back-to-top";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";
import notFound from "../not-found";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      <Navbar />
      <BackToTop />
      <div className="pt-[66px]">
        <div className="min-h-[calc(100vh-66px)] px-5">
          <NextIntlClientProvider messages={messages}>
            <div className="container">{children}</div>
          </NextIntlClientProvider>
        </div>
      </div>
      <Footer />
    </>
  );
}
