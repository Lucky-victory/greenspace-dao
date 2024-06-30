import React, { useCallback } from "react";
import { Button } from "@chakra-ui/react";
import { OAuthProviderType, useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useLocalStorage } from "src/hooks/common";
import { useLazyGetUserQuery } from "src/state/services";

export const LoginButton: React.FC<{
  type: "member" | "nutritionist";
  text: string;
  styleProps: Record<string, any>;
}> = ({ type, text, styleProps }) => {
  const { user } = usePrivy();
  const router = useRouter();
  const [getUser] = useLazyGetUserQuery();
  const [_, setNewMember] = useLocalStorage("new-member", {});
  const [__, setNewNutritionist] = useLocalStorage("new-nutritionist", {});
  type LoginMethod =
    | "email"
    | "sms"
    | "siwe"
    | "farcaster"
    | OAuthProviderType
    | "passkey"
    | "telegram"
    | `privy:${string}`;
  const handleLoginComplete = useCallback(
    (user: any, isNewUser: boolean, _: any, loginMethod: LoginMethod | null) => {
      console.log({ type, isNewUser, loginMethod,user });
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
      }
      if (type === "nutritionist") {
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
    },
    [type, router, setNewMember, setNewNutritionist]
  );

  const { login } = useLogin({ onComplete: handleLoginComplete });

  const handleClick = () => {
    login();
  };

  return (
    <Button onClick={handleClick} {...styleProps}>
      {text}
    </Button>
  );
};
