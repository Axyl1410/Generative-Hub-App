import React, { useState } from "react";
import { sendTransaction } from "thirdweb";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { MARKETPLACE } from "@/contracts";
import Loading from "@/components/common/loading";
import { Account } from "thirdweb/wallets";
import { motion } from "framer-motion";

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
    <div>
      <motion.button
        onClick={handleCancel}
        disabled={loading}
        layout
        style={{ width: "auto" }}
      >
        {loading ? (
          <Loading text={"Cancelling..."} />
        ) : (
          `Cancel Listing or Auction`
        )}
      </motion.button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{`Cancelled successfully!`}</p>}
    </div>
  );
};

export default CancelButton;
