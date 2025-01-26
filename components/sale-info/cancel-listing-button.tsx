import React, { useState } from "react";
import { sendTransaction } from "thirdweb";
import { cancelListing } from "thirdweb/extensions/marketplace";
import { MARKETPLACE } from "@/contracts";
import Loading from "@/components/common/loading";
import { Account } from "thirdweb/wallets";
import { motion } from "framer-motion";

interface CancelListingButtonProps {
  listingId: bigint;
  account: Account;
}

const CancelListingButton: React.FC<CancelListingButtonProps> = ({
  listingId,
  account,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCancelListing = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const transaction = cancelListing({
        contract: MARKETPLACE,
        listingId,
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
        onClick={handleCancelListing}
        disabled={loading}
        layout
        style={{ width: "auto" }}
      >
        {loading ? <Loading text={"Cancelling..."} /> : "Cancel Listing"}
      </motion.button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Listing cancelled successfully!</p>
      )}
    </div>
  );
};

export default CancelListingButton;
