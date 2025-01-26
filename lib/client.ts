import { createThirdwebClient, defineChain } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID

export const address_marketplace_contract =
  "0xa7d2c8d1Fd78cc65aaC5DBCfd91A4B7190acf89A";
export const address_collection_contract =
  "0x71324fB355dfa06b690CdE8466AadD1f45719306";
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
const secretKey = process.env.TW_SECRET_KEY;

if (!clientId) throw new Error("No client ID provided");

export const FORMA_SKETCHPAD = defineChain({
  id: 984123,
  name: "Forma Sketchpad",
  nativeCurrency: {
    name: "FORMA",
    symbol: "FORMA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sketchpad-1.forma.art"],
    },
  },
  blockExplorers: {
    default: {
      name: "FormaScan",
      url: "https://explorer.sketchpad-1.forma.art/",
    },
  },
  testnet: true,
});

export const FORMASCAN_URL = "https://explorer.sketchpad-1.forma.art/";

export default createThirdwebClient(secretKey ? { secretKey } : { clientId });
