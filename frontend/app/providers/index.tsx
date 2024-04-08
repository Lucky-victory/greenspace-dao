/* eslint-disable react/jsx-no-comment-textnodes */
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AppWrapper } from "@/context/state";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/state/store";
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    // <WagmiConfig config={config}>
    <AppWrapper>
      <ReduxProvider store={store}>
        <ThirdwebProvider
          clientId="7d6dd3b28e4d16bb007c78b1f6c90b04"
          activeChain="sepolia"
        >
          {children}
        </ThirdwebProvider>
      </ReduxProvider>
    </AppWrapper>
    // </WagmiConfig>
  );
}

export default AppProviders;
