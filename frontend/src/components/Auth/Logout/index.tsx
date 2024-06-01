import { Button } from "@chakra-ui/react";
import { useLogout } from "@privy-io/react-auth";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useDisconnect } from "wagmi";

export const LogoutButton = () => {
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const { disconnectAsync } = useDisconnect();

  async function handleLogout() {
    setIsLoading(true);
    await logout();
    await disconnectAsync();
    setIsLoading(false);
  }
  return (
    <Button isLoading={isLoading} variant={"ghost"} w={"full"} colorScheme="red" gap={3} onClick={handleLogout}>
      <FiLogOut /> Logout
    </Button>
  );
};
