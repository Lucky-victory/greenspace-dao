import React, { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { resolveIPFSURI } from "src/helpers";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { countries } from "src/utils/countries";
import { Link } from "@chakra-ui/next-js";
import { useFormik } from "formik";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useAddNutritionistMutation } from "src/state/services";
import { Sex } from "src/state/types";
import { useWallet } from "src/context/WalletProvider";
import { BsUpload } from "react-icons/bs";
import { usePrivy } from "@privy-io/react-auth";

export interface NutritionistFormFields {
  fullName: string;
  birthDate: string;
  sex: string;
  email: string;
  country: string;
}
const NutritionistForm = ({
  onSubmit = () => {},
  closeFormModal,
  initialValues = {}
}: {
  onSubmit: (formData: NutritionistFormFields, credentialUri: string,uploadUri:string) => void;
  closeFormModal?: () => void;
  initialValues?: Partial<NutritionistFormFields>;
}) => {
  const toast = useToast({
    position: "top",
    duration: 3000,
    status: "success",
    title: "Application was successful",
    isClosable: true
  });
  const { mutateAsync: uploadToThirdWeb } = useStorageUpload();
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { connectWallet } = usePrivy();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cid, setCid] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [addNutritionists, { isLoading }] = useAddNutritionistMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      sex: "",
      country: "",
      birthDate: "",
      credentials: "",
      ...initialValues
    },
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(true);
      setIsSubmitting(true);
      try {
        setIsUploading(true);
        const credentialUri = await handleFileUpload();
        const dataToUpload = { ...values, credentials: credentialUri };
        const [uploadUri] = await uploadToThirdWeb({ data: [dataToUpload] });
        setIsUploading(false);

        setCid(uploadUri);
        await new Promise<void>((resolve, reject) => {
          resolve(onSubmit?.(values, credentialUri as string,uploadUri));
        });
        await axios.post("/api/email/nutritionist/apply", {
          email: values.email,
          name: values.fullName
        });
        closeFormModal?.();
        onOpen();
        toast({
          status: "success",
          title: "Application was successful"
        });
        setTimeout(() => {
          if (fileInputRef.current) fileInputRef.current.value = "";
          formik.resetForm();
          router.push("/nutritionist/check-status");
          setIsSubmitting(false);
        }, 2000);
        formikHelpers.setSubmitting(false);
      } catch (error) {
        formikHelpers.setSubmitting(false);
        setIsSubmitting(false);
        toast({
          status: "error",
          title: "An error occured, please try again...",
          description: "An error occured"
        });
      }
    }
  });

  function loadingText() {
    if (isUploading) return "Uploading credentials...";
    // if (isLoading) return "Creating account...";
    return "Submitting...";
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setFileToUpload(file);
  };

  const handleFileUpload = async () => {
    try {
      const [fileUri] = await uploadToThirdWeb({ data: [fileToUpload] });
      return resolveIPFSURI(fileUri, false);
    } catch (error) {}
  };

  const handleCustomUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Stack
        as={"form"}
        // @ts-ignore
        onSubmit={formik.handleSubmit}
      >
        {!isConnected && (
          <HStack mb={2}>
            <Button size={"lg"} rounded={"full"} colorScheme="gs-yellow" onClick={() => connectWallet()}>
              Connect wallet
            </Button>
          </HStack>
        )}
        <FormControl isRequired>
          <FormLabel>Full Name:</FormLabel>
          <Input
            rounded={"full"}
            isRequired
            className="w-full max-w-[100%]"
            name="fullName"
            onChange={formik.handleChange}
            value={formik.values.fullName}
            placeholder="Full Name"
          />
          <FormErrorMessage className="text-red-200">{formik.errors?.fullName}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email:</FormLabel>
          <Input
            rounded={"full"}
            isRequired
            className="w-full max-w-[100%]"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="john@example.com"
          />
          <FormErrorMessage className="text-red-200">{formik.errors?.email}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Country:</FormLabel>
          <Select
            rounded={"full"}
            className="Select w-full max-w-[100%]"
            onChange={formik.handleChange}
            value={formik.values.country}
            isRequired
            name="country"
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
          <FormErrorMessage className="text-red-500">{formik.errors?.country}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Date of birth:</FormLabel>
          <Input
            rounded={"full"}
            type="date"
            id="start"
            min={"1930"}
            max={"2010"}
            isRequired
            onChange={formik.handleChange}
            name="birthDate"
            value={formik.values.birthDate}
            className=" w-full max-w-[100%]"
          />
          <FormErrorMessage className="text-red-200">{formik.errors?.birthDate}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Sex:</FormLabel>
          <Select
            rounded={"full"}
            className="select w-full max-w-[100%]"
            name="sex"
            isRequired
            onChange={formik.handleChange}
            value={formik.values.sex}
            placeholder="What's your biological sex?"
          >
            <option value="" disabled>
              What&apos;s your biological sex?
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage className="text-red-200">{formik.errors?.sex}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Upload your credentials:</FormLabel>
          <Input
            rounded={"full"}
            type="file"
            ref={fileInputRef}
            isRequired
            name="credentials"
            className="Input w-full max-w-[100%] hidden"
            placeholder="Upload your credentials"
            onChange={handleFileChange}
          />
          <Button onClick={handleCustomUploadClick} colorScheme="gs-green" size={"sm"} rounded={"full"} gap={3}>
            <BsUpload /> <Text as={"span"}>Upload (.pdf,.docx)</Text>{" "}
          </Button>
          {fileToUpload && (
            <Box bg={"gray.800"} mt={2} color={"gray.300"} px={2} rounded={"sm"}>
              <Text as="span" fontSize={"14px"}>
                {fileToUpload?.name}
              </Text>
            </Box>
          )}
        </FormControl>
        <Box mt={5} className="flex">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText={loadingText()}
            colorScheme={"gs-yellow"}
            rounded={"full"}
          >
            Complete registration
          </Button>
        </Box>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Application success</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight={"semibold"} mb={4}>
              Your application has been successfully submitted. We will contact you shortly.
            </Text>
            <Text fontSize={"15px"}>
              You can also visit the{" "}
              <Link href={"/nutritionist/check-status"} color={"gs-yellow.400"}>
                status page
              </Link>{" "}
              to check your application status{" "}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose} rounded={"full"}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NutritionistForm;
