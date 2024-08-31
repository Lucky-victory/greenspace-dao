import Head from "next/head";
import { Box, useColorMode, useColorModeValue } from "@chakra-ui/react";
import PageLoader from "src/components/PageLoader";
import { HeaderNav } from "src/components/HeaderNav";
import HeroArea from "src/components/HeroArea";
import CommunityArea from "src/components/CommunityArea";
import CoachArea from "src/components/CoachArea";
import Footer from "src/components/Footer";
import { useEffect } from "react";

export default function Home() {
  const { colorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(236deg, #DCDDDB 0%, #329648 0%, #FFFFFF 100%)",
    "linear(236deg, #DCDDDB 0%, #329648 0%, #000000 100%)"
  );
  const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.44)", "rgba(41, 41, 41, 0.44)");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (timeoutId) clearTimeout(timeoutId);
    }, 800);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <Head>
        <title>GreenspaceDAO | Your Path to a Longer, Healthier Life</title>
        <meta
          name="description"
          content="Ready to supercharge your life? Join GreenspaceDAO and unlock the secrets to living longer and feeling amazing. We're building a global tribe of health enthusiasts who are redefining what it means to thrive. Come for the longevity tips, stay for the awesome community!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:image" content={"https://greenspacedao.xyz/opengraph.png"} />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <PageLoader isLoading={false}>
        <Box
          maxW={"100%"}
          mx={"auto"}
          as="main"
          bgRepeat={"no-repeat"}
          bgGradient={bgGradient}
          minH={"100vh"}
          pos={"relative"}
        >
          <HeaderNav />
          <Box h={"full"} bg={overlayBg} backdropFilter={"blur(30px)"} pt={10} pb={10}>
            <Box maxW={"1440px"} mx={"auto"}>
              <HeroArea />
              <CommunityArea />
              <CoachArea />
            </Box>
          </Box>
          <Footer />
        </Box>
      </PageLoader>
    </>
  );
}
