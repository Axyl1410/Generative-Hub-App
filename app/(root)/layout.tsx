"use client";

import Navbar from "@/components/layout/navbar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import BackToTop from "@/components/common/back-to-top";
import Footer from "@/components/layout/footer";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <BackToTop />
      <div className="pt-[66px]">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-66px)] px-5"
        >
          <div className="container">{children}</div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
