import { GetItem } from "./get-item";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = await params;

  return (
    <>
      <div className="my-8 grid grid-cols-1 justify-start gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <GetItem address={contractAddress} />
      </div>
      <div className="mt-8 grid w-full place-content-center">
        <p className="text-sm font-bold">End of listed for sale</p>
      </div>
    </>
  );
}
