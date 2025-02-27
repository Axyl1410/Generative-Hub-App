import { notFound } from "next/navigation";
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
    console.log(e);
    return notFound();
  }
};

export default CollectionContract;
