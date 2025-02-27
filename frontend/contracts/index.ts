import client, {
  address_marketplace_contract,
  FORMA_SKETCHPAD,
} from "@/lib/client";
import { getContract } from "thirdweb";

/** Replace the values below with the addresses of your smart contracts. */
// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.

export const MARKETPLACE = getContract({
  client,
  chain: FORMA_SKETCHPAD,
  address: address_marketplace_contract,
});
