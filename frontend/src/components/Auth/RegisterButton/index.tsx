import { Button } from "@chakra-ui/react";

export const RegisterButton = ({ onClick }: { onClick: () => void }) => {
  function handleClick() {
    onClick?.();
  }
  return (
    <Button onClick={handleClick} rounded={"full"} colorScheme="gs-yellow">
      Sign Up
    </Button>
  );
};
