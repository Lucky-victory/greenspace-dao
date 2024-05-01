import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@chakra-ui/react";

export default function LogoutBtn() {
  return (
    <Button onClick={() => signOut()} colorScheme="red" rounded={"md"}>
      Logout
    </Button>
  );
}
