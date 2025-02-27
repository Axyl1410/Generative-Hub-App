import BackButton from "@/components/common/back-button";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("sell");
  return (
    <div className="mt-10">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl">
          {t("title")}
        </h1>
        <BackButton className="h-fit" />
      </div>
      {children}
    </div>
  );
}
