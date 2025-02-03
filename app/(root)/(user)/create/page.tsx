import BackButton from "@/components/common/back-button";
import { ArrowRight, ImageIcon, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className={"grid w-full place-items-center"}>
      <div className={"flex max-w-2xl flex-col gap-4 pt-10 lg:px-16"}>
        <BackButton href={"/"} className={"w-fit"} />
        <h1 className={"text-3xl font-bold"}>Create</h1>
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
                  <p>Drop</p>
                </div>
                <div>
                  A drop is the release of a new project. This usually happens
                  on a specified date and time. Items will be revealed after
                  they have been purchased.
                </div>
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
                  <p>Collection or item</p>
                </div>
                <div>
                  Create a new NFT collection or add an NFT to an existing one.
                  Your items will display immediately. List for sale when
                  you&#39;re ready.
                </div>
              </div>
              <div className={"h-6 w-6"}>
                <ArrowRight size={24} />
              </div>
            </div>
          </Link>
        </div>
        <div className={"mb-5"}>
          <span className={"cursor-not-allowed text-link"}>Learn more </span>
          about each option.
        </div>
      </div>
    </div>
  );
}
