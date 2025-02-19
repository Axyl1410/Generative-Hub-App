"use client";

import BackButton from "@/components/common/back-button";
import { Link } from "@/i18n/routing";
<<<<<<< HEAD
import { useTranslations } from "next-intl";

type Translations = {
  Drop: string;
  A_drop: string;
  Collection_or_item: string;
  create: string;
  ready: string;
  Learn_more: string;
  about_each: string;
};

export default function Page() {
  const t = useTranslations("create");
=======
import { ArrowRight, ImageIcon, LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

>>>>>>> 974a8f41386a7ebf66eda5648317c26586875a30
  return (
    <div className={"mt-10 flex w-full justify-center"}>
      <div className={"flex max-w-2xl flex-col gap-4 lg:px-16"}>
        <div className="flex w-full items-center justify-between">
          <h1 className={"text-3xl font-bold"}>{t("create.title")}</h1>
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
<<<<<<< HEAD
                  <p>{t("Drop")} </p>
                </div>
                <div>{t("A_drop")}</div>
=======
                  <p>{t("create.drop")}</p>
                </div>
                <div>{t("create.drop_description")}</div>
>>>>>>> 974a8f41386a7ebf66eda5648317c26586875a30
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
<<<<<<< HEAD
                  <p>{t("Collection_or_item")}</p>
                </div>
                <div>
                  {t("create")}
                  &#39;{t("ready")}
=======
                  <p>{t("create.collection_or_item")}</p>
>>>>>>> 974a8f41386a7ebf66eda5648317c26586875a30
                </div>
                <div>{t("create.collection_or_item_description")}</div>
              </div>
              <div className={"h-6 w-6"}>
                <ArrowRight size={24} />
              </div>
            </div>
          </Link>
        </div>
        <div className={"mb-5"}>
          <span className={"cursor-not-allowed text-link"}>
<<<<<<< HEAD
            {t("Learn_more")}{" "}
          </span>
          {t("about_each")}
=======
            {t("create.learn_more")}
          </span>
          {t("create.about_each_option")}
>>>>>>> 974a8f41386a7ebf66eda5648317c26586875a30
        </div>
      </div>
    </div>
  );
}
