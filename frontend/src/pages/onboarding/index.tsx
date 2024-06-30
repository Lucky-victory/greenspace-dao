import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { useRef, useState } from "react";
import { RegisterComponent } from "src/components/RegisterForm";
import { SwiperRef } from "swiper/react";

export default function OnboardingPage() {
  const swiperRef = useRef<SwiperRef>();

  return (
    <>
      <Head>
        <title>Onboarding - GreenspaceDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mx={"auto"} maxW={800} px={{ base: 2, md: 6 }} py={8}>
        <Box bg={"black"} my={{ base: 5, md: 8 }} p={{ base: 4, md: 6 }} rounded={30}>
          <RegisterComponent isOnboarding titleText="Complete sign up" swiperRef={swiperRef} />
        </Box>
      </Box>
    </>
  );
}
