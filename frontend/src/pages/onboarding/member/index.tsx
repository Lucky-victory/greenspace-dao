import NutritionistForm from "src/components/NutritionistForm";
import { Box, Heading, Text, useColorModeValue, VStack, Container } from "@chakra-ui/react";
import Head from "next/head";
import MemberRegisterForm from "src/components/MemberRegisterForm";
import { MemberRegisterFormFields } from "src/components/RegisterForm";
import { useDebounce, useLocalStorage } from "src/hooks/common";
import { useWallet } from "src/context/WalletProvider";
import { useAddUserMutation, useLazyGetUserQuery, useUpdateUserMutation } from "src/state/services";
import { useRouter } from "next/router";
import { communityAbi } from "../../../../abis";
import { config } from "src/config/wagmi";
import { communityAddr } from "src/utils/constants";
import { useAppContext } from "src/context/state";
import { writeContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { USER } from "src/types";

export default function OnboardMemberPage() {
  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();

  const { user: privyUser } = usePrivy();
  const { login } = useLogin();
  const [user, setUser] = useState<USER | undefined>(undefined);
  const router = useRouter();
  const [amount, setAmount] = useState("0.01");
  const debouncedAmount = useDebounce<string>(amount, 500);
  const { address } = useWallet();

  const { allTokensData } = useAppContext();
  const [updateUser] = useUpdateUserMutation();
  const [getUser] = useLazyGetUserQuery();
  const [cid, setCid] = useState<string>("");
  const [formData, setFormData] = useState<MemberRegisterFormFields>({
    fullName: "",
    email: "",
    sex: "",
    country: "",
    weight: "",
    height: "",
    diet: "",
    active: "",
    sitting: "",
    alcohol: "",
    smoke: "",
    sleepLength: "",
    overallHealth: "",
    birthDate: "",
    smokingStopped: "",
    smokingLength: ""
  });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

  async function handleFormSubmit(formData: MemberRegisterFormFields, userCid?: string) {
    try {
      setFormData(formData);
      setCid(userCid as string);

      if (privyUser) {
        await updateUser({
          addressOrAuthId: privyUser?.id,
          userCid,
          fullName: formData.fullName,
          email: formData.email
        }).unwrap();
        router.push("/member/dashboard");
      } else {
        login();
      }
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    async function getUserData() {
      if (privyUser) {
        const response = await getUser({
          usernameOrAuthId: privyUser?.id
        }).unwrap();
        setUser(response.data);
        setFormData((prev) => ({
          ...prev,
          fullName: response.data?.fullName,
          email: response.data?.email
        }));
      }
    }
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privyUser]);

  return (
    <>
      <Head>
        <title>Welcome to GreenspaceDAO - Complete Your Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box bg={bgColor} minHeight="100vh" py={12}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="2xl" textAlign="center" color={textColor}>
              Let&apos;s Get to Know You Better
            </Heading>
            <Text fontSize="xl" textAlign="center" color={textColor}>
              You&apos;re almost there! Just a few more details and you&apos;ll be part of our community.
            </Text>
            <Box
              bg={cardBgColor}
              p={{ base: 6, md: 8 }}
              rounded="xl"
              shadow="lg"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MemberRegisterForm onSubmit={handleFormSubmit} initialValues={formData} />
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
