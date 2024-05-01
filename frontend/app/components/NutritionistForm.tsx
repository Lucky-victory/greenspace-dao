import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
//import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  resolveIPFSURI,
  uploadPromptToIpfs,
  uploadToThirdWeb,
} from "@/helpers";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
} from "@chakra-ui/react";
import { countries } from "@/utils/countries";
import { Link } from "@chakra-ui/next-js";
import { useFormik } from "formik";
import { useStorageUpload } from "@thirdweb-dev/react";

const NutritionistForm = ({
  showModal = true,
  closeFormModal,
}: {
  showModal?: boolean;
  closeFormModal: () => void;
}) => {
  //const auth = useAuth()
  const { mutateAsync: uploadToThirdWeb } = useStorageUpload();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cid, setCid] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      sex: "",
      country: "",
      birthDate: "",
      credentials: "",
    },
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(true);
      setIsSubmitting(true);
      try {
        const credentialUri = await handleFileUpload();
        const dataToUpload = { ...values, credentials: credentialUri };
        const [uploadUri] = await uploadToThirdWeb({ data: [dataToUpload] });
        console.log({ uploadUri: resolveIPFSURI(uploadUri) });
        setCid(uploadUri);
        await axios.post("/api/email/nutritionist/apply", {
          email: values.email,
          name: values.fullName,
        });
        closeFormModal?.();
        setTimeout(() => {
          if (fileInputRef.current) fileInputRef.current.value = "";
          formik.resetForm();
          // router.push('/nutritionist/dashboard');
          onOpen();
          setIsSubmitting(false);
        }, 2000);
        formikHelpers.setSubmitting(false);
      } catch (error) {}
    },
  });

  // form validation rules
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Field is required"),
    sex: Yup.string().required("Field is required"),
    country: Yup.string().required("Field is required"),
    birthDate: Yup.string().required("Field is required"),
    credentials: Yup.mixed().required("Field is required"),
    // .test(
    //   'fileSize',
    //   'File size is too large',
    //   (value) =>  Array.isArray(value) && value[0]?.size <= 2048 * 2048 // 1 MB
    // )
    // .test(
    //   'fileType',
    //   'Unsupported file type',
    //   (value) =>
    //   Array.isArray(value) && ['image/jpeg', 'image/png'].includes(value[0]?.type)
    // ),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = async (data: any) => {
    //    const cid = await uploadPromptToIpfs(data);
    setIsSubmitting(true);

    setTimeout(() => {
      // router.push('/nutritionist/dashboard');
      onOpen();
      setIsSubmitting(false);
    }, 2000);
    //const {file} = data;
  };

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

  const elem = [];
  return (
    <>
      {/* <h2 className="text-[45px]">Register as a Nutritionist</h2> */}
      <Stack
        as={"form"}
        // className="w-full flex flex-col gap-7"
        //@ts-ignore
        onSubmit={formik.handleSubmit}
      >
        <FormControl isRequired>
          <FormLabel>Full Name:</FormLabel>
          <Input
            isRequired
            className="w-full max-w-[100%]"
            name="fullName"
            onChange={formik.handleChange}
            value={formik.values.fullName}
            placeholder="Full Name"
          />
          <FormErrorMessage className="text-red-200">
            {formik.errors?.fullName}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email:</FormLabel>
          <Input
            isRequired
            className="w-full max-w-[100%]"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="john@example.com"
          />
          <FormErrorMessage className="text-red-200">
            {formik.errors?.email}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Country:</FormLabel>
          <Select
            className="Select w-full max-w-[100%]"
            onChange={formik.handleChange}
            value={formik.values.country}
            isRequired
            name="country"
            // placeholder="What's your biological sex?"
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
          <FormErrorMessage className="text-red-500">
            {formik.errors?.country}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Date of birth:</FormLabel>
          <Input
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
          <FormErrorMessage className="text-red-200">
            {formik.errors?.birthDate}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Sex:</FormLabel>
          <Select
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
          <FormErrorMessage className="text-red-200">
            {formik.errors?.sex}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Upload your credentials:</FormLabel>
          <Input
            type="file"
            ref={fileInputRef!}
            isRequired
            name="credentials"
            className="Input w-full max-w-[100%]"
            placeholder="Upload your credentials"
            onChange={handleFileChange}
          />
          {/* <FormErrorMessage className="text-red-200">{errors.credentials?.message}</FormErrorMessage> */}
        </FormControl>
        <Box mt={4} className="flex">
          <Button type="submit" isLoading={isSubmitting}>
            Register as a Nutritionist
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
              Your application has been successfully submitted. We will contact
              you shortly.
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NutritionistForm;
//  <div className="modal">
//    <label className="modal-overlay" htmlFor="modal-3"></label>
//    <div className="modal-content flex flex-col gap-5 max-w-[90%] lg:max-w-[60%] w-full">
//      <label
//        htmlFor="modal-3"
//        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
//      >
//        ✕
//      </label>
//      {[elem]}
//    </div>
//  </div>;
//  <form
//           className="w-full flex flex-col gap-7"
//           onSubmit={handleSubmit(onSubmit)}
//         >
//           <div>
//             <Input
//               className="w-full max-w-[100%]"
//               {...register("fullName")}
//               placeholder="Full name"
//             />
//             <div className="text-red-200">{errors.fullName?.message}</div>
//           </div>
//           <div>
//             <Input
//               type="date"
//               id="start"
//               {...register("birthDate")}
//               className=" w-full max-w-[100%]"
//             />
//             <div className="text-red-200">{errors.birthDate?.message}</div>
//           </div>
//           <div>
//             <Select
//               className="select w-full max-w-[100%]"
//               {...register("sex")}
//               placeholder="What's your biological sex?"
//               defaultValue=""
//             >
//               <option value="" disabled>
//                 What&apos;s your biological sex?
//               </option>
//               <option value="name">Male</option>
//               <option value="female">Female</option>
//             </Select>
//             <div className="text-red-200">{errors.sex?.message}</div>
//           </div>
//           <div>
//             <Input
//               type="file"
//               {...register("credentials")}
//               className="Input w-full max-w-[100%]"
//               placeholder="Upload your credentials"
//               onChange={handleFileChange}
//             ></Input>
//             <div className="text-red-200">{errors.credentials?.message}</div>
//           </div>
//           <div className="flex">
//             <Button type="submit" isLoading={isSubmitting}>
//               Register as a Nutritionist
//             </Button>
//           </div>
//         </form>
