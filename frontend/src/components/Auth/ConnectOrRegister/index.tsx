import { usePrivy } from "@privy-io/react-auth";
import { CustomConnectButton } from "../ConnectButton";
import { LoginAndRegisterButtons } from "../LoginAndRegisterButtons";
import { UserMenu } from "../UserMenu";

import { useEffect } from "react";
import { useWallet } from "src/context/WalletProvider";

export const ConnectOrLogout = ({ openModal }: { openModal: () => void }) => {
  const { ready, user } = usePrivy();

  return (
    <>
      {!user && <LoginAndRegisterButtons openModal={openModal} />}
      {ready && user && <UserMenu />}
    </>
  );
};
