import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";
// import { Address, WalletClient } from "viem";
// import { useAccount, usePublicClient, useWalletClient } from "wagmi";

// interface IWalletContext {
//   address?: Address;
//   publicClient: ReturnType<typeof usePublicClient>;
//   walletClient?: WalletClient;
// }

// const WalletContext = createContext<IWalletContext>({} as IWalletContext);

// interface Props {
//   children: ReactNode;
// }

// const WalletProvider: FC<Props> = ({ children }) => {
//   const { address } = useAccount();
//   const publicClient = usePublicClient();
//   const { data: walletClient } = useWalletClient();

//   return <WalletContext.Provider value={{ address, publicClient, walletClient }}>{children}</WalletContext.Provider>;
// };

// export default WalletProvider;

// export const useWalletContext = () => useContext(WalletContext);
export const useWallet = () => {
  const { ready, wallets } = useWallets();
  const singleWallet = wallets?.[0];
  return {
    ...singleWallet,
    ready,
  };
};
