import { useContract, useNFTs } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

export const useNFTCollection = (contractAddress: string) => {
  const { contract } = useContract(contractAddress);
  const { data: nfts, isLoading } = useNFTs(contract);
  const [collection, setCollection] = useState<any>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(`/api/contract-address?contractAddress=${contractAddress}`);
        const data = await response.json();
        setCollection(data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    if (contractAddress) {
      fetchCollection();
    }
  }, [contractAddress]);

  return {
    nfts,
    isLoading,
    collection,
  };
};