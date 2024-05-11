import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { fonts } from "src/lib/fonts";
import theme from "src/config/theme";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet } from "viem/chains";
import WalletProvider from "src/context/WalletProvider";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DYNAMIC_KEY } from "src/config/constants";

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-poppins: ${fonts.poppins.style.fontFamily};
          }
        `}
      </style>
      <ChakraProvider theme={theme}>
        <DynamicContextProvider
          settings={{
            environmentId: DYNAMIC_KEY,
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <DynamicWagmiConnector>
                <WalletProvider>
                  <Component {...pageProps} />
                </WalletProvider>
              </DynamicWagmiConnector>
            </QueryClientProvider>
          </WagmiProvider>
        </DynamicContextProvider>
      </ChakraProvider>
    </>
  );
}
