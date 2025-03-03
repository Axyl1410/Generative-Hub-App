import CommentSection from "@/components/token/commentSection";
import Events from "@/components/token/events";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import { formatAddress } from "@/lib/utils";
import { Attribute } from "@/types";
import { Badge } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getNFT } from "thirdweb/extensions/erc721";
import { MediaRenderer } from "thirdweb/react";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string; id: string }>;
}) {
  const { contractAddress, id } = await params;
  const contract = CollectionContract(contractAddress);

  const nftPromise = getNFT({
    contract: contract,
    tokenId: BigInt(id),
    includeOwner: true,
  });

  const [nft] = await Promise.all([nftPromise]);

  if (!nft.tokenURI) notFound();

  return (
    <div className="mt-4 flex max-w-full flex-col gap-8 sm:flex-row">
      <div className="flex w-full flex-col">
        <MediaRenderer
          client={client}
          src={nft.metadata.image}
          className="!h-auto !w-full rounded-lg bg-white/[.04]"
        />
      </div>

      <div className="relative top-0 w-full max-w-full">
        <h1 className="mb-1 break-words text-3xl font-semibold">
          {nft.metadata.name}
        </h1>
        <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {nft.metadata.description}
        </p>
        <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          #{nft.id.toString()}
        </p>
        <div className="mt-1 flex gap-2">
          {nft.metadata.attributes &&
            (nft.metadata.attributes as unknown as Attribute[]).map(
              (attr: Attribute, index: number) => (
                <Badge key={index}>
                  {attr.trait_type} : {attr.value}
                </Badge>
              )
            )}
        </div>
        <div className="mt-2 flex flex-col border-t pt-2">
          <h1 className="text-lg">history</h1>
          <Events tokenId={nft.id} address={contractAddress} />
        </div>
        <div className="mt-2 flex flex-col border-t pt-2">
          <span> Owner: </span>
          <p className="font-medium text-text dark:text-white/90">
            {nft.owner ? formatAddress(nft.owner) : "Unknown"}
          </p>
        </div>
        <Suspense fallback={<div>loading...</div>}>
          <CommentSection
            nft_contract={contractAddress}
            token_Id={nft.id.toString()}
          />
        </Suspense>
      </div>
    </div>
  );
}
