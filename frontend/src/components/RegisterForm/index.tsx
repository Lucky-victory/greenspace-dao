import React, { useState, useRef } from "react";
import * as Yup from "yup";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  IconButton,
  HStack
} from "@chakra-ui/react";
import { NewUserType, RegisterType } from "src/components/NewUserType";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import SwiperMain from "swiper";
import NutritionistForm, { NutritionistFormFields } from "src/components/NutritionistForm";
import { useAddNutritionistMutation, useAddUserMutation, useSendUserInfoToAIMutation } from "src/state/services";
import MemberRegisterForm from "../MemberRegisterForm";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Sex } from "src/state/types";
import { useRouter } from "next/router";
import { useWallet } from "src/context/WalletProvider";
import { BsChevronLeft } from "react-icons/bs";
import { communityAddr } from "src/utils/constants";
import { communityAbi } from "../../../abis";
import { parseEther, parseGwei } from "viem";
import { readContract, writeContract } from "@wagmi/core";

import { useAppContext } from "../../context/state";
import { config } from "src/config/wagmi";
import { useDebounce } from "src/hooks/common";

export interface MemberRegisterFormFields {
  fullName: string;
  email: string;
  sex: string;
  country?: string;
  weight: string;
  height: string;
  diet: string;
  active: string;
  sitting: string;
  alcohol: string;
  smoke: string;
  sleepLength: string;
  overallHealth: string;
  birthDate: string;
  smokingStopped?: string;
  smokingLength?: string;
}

export const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  sex: Yup.string().required("Sex is required"),
  country: Yup.string().required("Country is required"),
  weight: Yup.string().required("Weight is required"),
  height: Yup.string().required("Height is required"),
  diet: Yup.string().required("Diet information is required"),
  active: Yup.string().required("Activity level is required"),
  sitting: Yup.string().required("Sitting hours are required"),
  alcohol: Yup.string().required("Alcohol consumption information is required"),
  smoke: Yup.string().required("Smoking information is required"),
  sleepLength: Yup.string().required("Sleep length is required"),
  overallHealth: Yup.string().required("Overall health rating is required"),
  birthDate: Yup.string().required("Birth date is required"),
  smokingStopped: Yup.string(),
  smokingLength: Yup.string()
});

export const dietOptions = [
  "I eat 5 or more servings of vegetables per day",
  "I eat two or more servings of fruit per day",
  "I have two or more servings of dairy (or equivalent) per day",
  "My cereals are mostly whole grains",
  "I eat fast lean protein every day",
  "I eat fast food once per week or less",
  "I eat pastries or cakes once a week or less",
  "I have less than 1 teaspoon of salt per day",
  "I have 2 or less alcoholic drinks on any day",
  "I drink at least 2 litres of water per day"
];

export const overallHealthOptions = ["Excellent", "Very good", "Good", "Fair", "Poor"];
export const smokingOptions = [
  "less than 5 cigarettes",
  "5 to 10 cigarettes",
  "11 to 20 cigarettes",
  "above 20 cigarettes"
];

interface RegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Partial<MemberRegisterFormFields>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isOpen, onClose }) => {
  const { allTokensData } = useAppContext();
  const [addNutritionists, { isLoading }] = useAddNutritionistMutation();
  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();
  const [sendUserInfoToAI, { isLoading: sendUserInfoToAILoading }] = useSendUserInfoToAIMutation();
  const { address } = useWallet();
  const [amount, setAmount] = useState("0.01");
  const debouncedAmount = useDebounce<string>(amount, 500);
  const [memberInitialValues, setMemberInitialValues] = useState<MemberRegisterFormFields>();
  const { user, ready } = usePrivy();
  const swiperRef = useRef<SwiperRef>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState<RegisterType>("member");

  const [cid, setCid] = useState<string>("");
  const [memberFormData, setMemberFormData] = useState<MemberRegisterFormFields>({
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
  const router = useRouter();
  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod) => {
      if (isNewUser) {
        switch (loginMethod) {
          case "google":
            await addUser({
              fullName: user?.google?.name,
              authId: user?.id,
              email: user?.google?.email,
              address: user?.wallet?.address!,
              emailVerified: true,
              userCid: cid,
              userType: selectedUserType
            }).unwrap();
            break;

          default:
            await addUser({
              fullName: memberFormData.fullName,
              authId: user?.id,
              address: address!,
              userType: selectedUserType,
              userCid: cid
            }).unwrap();
        }
        // sendUserInfoToAI(memberFormData);
        // router.push("/member/dashboard");
      }
    }
  });

  async function handleMemberFormSubmit(formData: MemberRegisterFormFields, userCid?: string) {
    try {
      setMemberFormData(formData);
      setCid(userCid as string);

      const hash = await writeContract(config, {
        address: communityAddr,
        abi: communityAbi as readonly unknown[],
        functionName: "registerUser",
        args: [cid, allTokensData.userNftUri],
        //@ts-ignore
        value: parseEther(debouncedAmount || "0")
      });

      login();
    } catch (error) {
      console.log({ error });
    }
  }
  async function handleNutritionistFormSubmit(data: NutritionistFormFields, credentialUri: string,uploadUri: string) {
    try {
   
      const hash = await writeContract(config, {
        address: communityAddr,
        abi: communityAbi as readonly unknown[],
        functionName: "registerNutritionist",
        args: [uploadUri, allTokensData.nutritionistNftUri],
        //@ts-ignore
        value: parseEther(debouncedAmount || "0")
      });
      await addNutritionists({
        credentialsCid: credentialUri,
        address: address as string,
        fullName: data.fullName,
        email: data.email,
        sex: data.sex as Sex,
        country: data.country,
        birthDate: data.birthDate
      }).unwrap();
      router.push("/nutritionist/check-status");
    } catch (error) {
      console.log({ error });
    }
  }
  return (
    <Modal scrollBehavior="inside" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent rounded="30px" alignSelf="center">
        <ModalHeader fontSize={{ lg: "3xl", base: "xl" }}>
          <HStack spacing={4} align="center" mb={0}>
            {activeSlideIndex === 1 && (
              <IconButton
                aria-label="Back"
                colorScheme="gs-yellow"
                variant="ghost"
                rounded="full"
                size="sm"
                onClick={() => swiperRef.current?.swiper.slidePrev()}
              >
                <BsChevronLeft size={20} />
              </IconButton>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            as={Swiper}
            onActiveIndexChange={(swiper: SwiperMain) => {
              setActiveSlideIndex(swiper.activeIndex);
            }}
            ref={swiperRef as React.RefObject<SwiperRef>}
            allowTouchMove={false}
          >
            <SwiperSlide>
              <NewUserType
                onClick={() => swiperRef.current?.swiper.slideNext()}
                getValue={(value) => {
                  setSelectedUserType(value);
                }}
              />
            </SwiperSlide>
            <SwiperSlide>
              {activeSlideIndex > 0 && (
                <>
                  {selectedUserType === "member" && (
                    <MemberRegisterForm
                      onSubmit={handleMemberFormSubmit}
                      onClose={onClose}
                      initialValues={memberInitialValues}
                    />
                  )}
                  {selectedUserType === "nutritionist" && (
                    <NutritionistForm
                      closeFormModal={onClose}
                      onSubmit={(data, credentialUri,uploadUri) => handleNutritionistFormSubmit(data, credentialUri,uploadUri)}
                    />
                  )}
                </>
              )}
            </SwiperSlide>
          </Box>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
export default RegisterForm;
