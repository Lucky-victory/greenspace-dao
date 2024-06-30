import NutritionistForm from "src/components/NutritionistForm";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import MemberRegisterForm from "src/components/MemberRegisterForm";
export default function OnboardMemberPage() {
  return (
    <>
      <Head>
        <title>Member Onboarding - GreenspaceDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mx={"auto"} maxW={800} px={{ base: 2, md: 6 }} py={8}>
        <Box bg={"black"} my={{ base: 5, md: 8 }} p={{ base: 4, md: 6 }} rounded={30}>
          <MemberRegisterForm />;
        </Box>
      </Box>
    </>
  );
}
