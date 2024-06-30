import NutritionistForm from "src/components/NutritionistForm";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import MemberRegisterForm from "src/components/MemberRegisterForm";
import { MemberRegisterFormFields } from "src/components/RegisterForm";
import { useLocalStorage } from "src/hooks/common";
import { useWallet } from "src/context/WalletProvider";
import { useAddUserMutation } from "src/state/services";
export default function OnboardMemberPage() {
  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();
  const [newMember] = useLocalStorage<{ loginMethod?: "google"; fullName?: string; email?: string; authId?: string }>(
    "new-member",
    {}
  );
  const { address } = useWallet();
  const { loginMethod, authId } = newMember;
  async function handleFormSubmit(data: MemberRegisterFormFields, userCid?: string) {
    try {
      switch (loginMethod) {
        case "google":
          await addUser({
            fullName: data?.fullName,
            authId: authId,
            email: data?.email,
            address: address!,
            emailVerified: true,
            userCid
          }).unwrap();
          break;

        default:
          await addUser({
            fullName: data.fullName,
            authId: authId,
            address: address!,

            userCid
          }).unwrap();
      }
    } catch (error) {}
  }
  return (
    <>
      <Head>
        <title>Member Onboarding - GreenspaceDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mx={"auto"} maxW={800} px={{ base: 2, md: 6 }} py={8}>
        <Box bg={"black"} my={{ base: 5, md: 8 }} p={{ base: 4, md: 6 }} rounded={30}>
          <MemberRegisterForm onSubmit={handleFormSubmit} initialValues={newMember} />;
        </Box>
      </Box>
    </>
  );
}
