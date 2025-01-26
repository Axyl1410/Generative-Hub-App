"use client";

import Loading from "@/components/common/loading";
import client, { FORMA_SKETCHPAD } from "@/lib/client";
import { cn } from "@/lib/utils";
import { ThirdwebButtonProps } from "@/type";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  AccountBalance,
  AccountProvider,
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
} from "thirdweb/react";
import { Chain } from "thirdweb";

const ConnectButton: React.FC<ThirdwebButtonProps> = ({
  type = "text",
  className,
  ...props
}) => {
  const { connect } = useConnectModal();
  const account = useActiveAccount();

  const handleConnect = async () => {
    const wallet = await connect({
      client,
      chain: FORMA_SKETCHPAD,
      showThirdwebBranding: false,
      appMetadata: {
        name: "Generative Hub App",
        url: "https://generative-hub-app.vercel.app/",
        description: "Generative Hub App: Powered by Forma NFTs",
        logoUrl:
          "https://github.com/Axyl1410/Generative-Hub-App/blob/main/src/public/logo.png",
      },
      welcomeScreen: {
        title: "Generative Hub App",
        subtitle: "Generative Hub App: Powered by Forma NFTs",
      },
    }); // opens the connect modal
    console.log("connected to", wallet);
    toast.success("Connected to wallet");
  };

  return (
    <>
      {type === "text" ? (
        <div
          className={cn(
            "flex cursor-pointer items-center transition-colors hover:bg-border dark:hover:bg-border-dark",
            className
          )}
          onClick={handleConnect}
          {...props}
        >
          <div className="w-full p-2.5 transition-colors">
            <div className="flex items-center gap-2.5">
              <Wallet size={22} strokeWidth={1} />
              <p>Connect</p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          className={cn(
            "flex h-[35px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-nav p-2 text-sm shadow dark:bg-nav-dark",
            !account && "cursor-pointer"
          )}
          layout
          style={{ width: "auto" }}
          onClick={account ? undefined : handleConnect}
        >
          <motion.div layout>
            <Wallet />
          </motion.div>
          {account && (
            <AccountProvider address={`${account?.address}`} client={client}>
              <motion.div layout>
                <AccountBalance
                  chain={FORMA_SKETCHPAD}
                  loadingComponent={<Loading />}
                  fallbackComponent={<div>Failed to load</div>}
                />
              </motion.div>
            </AccountProvider>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ConnectButton;
