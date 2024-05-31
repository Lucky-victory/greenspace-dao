import { usePrivy } from "@privy-io/react-auth";
import { CustomConnectButton } from "../ConnectButton";
import { LoginAndRegisterButtons } from "../LoginAndRegisterButtons";
import { UserMenu } from "../UserMenu";

import { useEffect } from "react";
import { useWallet } from "src/context/WalletProvider";

export const ConnectOrLogout = ({ openModal }: { openModal: () => void }) => {
  const { ready, user } = usePrivy();

  const { address } = useWallet();


  useEffect(() => {
   
  }, [address]);

  return (
    <>
      {ready && !address && <CustomConnectButton />}
      {ready && address && !user && (
        <LoginAndRegisterButtons openModal={openModal} />
      )}
      {ready && address && user && <UserMenu />}
    </>
  );
};
