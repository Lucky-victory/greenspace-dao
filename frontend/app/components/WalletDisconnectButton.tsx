import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@chakra-ui/react";

export default function LogoutBtn() {
    const {disconnect} = useDisconnect();
  return (
    <Button onClick={() => disconnect()} colorScheme="red" rounded={"md"}>
      Logout
    </Button>
  );
}
