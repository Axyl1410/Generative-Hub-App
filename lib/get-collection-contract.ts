import { getContract } from "thirdweb";
import client, { FORMA_SKETCHPAD } from "./client";

const CollectionContract = (address: string) => {
  return getContract({
    client: client,
    chain: FORMA_SKETCHPAD,
    address: address,
  });
};

export default CollectionContract;
 