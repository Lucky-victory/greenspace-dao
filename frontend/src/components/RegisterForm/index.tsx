import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, FieldProps } from "formik";
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
  FormControl,
  FormLabel,
  FormErrorMessage,
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

const validationSchema = Yup.object().shape({
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
  smokingLength: Yup.string(),
});

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

const overallHealthOptions = ["Excellent", "Very good", "Good", "Fair", "Poor"];
const smokingOptions = ["less than 5 cigarettes", "5 to 10 cigarettes", "11 to 20 cigarettes", "above 20 cigarettes"];

interface RegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Partial<RegisterFormFields>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isOpen, onClose, initialValues }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>();

  return (
    <Modal scrollBehavior="inside" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent rounded="30px" alignSelf="center">
        <ModalHeader fontSize={{ lg: "3xl", base: "xl" }}>
          <HStack spacing={4} align="center">
            {activeSlideIndex === 1 && (
              <IconButton
                aria-label="Go back"
                variant="ghost"
                rounded="full"
                size="sm"
                onClick={() => swiperRef.current?.swiper.slidePrev()}
              >
                <BsChevronLeft size={20} />
              </IconButton>
            )}
            <span>Register</span>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RegisterComponent
            swiperRef={swiperRef}
            setActiveSlideIndex={setActiveSlideIndex}
            activeSlideIndex={activeSlideIndex}
            onClose={onClose}
            initialValues={initialValues} // Pass initialValues to RegisterComponent
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

interface RegisterComponentProps {
  swiperRef: React.MutableRefObject<SwiperRef | undefined>;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose?: () => void;
  activeSlideIndex: number;
  titleText?: string;
  initialValues?: Partial<RegisterFormFields>;
}

export const RegisterComponent: React.FC<RegisterComponentProps> = ({
  swiperRef,
  setActiveSlideIndex,
  activeSlideIndex,
  onClose,
  titleText = "Register",
  initialValues = {}, // Default to empty object if not provided
}) => {
  const [createUser] = useAddUserMutation();
  const { signMessage } = useSignMessage();
  const { address } = useAccount();
  const [sendUserToAI] = useSendUserInfoToAIMutation();
  const toast = useToast();
  const router = useRouter();
  const swiperNestedRef = useRef<SwiperRef>();
  const [selectedUserType, setSelectedUserType] = useState<RegisterType>("member");
  const { setUser } = useAppContext();
  const [amount] = useState("0.01");
  const debouncedAmount = useDebounce<string>(amount, 500);
  const [cid, setCid] = useState<string>("");
  const { mutateAsync: upload } = useStorageUpload();
  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod) => {
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
        } else {
          await createUser({
            fullName: initialValues.fullName,
            authId: user?.id,
            address: address!,
            userType: selectedUserType,
            userCid: cid,
          }).unwrap();
        }
        router.push("/member/dashboard");
        sendUserToAI(initialValues);
      }
      setUser?.({
        ...user,
        userAddress: address,
        userCidData: cid,
        name: initialValues.fullName,
      });
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleSubmit = async (values: RegisterFormFields) => {
    try {
      const formDataObject = { ...values };
      const dataToUpload = [formDataObject];
      const uploadedCid = await upload({ data: dataToUpload });
      setCid(uploadedCid[0]);
      login();
      onClose?.();
    } catch (error) {
      console.error("Error:", error);
      toast({
        status: "error",
        title: "An error occurred, please try again...",
        description: "An error occurred",
      });
    }
  };

  return (
    <>
      <HStack spacing={4} align="center" mb={3}>
        {activeSlideIndex === 1 && (
          <IconButton
            aria-label="Go back"
            variant="ghost"
            rounded="full"
            size="sm"
            onClick={() => swiperRef.current?.swiper.slidePrev()}
          >
            <BsChevronLeft size={20} />
          </IconButton>
        )}
        <Heading as="h3">{titleText}</Heading>
      </HStack>
      <Box
        as={Swiper}
        onActiveIndexChange={(swiper: SwiperMain) => {
          setActiveSlideIndex(swiper.activeIndex);
        }}
        ref={swiperRef as React.RefObject<SwiperRef>}
        allowTouchMove={false}
      >
        <SwiperSlide>
          <NewUserType onClick={() => swiperRef.current?.swiper.slideNext()} getValue={setSelectedUserType} />
        </SwiperSlide>
        <SwiperSlide>
          {selectedUserType === "member" && activeSlideIndex > 0 && (
            <>
              <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
              <Formik
                initialValues={{
                  fullName: "",
                  email: "",
                  birthDate: "",
                  country: "",
                  sex: "",
                  weight: "",
                  height: "",
                  diet: "",
                  active: "",
                  sitting: "",
                  alcohol: "",
                  smoke: "",
                  smokingStopped: "",
                  smokingLength: "",
                  sleepLength: "",
                  overallHealth: "",
                  ...initialValues, // Merge with provided initialValues
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form>
                    <Swiper
                      nested
                      allowTouchMove={false}
                      onActiveIndexChange={(swiper: SwiperMain) => {
                        setCurrentStep(swiper.activeIndex + 1);
                      }}
                      ref={swiperNestedRef as React.RefObject<SwiperRef>}
                    >
                      <SwiperSlide>
                        <Stack spacing={5}>
                          <Field name="fullName">
                            {({ field }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.fullName && touched.fullName)}>
                                <FormLabel htmlFor="fullName">Full Name</FormLabel>
                                <Input {...field} id="fullName" placeholder="Full name" rounded="full" />
                                <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="email">
                            {({ field }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.email && touched.email)}>
                                <FormLabel htmlFor="email">Email Address</FormLabel>
                                <Input {...field} id="email" placeholder="Email address" rounded="full" />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="birthDate">
                            {({ field }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.birthDate && touched.birthDate)}>
                                <FormLabel htmlFor="birthDate">Birth Date</FormLabel>
                                <Input {...field} type="date" id="birthDate" rounded="full" />
                                <FormErrorMessage>{errors.birthDate}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="country">
                            {({ field }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.country && touched.country)}>
                                <FormLabel htmlFor="country">Country</FormLabel>
                                <Select {...field} id="country" placeholder="Select your country" rounded="full">
                                  {countries.map((country, i) => (
                                    <option key={`country${i}`} value={country.name}>
                                      {country.name}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{errors.country}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>
                        <HStack my={6} justify="flex-end">
                          <Button
                            rounded="full"
                            colorScheme="gray"
                            onClick={() => swiperNestedRef.current?.swiper.slideNext()}
                          >
                            Continue
                          </Button>
                        </HStack>
                      </SwiperSlide>

                      <SwiperSlide>
                        <Stack spacing={4}>
                          <Field name="sex">
                            {({ field }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.sex && touched.sex)}>
                                <FormLabel htmlFor="sex">Biological Sex</FormLabel>
                                <Select {...field} id="sex" placeholder="What's your biological sex?" rounded="full">
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </Select>
                                <FormErrorMessage>{errors.sex}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <Field name="weight">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.weight && form.touched.weight)}>
                                <FormLabel htmlFor="weight">Weight (kg)</FormLabel>
                                <Input
                                  {...field}
                                  id="weight"
                                  placeholder="Enter your weight"
                                  type="number"
                                  rounded="full"
                                />
                                <FormErrorMessage>{errors.weight}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="height">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.height && form.touched.height)}>
                                <FormLabel htmlFor="height">Height (cm)</FormLabel>
                                <Input
                                  {...field}
                                  id="height"
                                  placeholder="Enter your height"
                                  type="number"
                                  rounded="full"
                                />
                                <FormErrorMessage>{errors.height}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="diet">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.diet && form.touched.diet)}>
                                <FormLabel htmlFor="diet">Diet</FormLabel>
                                <Select {...field} id="diet" placeholder="Select your diet" rounded="full">
                                  {dietOptions.map((option, index) => (
                                    <option key={`diet${index}`} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{errors.diet}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>
                        <HStack my={6} justify="space-between">
                          <Button
                            rounded="full"
                            variant="outline"
                            onClick={() => swiperNestedRef.current?.swiper.slidePrev()}
                          >
                            Back
                          </Button>
                          <Button
                            rounded="full"
                            colorScheme="gray"
                            onClick={() => swiperNestedRef.current?.swiper.slideNext()}
                          >
                            Continue
                          </Button>
                        </HStack>
                      </SwiperSlide>
                      <SwiperSlide>
                        <Stack spacing={4}>
                          <Field name="active">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.active && form.touched.active)}>
                                <FormLabel htmlFor="active">Activity Level</FormLabel>
                                <Select {...field} id="active" placeholder="Select your activity level" rounded="full">
                                  <option value="sedentary">Sedentary (little to no exercise)</option>
                                  <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                                  <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                                  <option value="very">Very active (hard exercise 6-7 days/week)</option>
                                  <option value="extra">Extra active (very hard exercise & physical job)</option>
                                </Select>
                                <FormErrorMessage>{errors.active}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="sitting">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.sitting && form.touched.sitting)}>
                                <FormLabel htmlFor="sitting">Hours Sitting Per Day</FormLabel>
                                <Input
                                  {...field}
                                  id="sitting"
                                  placeholder="Enter hours spent sitting"
                                  type="number"
                                  rounded="full"
                                />
                                <FormErrorMessage>{errors.sitting}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="alcohol">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.alcohol && form.touched.alcohol)}>
                                <FormLabel htmlFor="alcohol">Alcohol Consumption</FormLabel>
                                <Select
                                  {...field}
                                  id="alcohol"
                                  placeholder="Select your alcohol consumption"
                                  rounded="full"
                                >
                                  <option value="none">None</option>
                                  <option value="occasional">Occasional (1-2 drinks/week)</option>
                                  <option value="moderate">Moderate (3-7 drinks/week)</option>
                                  <option value="frequent">Frequent (8-14 drinks/week)</option>
                                  <option value="heavy">Heavy (14+ drinks/week)</option>
                                </Select>
                                <FormErrorMessage>{errors.alcohol}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>{" "}
                          <Field name="smoke">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(form.errors.smoke && form.touched.smoke)}>
                                <FormLabel htmlFor="smoke">Smoking Habits</FormLabel>
                                <Select {...field} id="smoke" placeholder="Select your smoking habits" rounded="full">
                                  <option value="never">Never smoked</option>
                                  <option value="former">Former smoker</option>
                                  <option value="current">Current smoker</option>
                                </Select>
                                <FormErrorMessage>{errors.smoke}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>
                        <HStack my={6} justify="space-between">
                          <Button
                            rounded="full"
                            variant="outline"
                            onClick={() => swiperNestedRef.current?.swiper.slidePrev()}
                          >
                            Back
                          </Button>
                          <Button
                            rounded="full"
                            colorScheme="gray"
                            onClick={() => swiperNestedRef.current?.swiper.slideNext()}
                          >
                            Continue
                          </Button>
                        </HStack>
                      </SwiperSlide>
                      <SwiperSlide>
                        <Stack spacing={4}>
                          <Field name="smokingStopped">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(form.errors.smokingStopped && form.touched.smokingStopped)}>
                                <FormLabel htmlFor="smokingStopped">Years Since Quitting (if former smoker)</FormLabel>
                                <Input
                                  {...field}
                                  id="smokingStopped"
                                  placeholder="Enter years since quitting"
                                  type="number"
                                  rounded="full"
                                />
                                <FormErrorMessage>{errors.smokingStopped}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="smokingLength">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(form.errors.smokingLength && form.touched.smokingLength)}>
                                <FormLabel htmlFor="smokingLength">Cigarettes per day (if current smoker)</FormLabel>
                                <Select {...field} id="smokingLength" placeholder="Select option" rounded="full">
                                  {smokingOptions.map((option, i) => (
                                    <option key={`smokingOpt${i}`} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{errors.smokingLength}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>{" "}
                          <Field name="sleepLength">
                            {({ field }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.sleepLength && touched.sleepLength)}>
                                <FormLabel htmlFor="sleepLength">Hours of sleep per day</FormLabel>
                                <Select {...field} id="sleepLength" placeholder="Select hours" rounded="full">
                                  {Array.from({ length: 13 }, (_, i) => (
                                    <option key={`sleepLength${i}`} value={i + 1}>
                                      {i + 1}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{errors.sleepLength}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="overallHealth">
                            {({ field }: FieldProps) => (
                              <FormControl isInvalid={!!(errors.overallHealth && touched.overallHealth)}>
                                <FormLabel htmlFor="overallHealth">Overall Health</FormLabel>
                                <Select
                                  {...field}
                                  id="overallHealth"
                                  placeholder="Rate your overall health"
                                  rounded="full"
                                >
                                  {overallHealthOptions.map((option, i) => (
                                    <option key={`overallHealth${i}`} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{errors.overallHealth}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>

                        <HStack gap={4} my={6} justify="flex-end">
                          <Button
                            rounded="full"
                            variant="outline"
                            colorScheme="gray"
                            onClick={() => swiperNestedRef.current?.swiper.slidePrev()}
                          >
                            Back
                          </Button>
                          <Button rounded="full" colorScheme="gs-yellow" type="submit">
                            Complete Sign Up
                          </Button>
                        </HStack>
                      </SwiperSlide>
                      {/* Last slide (update with missing fields) */}
                      {/* <SwiperSlide>
                        <Stack spacing={4}>
                          <Field name="sleepLength">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(form.errors.sleepLength && form.touched.sleepLength)}>
                                <FormLabel htmlFor="sleepLength">Hours of sleep per day</FormLabel>
                                <Select {...field} id="sleepLength" placeholder="Select hours" rounded="full">
                                  {Array.from({ length: 13 }, (_, i) => (
                                    <option key={`sleepLength${i}`} value={i + 1}>
                                      {i + 1}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{form.errors.sleepLength}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="overallHealth">
                            {({ field, form }: FieldProps) => (
                              <FormControl isInvalid={!!(form.errors.overallHealth && form.touched.overallHealth)}>
                                <FormLabel htmlFor="overallHealth">Overall Health</FormLabel>
                                <Select
                                  {...field}
                                  id="overallHealth"
                                  placeholder="Rate your overall health"
                                  rounded="full"
                                >
                                  {overallHealthOptions.map((option, i) => (
                                    <option key={`overallHealth${i}`} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{form.errors.overallHealth}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>

                        <HStack gap={4} my={6} justify="flex-end">
                          <Button
                            rounded="full"
                            variant="outline"
                            colorScheme="gray"
                            onClick={() => swiperNestedRef.current?.swiper.slidePrev()}
                          >
                            Back
                          </Button>
                          <Button rounded="full" colorScheme="gs-yellow" type="submit">
                            Complete Sign Up
                          </Button>
                        </HStack>
                      </SwiperSlide> */}

                      <SwiperSlide>{/* <Stack spacing={4}> */}</SwiperSlide>
                    </Swiper>
                  </Form>
                )}
              </Formik>
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
