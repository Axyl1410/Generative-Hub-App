import { toast } from "sonner";
import { getContract } from "thirdweb";
import client, { FORMA_SKETCHPAD } from "./client";

const CollectionContract = (address: string) => {
  try {
    return getContract({
      client: client,
      chain: FORMA_SKETCHPAD,
      address: address,
    });
  } catch (e) {
    toast.error("Invalid contract address" + e);
    return null;
  }
};

export default CollectionContract;
