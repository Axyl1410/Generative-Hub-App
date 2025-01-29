import React, { useState } from "react";
import { getContract, sendTransaction } from "thirdweb";
import { burn } from "thirdweb/extensions/erc721";
import Loading from "@/components/common/loading";
import { Account } from "thirdweb/wallets";
import { motion } from "framer-motion";
import client, { FORMA_SKETCHPAD } from "@/lib/client";

interface BurnButtonProps {
  tokenId: bigint; // ID of the NFT to burn
  account: Account;
  address: string;
}

const BurnButton: React.FC<BurnButtonProps> = ({
  tokenId,
  account,
  address,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBurn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const Contract = getContract({
      client: client,
      address: address,
      chain: FORMA_SKETCHPAD,
    });

    try {
      const transaction = burn({
        contract: Contract,
        tokenId: tokenId,
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
        onClick={handleBurn}
        disabled={loading}
        layout
        style={{ width: "auto" }}
      >
        {loading ? <Loading text={"Burning..."} /> : "Burn NFT"}
      </motion.button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>NFT burned successfully!</p>}
    </div>
  );
};

export default BurnButton;
