import {PrivyProvider, usePrivy} from '@privy-io/react-auth';
import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { fonts } from "src/lib/fonts";
import theme from "src/config/theme";
import { WagmiProvider } from "wagmi";
import WalletProvider from "src/context/WalletProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {  ENV_CONFIG } from "src/config/constants";
import { config } from "src/config/wagmi";



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
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
      <PrivyProvider appId={ENV_CONFIG.PRIVY_APP_ID!}>
      <ChakraProvider theme={theme}>
                <WalletProvider>

                  <Component {...pageProps} />
                </WalletProvider>
              
    
      </ChakraProvider>
      </PrivyProvider>
            </QueryClientProvider>
          </WagmiProvider>
    </>
  );
}
