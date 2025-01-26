import React, { useState } from "react";
import { sendTransaction } from "thirdweb";
import { cancelAuction } from "thirdweb/extensions/marketplace";
import { MARKETPLACE } from "@/contracts";
import Loading from "@/components/common/loading";
import { Account } from "thirdweb/wallets";
import { motion } from "framer-motion";

interface CancelAuctionButtonProps {
  auctionId: bigint;
  account: Account;
}

const CancelAuctionButton: React.FC<CancelAuctionButtonProps> = ({
  auctionId,
  account,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCancelAuction = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const transaction = cancelAuction({
        contract: MARKETPLACE,
        auctionId,
      });

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
        onClick={handleCancelAuction}
        disabled={loading}
        layout
        style={{ width: "auto" }}
      >
        {loading ? <Loading text={"Cancelling..."} /> : "Cancel Auction"}
      </motion.button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Auction cancelled successfully!</p>
      )}
    </div>
  );
};

export default CancelAuctionButton;
