"use client";

import client, { FORMA_SKETCHPAD } from "@/lib/client";
import { cn } from "@/lib/utils";
import { ThirdwebButtonProps } from "@/type";
import { ArrowLeftRight } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useActiveWallet, useNetworkSwitcherModal } from "thirdweb/react";

const NetworkSwitcher: React.FC<ThirdwebButtonProps> = ({
  type = "text",
  className,
  ...props
}) => {
  const networkSwitcher = useNetworkSwitcherModal();
  const account = useActiveWallet();

  function handleClick() {
    if (!account) {
      toast.error("No wallet connected");
      return;
    }

    networkSwitcher
      .open({
        client,
        theme: "dark",
        sections: [
          {
            label: "Our Network",
            chains: [FORMA_SKETCHPAD],
          },
        ],
      })
      .then(() => {});
  }

  return (
    <>
      {type === "text" ? (
        <div
          className={cn(
            "flex cursor-pointer items-center transition-colors hover:bg-border dark:hover:bg-border-dark",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          <div className="w-full p-2.5 transition-colors">
            <div className="flex items-center gap-2.5">
              <ArrowLeftRight size={22} strokeWidth={1} />
              <p>Switch Network</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NetworkSwitcher;
