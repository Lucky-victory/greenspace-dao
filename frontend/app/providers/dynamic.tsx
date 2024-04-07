import { getCsrfToken } from "next-auth/react";

import { DynamicContextProvider } from "@/lib/dynamic";
import {
  EthereumWalletConnectors,
  SolanaWalletConnectors,
} from "@/lib/dynamic";

import axios from "axios";

export default function ProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
        walletConnectors: [SolanaWalletConnectors],
        eventsCallbacks: {
          onAuthSuccess: async (event) => {
            console.log("auth success from Dynamic", event);
            const { authToken, user, primaryWallet } = event;

            console.log("from authSuccess event", { user });

            const csrfToken = (await getCsrfToken()) as string;

            fetch("/api/auth/callback/credentials", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `csrfToken=${encodeURIComponent(
                csrfToken
              )}&token=${encodeURIComponent(authToken)}`,
            })
              .then((res) => {
                if (res.ok) {
                  console.log("auth success from nextAuth", res);
                  // Handle success - maybe redirect to the home page or user dashboard
                  window.location.reload();
                } else {
                  // Handle any errors - maybe show an error message to the user
                  console.error("Failed to log in");
                }
              })
              .catch((error) => {
                // Handle any exceptions
                console.error("Error logging in", error);
              });
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
