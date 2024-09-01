import { Button } from "@chakra-ui/react";

export const RegisterButton = ({
  onClick,
  text = "Join Now",
  styleProps = {}
}: {
  styleProps?: Record<string, any>;
  onClick: () => void;
  text?: string;
}) => {
  function handleClick() {
    onClick?.();
  }
  return (
    <Button onClick={handleClick} rounded={"full"} colorScheme="gs-yellow" {...styleProps}>
      {text}
    </Button>
  );
};
