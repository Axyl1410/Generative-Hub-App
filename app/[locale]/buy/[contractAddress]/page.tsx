import { getTranslations } from "next-intl/server";
import { GetItem } from "./get-item";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = await params;
  const t = await getTranslations("buy");
  return (
    <>
      <div className="my-8">
        <GetItem address={contractAddress} />
      </div>
      <div className="mt-8 grid w-full place-content-center">
        <p className="text-sm font-bold">{t("End_of_listed_for_sale")} </p>
      </div>
    </>
  );
}
