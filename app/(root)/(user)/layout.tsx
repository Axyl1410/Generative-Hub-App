"use client";

import SkeletonImage from "@/components/skeleton/skeleton-image";
import ConnectButton from "@/components/thirdweb/connect-button";
import Dialog from "@/components/ui/dialog";
import useToggle from "@/hooks/use-state-toggle";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();
  const dialog = useToggle();

  useEffect(() => {
    if (account) dialog.close();
    else dialog.open();
  }, [account, dialog]);

  return (
    <>
      {children}
      <Dialog
        isOpen={dialog.isOpen}
        onClose={() => {
          if (!account) redirect("/");
          else dialog.close();
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="grid w-full place-items-center">
            <SkeletonImage
              src={"/logo.png"}
              height={"50px"}
              width={"50px"}
              className="rounded-full"
            />
          </div>
          <h1 className="text-center text-3xl font-bold">Connect Wallet</h1>
          <p>Please connect your wallet to continue.</p>
          <ConnectButton className="bg-border dark:bg-border-dark" />
        </div>
      </Dialog>
    </>
  );
}
