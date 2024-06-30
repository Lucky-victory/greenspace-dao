import NutritionistForm, { NutritionistFormFields } from "src/components/NutritionistForm";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { useLocalStorage } from "src/hooks/common";
import { useAddNutritionistMutation } from "src/state/services";
import { useWallet } from "src/context/WalletProvider";
import { Sex } from "src/state/types";
export default function OnboardNutritionistPage() {
  const [newNutritionist] = useLocalStorage("new-nutritionist", {});
  const { address } = useWallet();
  const [addNutritionists, { isLoading }] = useAddNutritionistMutation();
  async function handleFormSubmit(data: NutritionistFormFields, credentialUri: string) {
    try {
      await addNutritionists({
        credentialsCid: credentialUri,
        address: address as string,
        fullName: data.fullName,
        email: data.email,
        sex: data.sex as Sex,
        country: data.country,
        birthDate: data.birthDate
      }).unwrap();
    } catch (error) {}
  }
  return (
    <>
      <Head>
        <title>Nutritionist Onboarding - GreenspaceDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mx={"auto"} maxW={800} px={{ base: 2, md: 6 }} py={8}>
        <Box bg={"black"} my={{ base: 5, md: 8 }} p={{ base: 4, md: 6 }} rounded={30}>
          <NutritionistForm onSubmit={handleFormSubmit} initialValues={newNutritionist} closeFormModal={() => {}} />;
        </Box>
      </Box>
    </>
  );
}
