import { Button } from "@chakra-ui/react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useLocalStorage } from "src/hooks/common";
import { useGetUserQuery, useLazyGetUserQuery } from "src/state/services";

export const LoginButton = ({
  type,
  text,
  styleProps
}: {
  type: "member" | "nutritionist";
  text: string;
  styleProps: Record<string, any>;
}) => {
  const { user } = usePrivy();
  const router = useRouter();
  const [getUser] = useLazyGetUserQuery();
  const [_, setNewMember] = useLocalStorage("new-member", {});
  const [__, setNewNutritionist] = useLocalStorage("new-nutritionist", {});
  const { login } = useLogin({
    onComplete: async (user, isNewUser, _, loginMethod) => {
      if (type === "member") {
        if (isNewUser) {
          switch (loginMethod) {
            case "google":
              setNewMember({
                email: user?.google?.email,
                authId: user?.id,
                fullName: user?.google?.name,
                loginMethod: loginMethod,
                emailVerified: true
              });
              break;
            default:
              setNewMember({ email: user?.email, authId: user?.id, loginMethod: loginMethod });
          }
          router.push("/onboarding/member");

          return;
        }
        router.push("/member/dashboard");
      } else {
        if (isNewUser) {
          switch (loginMethod) {
            case "google":
              setNewNutritionist({ email: user?.google?.email, authId: user?.id, fullName: user?.google?.name });
              break;
            default:
              setNewNutritionist({ email: user?.email, authId: user?.id });
          }
          router.push("/onboarding/nutritionist");
          return;
        }
        router.push("/nutritionist/dashboard");
      }
    }
  });

  function handleClick() {
    login();
  }
  return (
    <Button onClick={handleClick} {...styleProps}>
      {text}
    </Button>
  );
};
