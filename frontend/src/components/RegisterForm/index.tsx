import React, { MutableRefObject, RefObject, useRef, useState } from "react";

import { useRouter } from "next/router";
import { FieldValues, SubmitErrorHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAppContext } from "src/context/state";

import {
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  HStack,
  Input,
  Select,
  useToast,
  Text,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { NewUserType, RegisterType } from "src/components/NewUserType";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import SwiperMain from "swiper";
import NutritionistForm from "src/components/NutritionistForm";
import { countries } from "src/utils/countries";
import { useDebounce } from "src/hooks/common";
import { communityAbi } from "../../../abis";
import { communityAddr } from "src/utils/constants";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useAddUserMutation, useSendUserInfoToAIMutation } from "src/state/services";

import { parseEther } from "viem";

import { useAccount } from "wagmi";
import { simulateContract, writeContract } from "@wagmi/core";
import { config } from "src/config/wagmi";
import { useLogin, useSignMessage } from "@privy-io/react-auth";
import { BsChevronLeft } from "react-icons/bs";
import OnboardingProgress from "../OnboardingProgress";

export interface RegisterFormFields {
  fullName: string;
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
const RegisterForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>();

  return (
    <>
      <Modal scrollBehavior="inside" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent rounded={"30px"} alignSelf={"center"}>
          <ModalHeader fontSize={{ lg: "3xl", base: "xl" }}>
            <HStack spacing={4} align={"center"}>
              {activeSlideIndex === 1 && (
                <IconButton
                  aria-label=""
                  variant={"ghost"}
                  rounded={"full"}
                  size={"sm"}
                  onClick={() => swiperRef.current?.swiper.slidePrev()}
                >
                  <BsChevronLeft size={20} />
                </IconButton>
              )}
              <span>Register</span>
            </HStack>
            {/* {hasError && activeSlideIndex > 0 && selectedUserType !== "nutritionist" && (
              <Text color="red.600" my={1} fontWeight={"medium"} fontSize={"md"} as={"span"}>
                Please fill out all fields
              </Text>
            )} */}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RegisterComponent
              swiperRef={swiperRef}
              setActiveSlideIndex={setActiveSlideIndex}
              activeSlideIndex={activeSlideIndex}
              onClose={onClose}
            />
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
interface RegisterProp {
  swiperRef: MutableRefObject<SwiperRef | undefined>;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose?: () => void;
  activeSlideIndex: number;
  titleText?: string;
}
export const RegisterComponent = ({
  swiperRef,
  setActiveSlideIndex,
  activeSlideIndex,
  onClose,
  titleText = "Register",
}: RegisterProp) => {
  const [createUser, { data: createdUser, isLoading: isCreatingUser, isSuccess }] = useAddUserMutation();
  const { signMessage } = useSignMessage();

  const { address } = useAccount();

  const [sendUserToAI, { data: userAIdataResponse }] = useSendUserInfoToAIMutation();
  const userAIdata = userAIdataResponse?.data;

  const toast = useToast({
    duration: 3000,
    position: "top",
    status: "success",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const swiperNestedRef = useRef<SwiperRef>();
  const [selectedUserType, setSelectedUserType] = useState<RegisterType>("member");
  const { user, setUser, allTokensData } = useAppContext();
  const [amount, setAmount] = useState("0.01");
  const debouncedAmount = useDebounce<string>(amount, 500);
  const [hasError, setHasError] = useState(false);
  const [inTx, setInTx] = useState(false);
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Field is required"),
    email: Yup.string().required("Field is required").email("please enter a valid email address"),
    sex: Yup.string().required("Field is required"),
    country: Yup.string().required("Field is required"),
    weight: Yup.string().required("Field is required"),
    height: Yup.string().required("Field is required"),
    diet: Yup.string().required("Field is required"),
    active: Yup.string().required("Field is required"),
    sitting: Yup.string().required("Field is required"),
    alcohol: Yup.string().required("Field is required"),
    smoke: Yup.string().required("Field is required"),
    sleepLength: Yup.string().required("Field is required"),
    overallHealth: Yup.string().required("Field is required"),
    birthDate: Yup.string().required("Field is required"),
    smokingStopped: Yup.string(),
    smokingLength: Yup.string(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);

  const [formData, setFormData] = useState<RegisterFormFields | null>(null);

  const { login } = useLogin({
    onComplete: async function (user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount) {
      // TODO: Add logic to handle new user, if the user does not exist, trigger them to register by redirecting them to an onboarding page oor modal.

      if (isNewUser) {
        if (loginMethod === "google") {
          await createUser({
            fullName: user?.google?.name,
            authId: user?.id,
            email: user?.google?.email,
            address: address!,
            emailVerified: true,
            userType: selectedUserType,
          }).unwrap();
          router.push("/member/dashboard");
        } else {
          await createUser({
            fullName: formData?.fullName,
            authId: user?.id,
            address: address!,
            userType: selectedUserType,
            userCid: cid,
          }).unwrap();
          router.push("/member/dashboard");
        }
        sendUserToAI(formData);
      }
      setUser?.({
        ...user,
        userAddress: address,
        userCidData: cid,
        name: formData?.fullName,
      });
    },
  });

  // get functions to build form with useForm() hook
  const { errors, isValid, isSubmitSuccessful } = formState;
  const [cid, setCid] = useState<string>("");
  //const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: upload } = useStorageUpload();

  const registerUserTx = async () => {
    try {
      setInTx(true);
      const { request } = await simulateContract(config, {
        address: communityAddr,
        abi: communityAbi as readonly unknown[],
        functionName: "registerUser",
        args: [cid, allTokensData.userNftUri],
        //@ts-ignore
        value: parseEther(debouncedAmount || "0"),
      });
      const hash = await writeContract(config, request);

      //toast.success("Registration Successful on Avalanche");

      setInTx(false);
      // router.push("/member/dashboard");
    } catch (error) {
      toast({
        duration: 3000,
        position: "top",
        status: "error",
        title: "Error encountered",
      });
      console.log(error);
    }
  };

  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (errors: any) => {
    if (!isValid) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  const onValidSubmit = async (data: any) => {
    //data.preventDefault();

    try {
      if (isSubmitSuccessful) {
      }

      if (isValid) {
        setIsSubmitting(true);
        // Serialize the form data into a JSON object
        const formDataObject = {
          fullName: data.fullName,
          email: data.email,
          country: data?.country,
          sex: data.sex,
          weight: data.weight,
          height: data.height,
          diet: data.diet,
          active: data.active,
          sitting: data.sitting,
          alcohol: data.alcohol,
          smoke: data.smoke,
          sleepLength: data.sleepLength,
          overallHealth: data.overallHealth,
          birthDate: data.birthDate,
          smokingStopped: data.smokingStopped,
          smokingLength: data.smokingLength,
        };
        setFormData(formDataObject);
        const dataToUpload = [formDataObject];
        const cid = await upload({ data: dataToUpload });

        setCid(cid[0]);

        login();

        reset();
        setIsSubmitting(false);
        onClose?.();
        // router.push("/member/dashboard");
      }
    } catch (error) {
      console.log("error:", error);
      setIsSubmitting(false);
      toast({
        status: "error",
        title: "An error occured, please try again...",
        description: "An error occured",
      });
    }
  };
  const dietOptions = [
    "I eat 5 or more servings of vegetables per day",
    "I eat two or more servings of fruit per day",
    "I have two or more servings of dairy (or equivalent) per day",
    "My cereals are mostly whole grains",
    "I eat fast lean protein every day",
    "I eat fast food once per week or less",
    "I eat pastries or cakes once a week or less",
    "I have less than 1 teaspoon of salt per day",
    "I have 2 or less alcoholic drinks on any day",
    "I drink at least 2 litres of water per day",
  ];

  const swiperNestedNext = () => {
    swiperNestedRef.current?.swiper.slideNext();
  };
  const swiperNestedPrev = () => {
    swiperNestedRef.current?.swiper.slidePrev();
  };
  const overallHealthOptions = ["Excellent", "Very good", "Good", "Fair", "Poor"];
  const smokingOptions = ["less than 5 cigarettes", "5 to 10 cigarettes", "11 to 20 cigarettes", "above 20 cigarettes"];
  console.log({ address });
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <HStack spacing={4} align={"center"} mb={3}>
        {activeSlideIndex === 1 && (
          <IconButton
            aria-label=""
            variant={"ghost"}
            rounded={"full"}
            size={"sm"}
            onClick={() => swiperRef.current?.swiper.slidePrev()}
          >
            <BsChevronLeft size={20} />
          </IconButton>
        )}
        <Heading as={"h3"}>{titleText}</Heading>
      </HStack>
      <Box
        as={Swiper}
        onActiveIndexChange={(swiper: SwiperMain) => {
          setActiveSlideIndex(swiper.activeIndex);
        }}
        ref={swiperRef as RefObject<SwiperRef>}
        allowTouchMove={false}
      >
        <SwiperSlide>
          <NewUserType onClick={() => swiperRef.current?.swiper.slideNext()} getValue={setSelectedUserType} />
        </SwiperSlide>
        <SwiperSlide>
          {selectedUserType == "member" && activeSlideIndex > 0 && (
            <>
              <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
              <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
                <Swiper
                  nested
                  allowTouchMove={false}
                  onActiveIndexChange={(swiper: SwiperMain) => {
                    setCurrentStep(swiper.activeIndex + 1);
                  }}
                  ref={swiperNestedRef as RefObject<SwiperRef>}
                >
                  <SwiperSlide>
                    <Stack spacing={5}>
                      <div>
                        <Input className=" w-full max-w-[100%]" {...register("fullName")} placeholder="Full name" />
                        <div className="text-red-500">{errors.fullName?.message}</div>
                      </div>
                      <div>
                        <Input className=" w-full max-w-[100%]" {...register("email")} placeholder="Email address" />
                        <div className="text-red-500">{errors.email?.message}</div>
                      </div>
                      <div>
                        <Input type="date" id="start" {...register("birthDate")} className=" w-full max-w-[100%]" />
                        <div className="text-red-500">{errors.birthDate?.message}</div>
                      </div>
                      <div>
                        <Select
                          className="Select w-full max-w-[100%]"
                          {...register("country")}
                          // placeholder="What's your biological sex?"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select your country
                          </option>

                          {countries.map((country, i) => (
                            <option key={"country" + i} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </Select>
                        <div className="text-red-500">{errors.country?.message}</div>
                      </div>
                      <div>
                        <Select
                          className="Select w-full max-w-[100%]"
                          {...register("sex")}
                          // placeholder="What's your biological sex?"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            What&apos;s your biological sex?
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Select>
                        <div className="text-red-500">{errors.sex?.message}</div>
                      </div>
                    </Stack>

                    <HStack my={6} justify={"flex-end"}>
                      <Button rounded={"full"} colorScheme="gray" onClick={() => swiperNestedNext()}>
                        Continue
                      </Button>
                    </HStack>
                  </SwiperSlide>

                  <SwiperSlide>
                    <Stack spacing={4}>
                      <div>
                        <Input
                          className="Input w-full max-w-[100%]"
                          {...register("weight")}
                          placeholder="What's your weight in kg?"
                        />
                        <div className="text-red-500">{errors.weight?.message}</div>
                      </div>
                      <div>
                        <Input
                          className="Input w-full max-w-[100%]"
                          {...register("height")}
                          placeholder="What's your height in feet and inches?"
                        />
                        <div className="text-red-500">{errors.height?.message}</div>
                      </div>
                      <div>
                        <Select
                          className="Select w-full max-w-[100%]"
                          {...register("diet")}
                          // placeholder='Tell us about your diet?'
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Tell us about your diet?
                          </option>
                          {dietOptions.map((diet, i) => (
                            <option key={"diet" + i} value={diet}>
                              {diet}
                            </option>
                          ))}
                        </Select>
                        <div className="text-red-500">{errors.diet?.message}</div>
                      </div>
                      <div>
                        <Select {...register("active")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            How active are you on an average week?
                          </option>
                          <option value="inactive">inactive</option>
                          <option value="active">active</option>
                          <option value="very active">very active</option>
                        </Select>
                        <div className="text-red-500">{errors.active?.message}</div>
                      </div>
                    </Stack>

                    <HStack gap={4} my={6} justify={"flex-end"}>
                      <Button
                        rounded={"full"}
                        colorScheme="gray"
                        variant={"outline"}
                        onClick={() => swiperNestedPrev()}
                      >
                        Back
                      </Button>
                      <Button rounded={"full"} colorScheme="gray" onClick={() => swiperNestedNext()}>
                        Continue
                      </Button>
                    </HStack>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Stack spacing={4}>
                      <div>
                        <Select {...register("sitting")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            How many hours a day are you sitting
                          </option>
                          {Array.from({ length: 23 }, (_, i) => (
                            <option value={i + 1} key={"sitting" + i}>
                              {i + 1}
                            </option>
                          ))}
                        </Select>
                        <div className="text-red-500">{errors.sitting?.message}</div>
                      </div>
                      <div>
                        <Select {...register("alcohol")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            How much alcohol do you drink
                          </option>
                          <option value="0 - 10 drinks a week">0 - 10 drinks a week</option>
                          <option value="10 - 20 drinks a week">10 - 20 drinks a week</option>
                          <option value="greater than 20 drinks a week">greater than 20 drinks a week</option>
                        </Select>
                        <div className="text-red-500">{errors.alcohol?.message}</div>
                      </div>
                      <div>
                        <Select {...register("smoke")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            Do you smoke?
                          </option>
                          <option value="Never smoked">Never smoked</option>
                          <option value="Ex smoker">Ex smoker</option>
                          <option value="Current smoker">Current smoker</option>
                        </Select>
                        <div className="text-red-500">{errors.smoke?.message}</div>
                      </div>
                      <div>
                        <Select {...register("smokingStopped")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            If you are an ex-smoker, how many months ago did you stop?
                          </option>
                          <option value="less than 6 months ago">less than 6 months ago</option>
                          <option value="six to twelve months ago">six to twelve months ago</option>
                          <option value="more than twelve months ago">more than twelve months ago</option>
                        </Select>
                      </div>
                    </Stack>

                    <HStack gap={4} my={6} justify={"flex-end"}>
                      <Button
                        rounded={"full"}
                        colorScheme="gray"
                        variant={"outline"}
                        onClick={() => swiperNestedPrev()}
                      >
                        Back
                      </Button>
                      <Button rounded={"full"} colorScheme="gray" onClick={() => swiperNestedNext()}>
                        Continue
                      </Button>
                    </HStack>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Stack spacing={4}>
                      <div>
                        <Select {...register("smokingLength")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            If you are a current smoker, how many cigarettes do you smoke per day?
                          </option>
                          {smokingOptions.map((smokingOpt, i) => (
                            <option key={"smokingOpt" + i} value={smokingOpt}>
                              {smokingOpt}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Select {...register("sleepLength")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            How many hours of sleep do you get per day?
                          </option>
                          {Array.from({ length: 13 }, (_, item) => (
                            <option value={item + 1} key={"sleepLength" + item}>
                              {item + 1}
                            </option>
                          ))}
                        </Select>
                        <div className="text-red-500">{errors.sleepLength?.message}</div>
                      </div>
                      <div>
                        <Select {...register("overallHealth")} className="Select w-full max-w-[100%]" defaultValue="">
                          <option value="" disabled>
                            Rate your overall Health
                          </option>
                          {overallHealthOptions.map((healthOpt, i) => (
                            <option key={"overallHealth" + i} value={healthOpt}>
                              {healthOpt}
                            </option>
                          ))}
                        </Select>
                        <div className="text-red-500">{errors.overallHealth?.message}</div>
                      </div>
                    </Stack>

                    <HStack gap={4} my={6} justify={"flex-end"}>
                      <Button
                        rounded={"full"}
                        variant={"outline"}
                        colorScheme="gray"
                        onClick={() => swiperNestedPrev()}
                      >
                        Back
                      </Button>

                      <Button rounded={"full"} colorScheme={"gs-yellow"} type="submit" isLoading={isSubmitting}>
                        Complete Sign Up
                      </Button>
                      {/* {isSubmitting && <Spinner />} */}
                    </HStack>
                  </SwiperSlide>
                </Swiper>
              </form>
            </>
          )}
          {selectedUserType === "nutritionist" && activeSlideIndex === 1 && (
            <Box>
              <NutritionistForm closeFormModal={() => onClose?.()} />
            </Box>
          )}
        </SwiperSlide>
      </Box>
    </>
  );
};

export default RegisterForm;
