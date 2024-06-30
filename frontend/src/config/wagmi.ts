import { createConfig, http } from "wagmi";

import { mainnet, base } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, base],

  ssr: true,
  // multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http()
  }
});
