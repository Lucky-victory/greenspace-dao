
import { Chain } from "wagmi/chains";

export const appName = "GreenspaceDAO";
export const communityAddr = "0x763055Ca49aDB6b41Da2522Ab7E2C714601FaD88";

export const pego = {
  id: 20201022,
  name: "PEGO Mainnet",
  //network: "pego",
  nativeCurrency: {
    decimals: 18,
    name: "PEGO",
    symbol: "PG",
  },
  rpcUrls: {
    public: { http: ["https://pegorpc.com"] },
    default: { http: ["https://pegorpc.com"] },
  },
  blockExplorers: {
    etherscan: { name: "expolorer", url: "https://scan.pego.network/" },
    default: { name: "expolorer", url: "https://scan.pego.network/" },
  },
} as const satisfies Chain;
