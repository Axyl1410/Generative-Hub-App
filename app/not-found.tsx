import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("notFound");

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 py-24 text-text dark:bg-background-dark dark:text-text-dark sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-200 sm:text-7xl">
          {t("pageNotFound")}
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 dark:text-gray-200 sm:text-xl/8">
          {t("sorryMessage")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t("goBackHome")}
          </Link>
          <a
            href="https://github.com/Axyl1410/"
            className="text-sm font-semibold text-gray-900 dark:text-background-light"
            target="_blank"
          >
            {t("contactSupport")} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
