import { useCustomSign } from "@/hooks";
import { useLazyGetUserQuery } from "@/state/services";
import { Button } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function LoginBtn() {
  //   const [getUser, { data: user }] = useLazyGetUserQuery();
  const router = useRouter();
  //const { publicKey } = useWallet();
  //const address = publicKey?.toBase58();

  const { isConnected, address } = useAccount();

  const { signCustomMessage, setSigned, signed } = useCustomSign();
  const [isLoading, setIsLoading] = useState(false);
  async function handleLogin() {
    setIsLoading(true);
    // const user = await getUser({ usernameOrAuthId: address! }).unwrap();
    if (address) {
      if (!signed) {
        await signCustomMessage();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/member/dashboard");
      }
    } else {
      setSigned(false);
    }
    setIsLoading(false);
  }

  return (
    <>
      {" "}
      <Button
        colorScheme="gray"
        isLoading={isLoading}
        variant={"outline"}
        onClick={() => handleLogin()}
      >
        Login
      </Button>
    </>
  );
}
