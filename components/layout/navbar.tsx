"use client";

import SkeletonImage from "@/components/skeleton/skeleton-image";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import CustomConnectButton from "@/components/thirdweb/connect-button";
import Dialog from "@/components/ui/dialog";
import useToggle from "@/hooks/use-state-toggle";
import client from "@/lib/client";
import { ArrowRight, Menu, Plus, User2Icon } from "lucide-react";
import Link from "next/link";
import { Blobbie, ConnectButton, useActiveAccount } from "thirdweb/react";
import DisconnectButton from "@/components/thirdweb/disconnect-button";

const Navbar = () => {
  const dialog = useToggle();
  const account = useActiveAccount();

  return (
    <>
      <div className="fixed z-50 h-[66px] w-full border-b border-border bg-background px-5 py-4 text-text transition-colors duration-300 ease-out dark:border-border-dark dark:bg-background-dark dark:text-text-dark">
        <div className="!container flex w-full items-center justify-between">
          <Link href="/">
            <SkeletonImage
              src="/logo.png"
              width="35px"
              height="35px"
              className="aspect-square rounded-full shadow"
              isPriority
            />
          </Link>
          <div className="flex items-center gap-4">
            <CustomConnectButton type={"icon"} />

            <div
              className={
                "flex h-[35px] w-10 items-center justify-center rounded-lg bg-nav shadow dark:bg-nav-dark"
              }
            >
              {account ? (
                <Link href={"/profile"} onClick={dialog.close}>
                  <Blobbie
                    address={`${account?.address}`}
                    className="h-6 w-6 rounded-full shadow"
                  />
                </Link>
              ) : (
                <div
                  className={
                    "h-6 w-6 animate-pulse rounded-full bg-neutral-400 shadow"
                  }
                ></div>
              )}
            </div>
            <div className="sr-only">
              <ConnectButton client={client} />
            </div>
            <div
              className="group relative flex h-[35px] w-10 cursor-pointer items-center justify-center rounded-lg border border-nav bg-nav shadow transition-colors ease-out hover:border-sky-500 dark:border-nav-dark dark:bg-nav-dark dark:hover:border-sky-500"
              onClick={dialog.toggle}
            >
              <span className="absolute inset-0 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 filter transition-all duration-300 ease-out group-hover:blur-[8px]" />
              <span className="relative">
                <Menu size={18} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <Dialog isOpen={dialog.isOpen} onClose={dialog.close} type="sidebar">
        <div className="flex w-full flex-col">
          {[
            {
              title: "Actions",
              content: (
                <div
                  className="flex items-center gap-3.5 pl-6 transition-colors hover:bg-border dark:hover:bg-border-dark"
                  onClick={dialog.close}
                >
                  <ThemeSwitcher />
                </div>
              ),
            },
            {
              title: "Navigation",
              content: (
                <>
                  <div
                    className="flex items-center pl-6 transition-colors hover:bg-border dark:hover:bg-border-dark"
                    onClick={dialog.close}
                  >
                    <Link
                      href="/"
                      className="w-full p-2.5 pl-0 transition-all ease-out hover:pl-2"
                    >
                      <div className="flex items-center gap-2.5 text-link">
                        <ArrowRight size={22} strokeWidth={1} />
                        <p>Home</p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="flex items-center pl-6 transition-colors hover:bg-border dark:hover:bg-border-dark"
                    onClick={dialog.close}
                  >
                    <Link
                      href="/buy"
                      className="w-full p-2.5 pl-0 transition-all ease-out hover:pl-2"
                    >
                      <div className="flex items-center gap-2.5 text-link">
                        <ArrowRight size={22} strokeWidth={1} />
                        <p>Buy NFT</p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="flex items-center pl-6 transition-colors hover:bg-border dark:hover:bg-border-dark"
                    onClick={dialog.close}
                  >
                    <Link
                      href="/sell"
                      className="w-full p-2.5 pl-0 transition-all ease-out hover:pl-2"
                    >
                      <div className="flex items-center gap-2.5 text-link">
                        <ArrowRight size={22} strokeWidth={1} />
                        <p>Sell NFT</p>
                      </div>
                    </Link>
                  </div>
                </>
              ),
            },
            {
              title: "Account",
              content: (
                <>
                  {account ? (
                    <>
                      <div
                        className="flex items-center pl-6 transition-colors hover:bg-border dark:hover:bg-border-dark"
                        onClick={dialog.close}
                      >
                        <Link
                          href="/profile"
                          className="w-full p-2.5 pl-0 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <User2Icon size={22} strokeWidth={1} />
                            <p>Profile</p>
                          </div>
                        </Link>
                      </div>
                      <div
                        className="flex items-center pl-6 transition-colors hover:bg-border dark:hover:bg-border-dark"
                        onClick={dialog.close}
                      >
                        <Link
                          href="/create"
                          className="w-full p-2.5 pl-0 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Plus size={22} strokeWidth={1} />
                            <p>Create</p>
                          </div>
                        </Link>
                      </div>
                      <div onClick={dialog.close}>
                        <DisconnectButton className="ml-0.5 pl-3" />
                      </div>
                    </>
                  ) : (
                    <div onClick={dialog.close}>
                      <CustomConnectButton className="ml-0.5 pl-3" />
                    </div>
                  )}
                </>
              ),
            },
          ].map((section, index) => (
            <div key={index} className="flex flex-col">
              <p className="bg-bluebg p-2.5 pl-6 text-sm text-textSecondary dark:bg-bluebg-dark dark:text-textSecondary-dark">
                {section.title}
              </p>
              {section.content}
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};
export default Navbar;
