"use client";

import { cn } from "@/lib/utils";
import { ThirdwebButtonProps } from "@/types";
import { Unplug } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

const DisconnectButton: React.FC<ThirdwebButtonProps> = ({
  type = "text",
  className,
  ...props
}) => {
  const { disconnect } = useDisconnect();
  const account = useActiveWallet();
  const wallet = useActiveWallet();

  const handleDisconnect = async () => {
    if (account) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      disconnect(wallet);
      toast.success("Disconnected from wallet");
    } else toast.error("No wallet connected");
  };

  return (
    <>
      {type === "text" ? (
        <div
          className={cn(
            "flex cursor-pointer items-center transition-colors hover:bg-border dark:hover:bg-border-dark",
            className
          )}
          onClick={handleDisconnect}
          {...props}
        >
          <div className="w-full p-2.5 transition-colors">
            <div className="flex items-center gap-2.5">
              <Unplug size={22} strokeWidth={1} />
              <p>Disconnect</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default DisconnectButton;
