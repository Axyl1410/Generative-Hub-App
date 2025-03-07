/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button"; // Sử dụng Button từ ShadCN
import { FORMASCAN_URL } from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getContractEvents, prepareEvent } from "thirdweb";

export default function Events({
  tokenId,
  address,
}: {
  tokenId: bigint;
  address: string;
}) {
  const [transferEvents, setTransferEvents] = useState<any[] | null>(null);
  const [displayCount, setDisplayCount] = useState(5);
  const contract = CollectionContract(address);

  if (!contract) notFound();

  useEffect(() => {
    async function getEvents() {
      const events = await getContractEvents({
        contract,
        fromBlock: BigInt(1),
        events: [
          prepareEvent({
            signature:
              "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
            filters: { tokenId: tokenId.toString() },
          }),
        ],
      });
      setTransferEvents(events.reverse());
    }
    getEvents();
  }, [address, contract, tokenId]);

  if (transferEvents === null) {
    return <div>Loading...</div>;
  }

  if (transferEvents.length === 0) {
    return <h1>No history found</h1>;
  }

  return (
    <div className="mt-3 flex flex-col gap-4">
      <div className="divide-y">
        {transferEvents.slice(0, displayCount).map((event) => (
          <div
            key={event.transactionHash}
            className="flex min-h-[32px] min-w-[128px] flex-1 items-center justify-between gap-1 border-white/20 py-2"
          >
            <div className="flex flex-col gap-1">
              <p className="text-text dark:text-white/60">Event</p>
              <p className="font-semibold text-text dark:text-white">
                Transfer
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text dark:text-white/60">From</p>
              <p className="font-semibold text-text dark:text-white">
                {event.args.from.slice(0, 4)}...{event.args.from.slice(-2)}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text dark:text-white/60">To</p>
              <p className="font-semibold text-text dark:text-white">
                {event.args.to.slice(0, 4)}...{event.args.to.slice(-2)}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Link
                className="h-6 w-6 p-2"
                href={`${FORMASCAN_URL}/tx/${event.transactionHash}`}
                target="_blank"
              >
                ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
      {displayCount < transferEvents.length && (
        <Button onClick={() => setDisplayCount(displayCount + 5)}>
          Load More
        </Button>
      )}
    </div>
  );
}
