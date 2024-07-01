import Head from "next/head";

import { Box } from "@chakra-ui/react";
import PageLoader from "src/components/PageLoader";
import { HeaderNav } from "src/components/HeaderNav";
import HeroArea from "src/components/HeroArea";
import CommunityArea from "src/components/CommunityArea";
import CoachArea from "src/components/CoachArea";
import Footer from "src/components/Footer";
import { useEffect, useState } from "react";
import { useLocalStorage } from "src/hooks/common";

export default function Home() {
  // const [val, setVal] = useLocalStorage("test", {});
  // console.log({ val });

  // const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // setVal({ home: 1 });
      // setShowLoader(false);
      if (timeoutId) clearTimeout(timeoutId);
    }, 800);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  return (
    <>
      <Head>
        <title>GreenspaceDAO | Live Longer and Healthier</title>
        <meta
          name="description"
          content="Want to Live Healthier and Longer?
We're building healthy communities focused on longevity all around the world, we want to help people live longer, better through community inclusive programs that improve productivity,"
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
          maxW={"1350"}
          mx={"auto"}
          as="main"
          bgRepeat={"no-repeat"}
          bgGradient={"linear(236deg,#DCDDDB 0%,, #329648 0%, black 100%)"}
          minH={"100vh"}
          pos={"relative"}
        >
          <Box h={"full"} bg={"rgba(41, 41, 41,0.44)"} backdropFilter={"blur(30px)"}>
            <HeaderNav />

            <HeroArea />

            <CommunityArea />
            <CoachArea />
          </Box>
          <Footer />
        </Box>
      </PageLoader>
    </>
  );
}
