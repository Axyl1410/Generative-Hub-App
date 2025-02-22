"use client";

import SkeletonImage from "@/components/skeleton/skeleton-image";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import CustomConnectButton from "@/components/thirdweb/connect-button";
import DisconnectButton from "@/components/thirdweb/disconnect-button";
import Dialog from "@/components/ui/modal";
import useToggle from "@/hooks/use-state-toggle";
import { Link } from "@/i18n/routing";
import client from "@/lib/client";
import { ArrowRight, Menu, Plus, User2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Blobbie, ConnectButton, useActiveAccount } from "thirdweb/react";
import { LocaleSwitcherDropdown } from "../common/locale-switcher";
import { GradientText } from "../ui/gradient-text";

const Navbar = () => {
  const t = useTranslations("navbar");
  const dialog = useToggle();
  const account = useActiveAccount();
  const menuItems = [
    { title: t("buy"), href: "/buy" },
    { title: t("sell"), href: "/sell" },
  ];
  const pathname = usePathname();
  return (
    <>
      <div className="dark:border-border-dark fixed z-50 h-[66px] w-full border-b border-border bg-background-light px-5 py-4 text-base text-text transition-colors duration-300 ease-out dark:bg-background-dark dark:text-text-dark">
        <div className="!container flex w-full items-center justify-between text-nowrap">
          <section className="flex items-center gap-2 lg:gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <SkeletonImage
                src="/logo.png"
                width="35px"
                height="35px"
                className="aspect-square rounded-full shadow"
                isPriority
              />
              <span className="hidden items-center justify-center gap-1.5 font-bold sm:flex">
                <GradientText
                  className="text-xl"
                  colors={["#ff8a00", "#e52e71", "#e52e71", "#ff8a00"]}
                  duration={2}
                >
                  Generative
                </GradientText>{" "}
                Hub App
              </span>
            </Link>
            <div className="ml-2 hidden gap-2 md:flex lg:ml-6 lg:gap-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-sm transition-colors hover:text-sky-600 lg:text-base ${
                    pathname.includes(item.href) ? "font-semibold" : ""
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-3">
            {account && (
              <Link href="/create">
                <button className="relative hidden items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-tl from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-medium text-white shadow-md ring-offset-background transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-50 md:flex md:gap-2 md:rounded-md md:font-semibold">
                  <Plus size={18} strokeWidth={2} />
                  <p>{t("create")}</p>
                </button>
              </Link>
            )}
            <div className="hidden lg:block">
              <LocaleSwitcherDropdown />
            </div>
            <CustomConnectButton type={"icon"} />
            <div className="flex h-[35px] w-10 items-center justify-center rounded-lg bg-nav shadow dark:bg-nav-dark">
              {account ? (
                <Link href="/profile" onClick={dialog.close}>
                  <Blobbie
                    address={account.address}
                    className="h-6 w-6 rounded-full shadow"
                  />
                </Link>
              ) : (
                <div className="h-6 w-6 animate-pulse rounded-full bg-neutral-400 shadow"></div>
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
      {/* Sidebar */}
      <Dialog isOpen={dialog.isOpen} onClose={dialog.close} type="sidebar">
        <div className="flex w-full flex-col">
          {[
            {
              content: (
                <Link href="/" className="flex items-center gap-2.5 py-3 pl-6">
                  <SkeletonImage
                    src="/logo.png"
                    width="22px"
                    height="22px"
                    className="aspect-square rounded-full shadow"
                    isPriority
                  />
                  <span className="flex items-center justify-center gap-1.5 font-bold">
                    <GradientText
                      className="text-md"
                      colors={["#ff8a00", "#e52e71", "#e52e71", "#ff8a00"]}
                      duration={2}
                    >
                      Generative
                    </GradientText>{" "}
                    Hub App
                  </span>
                </Link>
              ),
            },
            {
              title: "Actions",
              content: (
                <>
                  <div
                    className="dark:hover:bg-border-dark flex items-center gap-3.5 p-2.5 pl-6 transition-colors hover:bg-border md:hidden"
                    onClick={dialog.close}
                  >
                    <LocaleSwitcherDropdown />
                  </div>
                  <div
                    className="dark:hover:bg-border-dark flex items-center gap-3.5 pl-6 transition-colors hover:bg-border"
                    onClick={dialog.close}
                  >
                    <ThemeSwitcher />
                  </div>
                </>
              ),
            },
            {
              title: "Navigation",
              content: (
                <>
                  <Link
                    href="/buy"
                    className="dark:hover:bg-border-dark flex items-center p-2.5 pl-6 transition-colors hover:bg-border"
                    onClick={dialog.close}
                  >
                    <div className="flex items-center gap-2.5 text-link">
                      <ArrowRight size={22} strokeWidth={1} />
                      <p>{t("buy")}</p>
                    </div>
                  </Link>
                  <Link
                    href="/sell"
                    className="dark:hover:bg-border-dark flex items-center p-2.5 pl-6 transition-colors hover:bg-border"
                    onClick={dialog.close}
                  >
                    <div className="flex items-center gap-2.5 text-link">
                      <ArrowRight size={22} strokeWidth={1} />
                      <p>{t("sell")}</p>
                    </div>
                  </Link>
                </>
              ),
            },
            {
              title: "Account",
              content: account ? (
                <>
                  <Link
                    href="/profile"
                    className="dark:hover:bg-border-dark flex items-center p-2.5 pl-6 transition-colors hover:bg-border"
                    onClick={dialog.close}
                  >
                    <div className="flex items-center gap-2.5">
                      <User2Icon size={22} strokeWidth={1} />
                      <p>{t("profile")}</p>
                    </div>
                  </Link>
                  <Link
                    href="/create"
                    className="dark:hover:bg-border-dark flex items-center p-2.5 pl-6 transition-colors hover:bg-border"
                    onClick={dialog.close}
                  >
                    <div className="flex items-center gap-2.5">
                      <Plus size={22} strokeWidth={1} />
                      <p>{t("create")}</p>
                    </div>
                  </Link>
                  <div onClick={dialog.close}>
                    <DisconnectButton className="ml-0.5 pl-3" />
                  </div>
                </>
              ) : (
                <div onClick={dialog.close}>
                  <CustomConnectButton className="ml-0.5 pl-3" />
                </div>
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
