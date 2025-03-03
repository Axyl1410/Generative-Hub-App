import CommentSection from "@/components/token/commentSection";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import { Attribute } from "@/types";
import { Badge } from "lucide-react";
import { notFound } from "next/navigation";
import { getNFT } from "thirdweb/extensions/erc721";
import { MediaRenderer } from "thirdweb/react";
import { Saleinfo } from "./sale-info";

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
    <>
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
          <Saleinfo address={contractAddress} nft={nft} />
          <CommentSection nft_contract={contractAddress} token_Id={id} />
        </div>
      </div>
    </>
  );
}
