import Loading from "@/components/common/loading";
import { MARKETPLACE } from "@/contracts";
import React, { useState } from "react";
import { sendTransaction } from "thirdweb";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { Account } from "thirdweb/wallets";

interface CancelButtonProps {
  id?: bigint; // Could be listingId or auctionId
  account: Account;
  type: "listing" | "auction"; // Type of the operation to cancel
}

const CancelButton: React.FC<CancelButtonProps> = ({ id, account, type }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  console.log(id);
  if (id === undefined) return null;

  const handleCancel = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let transaction;
      if (type === "listing") {
        transaction = cancelListing({
          contract: MARKETPLACE,
          listingId: id,
        });
      } else {
        transaction = cancelAuction({
          contract: MARKETPLACE,
          auctionId: id,
        });
      }

      await sendTransaction({ transaction, account });
      setSuccess(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCancel}
        disabled={loading}
        className={
          "flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-200 py-3 text-sm text-black"
        }
      >
        {loading ? (
          <Loading text={"Cancelling..."} />
        ) : (
          `Cancel Listing or Auction`
        )}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{`Cancelled successfully!`}</p>}
    </>
  );
};

export default CancelButton;
