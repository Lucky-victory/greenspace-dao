import React, { useState, useRef } from "react";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import {
  Stack,
  Button,
  HStack,
  Input,
  Select,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import SwiperMain from "swiper";
import { countries } from "src/utils/countries";
import { useStorageUpload } from "@thirdweb-dev/react";
import {
  MemberRegisterFormFields,
  dietOptions,
  overallHealthOptions,
  smokingOptions,
  validationSchema,
} from "../RegisterForm";
import OnboardingProgress from "../OnboardingProgress";

interface RegisterComponentProps {
  onClose?: () => void;

  initialValues?: Partial<MemberRegisterFormFields>;
  onSubmit?: (formData: MemberRegisterFormFields, userCid?: string) => void;
}

export const MemberRegisterForm: React.FC<RegisterComponentProps> = ({
  onClose,
  onSubmit = () => {},
  initialValues = {}, // Default to empty object if not provided
}) => {
  const toast = useToast();

  const swiperNestedRef = useRef<SwiperRef>();

  const [amount] = useState("0.01");
  // const debouncedAmount = useDebounce<string>(amount, 500);
  const [cid, setCid] = useState<string>("");
  const { mutateAsync: upload } = useStorageUpload();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleSubmit = async (values: MemberRegisterFormFields, helpers: FormikHelpers<MemberRegisterFormFields>) => {
    try {
      helpers.setSubmitting(true);

      const formDataObject = { ...values };
      const dataToUpload = [formDataObject];
      const uploadedCid = await upload({ data: dataToUpload });
      const userCid = uploadedCid[0];
      setCid(userCid);
      await new Promise((resolve, reject) => {
        resolve(onSubmit?.(formDataObject, userCid));
      });
      helpers.setSubmitting(false);
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
      <SwiperSlide>
        <>
          <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
          <Formik
            initialValues={
              {
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
              } as MemberRegisterFormFields
            }
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
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
                    <Stack px={1} spacing={5}>
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
                    <Stack px={1} spacing={4}>
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
                    <Stack px={1} spacing={4}>
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
                    <Stack px={1} spacing={4}>
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
                            <Select {...field} id="overallHealth" placeholder="Rate your overall health" rounded="full">
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
                      <Button
                        rounded="full"
                        colorScheme="gs-yellow"
                        type="submit"
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                      >
                        Complete Sign Up
                      </Button>
                    </HStack>
                  </SwiperSlide>
                </Swiper>
              </Form>
            )}
          </Formik>
        </>
      </SwiperSlide>
      {/* </Box> */}
    </>
  );
};

export default MemberRegisterForm;
