import { Button } from "@chakra-ui/react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useGetUserQuery } from "src/state/services";

export const LoginButton = ({
  type,
  text,
  styleProps,
}: {
  type: "member" | "nutritionist";
  text: string;
  styleProps: Record<string, any>;
}) => {
  const { user } = usePrivy();
  const { login } = useLogin({
    onComplete: async (user, isNewUser) => {},
  });
  const { data: savedUserResponse } = useGetUserQuery({
    usernameOrAuthId: user?.id as string,
  });
  const savedUser = savedUserResponse?.data;
  //   const {data:savedNutritionistResponse} = useG
  function handleClick() {
    login();
  }
  return (
    <Button onClick={handleClick} {...styleProps}>
      {text}
    </Button>
  );
};
