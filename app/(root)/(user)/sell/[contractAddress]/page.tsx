import Loading from "@/components/common/loading";
import { Suspense } from "react";
import { GetItem } from "./get-item";
import { Metadata } from "./metadata";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = await params;

  return (
    <div className="flex flex-col">
      <Suspense fallback={<Loading />}>
        <Metadata address={contractAddress} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <GetItem address={contractAddress} />
      </Suspense>
    </div>
  );
}
