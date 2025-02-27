"use client";

import BackButton from "@/components/common/back-button";
import Dialog from "@/components/ui/modal";
import useToggle from "@/hooks/use-state-toggle";
import { Link } from "@/i18n/routing";
import { ArrowRight, ImageIcon, LayoutGrid, Stars} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("create");
  const modal = useToggle();

  return (
    <div className={"mt-10 flex w-full justify-center"}>
      <div className={"flex max-w-2xl flex-col gap-4 lg:px-16"}>
        <div className="flex w-full items-center justify-between">
          <h1 className={"text-3xl font-bold"}>{t("title")}</h1>
          <BackButton href={"/"} className={"w-fit"} />
        </div>

        <div className={"flex flex-col gap-4"}>
          <Link href={"/create/collection"}>
            <div
              className={
                "group relative flex w-full items-center justify-between gap-8 rounded-lg border border-gray-50 bg-gray-50 p-6 pr-8 shadow dark:border-neutral-800 dark:bg-neutral-800"
              }
            >
              <span className="absolute inset-0 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-sky-600 to-blue-500 filter transition-all duration-300 ease-out group-hover:blur-[6px]" />

              <div className={"flex flex-col gap-4"}>
                <div
                  className={"flex items-center gap-2 text-lg font-semibold"}
                >
                  <div className={"h-6 w-6"}>
                    <LayoutGrid size={24} />
                  </div>
                  <p>{t("Drop")} </p>
                </div>
                <div>{t("A_drop")}</div>
              </div>
              <div className={"h-6 w-6"}>
                <ArrowRight size={24} />
              </div>
            </div>
          </Link>
          <Link href={"/create/mint"}>
            <div
              className={
                "group relative flex w-full items-center justify-between gap-8 rounded-lg border border-gray-50 bg-gray-50 p-6 pr-8 shadow dark:border-neutral-800 dark:bg-neutral-800"
              }
            >
              <span className="absolute inset-0 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-sky-600 to-blue-500 filter transition-all duration-300 ease-out group-hover:blur-[6px]" />

              <div className={"flex flex-col gap-4"}>
                <div
                  className={"flex items-center gap-2 text-lg font-semibold"}
                >
                  <div className={"h-6 w-6"}>
                    <ImageIcon size={24} />
                  </div>
                  <p>{t("Collection_or_item")}</p>
                </div>
                <div>
                  {t("create")}
                  &#39;{t("ready")}
                </div>
                <div>{t("Collection_or_item")}</div>
              </div>
              <div className={"h-6 w-6"}>
                <ArrowRight size={24} />
              </div>
            </div>
          </Link>
          <div
            onClick={modal.open}
            className="group relative flex w-full items-center justify-between gap-8 rounded-lg border border-gray-50 bg-gray-50 p-6 pr-8 shadow dark:border-neutral-800 dark:bg-neutral-800 cursor-pointer"
          >
            <span className="absolute inset-0 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-sky-600 to-blue-500 filter transition-all duration-300 ease-out group-hover:blur-[6px]" />

            <div className={"flex flex-col gap-4"}>
              <div className={"flex items-center gap-2 text-lg font-semibold"}>
                <div className={"h-6 w-6"}>
                  <Stars size={24} />
                </div>
                <p>Generative Art</p>
              </div>
              <div>Use your extraordinary coding skills or ideas from prompts to have AI generate unique images for you</div>
            </div>
            <div className={"h-6 w-6"}>
              <ArrowRight size={24} />
            </div>
          </div>
          <Dialog onClose={modal.close} isOpen={modal.isOpen}>
            <div className="flex flex-col gap-4">
              <Link
                href={"/create/p5js"}
                className="group relative flex w-full items-center justify-between gap-8 rounded-lg border border-gray-50 bg-gray-50 p-6 pr-8 shadow dark:border-neutral-800 dark:bg-neutral-800 "
              >
              
                <p>Generate by script</p>
                <div className={"h-6 w-6"}>
                  <ArrowRight size={24} />
                </div>
                <span className="absolute inset-0 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-sky-600 to-blue-500 filter transition-all duration-300 ease-out group-hover:blur-[6px]" />
              </Link>
              <Link
                href={"/create/generateImg"}
                className="group relative flex w-full items-center justify-between gap-8 rounded-lg border border-gray-50 bg-gray-50 p-6 pr-8 shadow dark:border-neutral-800 dark:bg-neutral-800"
              >
                <p>Generate by AI</p>
                <div className={"h-6 w-6"}>
                  <ArrowRight size={24} />
                </div>
              </Link>
            </div>
          </Dialog>
        </div>
        <div className={"mb-5"}>
          <span className={"cursor-not-allowed text-link"}>
            {t("Learn_more")}{" "}
          </span>
          {t("about_each")}
        </div>
      </div>
    </div>
  );
}
