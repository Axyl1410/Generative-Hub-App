"use client";

import SkeletonImage from "@/components/skeleton/skeleton-image";
import ConnectButton from "@/components/thirdweb/connect-button";
import Dialog from "@/components/ui/dialog";
import useToggle from "@/hooks/use-state-toggle";
import { redirect } from "next/navigation";
import React, { memo, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

const WalletDialog = memo(() => (
  <div className="flex flex-col gap-4">
    <div className="grid w-full place-items-center">
      <SkeletonImage
        src="/logo.png"
        height="50px"
        width="50px"
        className="rounded-full"
      />
    </div>
    <h1 className="text-center text-3xl font-bold">Connect Wallet</h1>
    <p className="text-center text-gray-600 dark:text-gray-400">
      Please connect your wallet to continue.
    </p>
    <ConnectButton className="w-full bg-border dark:bg-border-dark" />
  </div>
));

WalletDialog.displayName = "WalletDialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();
  const dialog = useToggle();

  useEffect(() => {
    if (account) dialog.close();
    else dialog.open();
  }, [account, dialog]);

  const handleClose = () => {
    if (!account) redirect("/");
    else dialog.close();
  };

  return (
    <>
      {children}
      <Dialog isOpen={dialog.isOpen} onClose={handleClose}>
        <WalletDialog />
      </Dialog>
    </>
  );
}
