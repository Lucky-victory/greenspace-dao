import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  IconButton,
  Image,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

import { useAccount } from "wagmi";
import * as w from "@solana/wallet-adapter-react-ui";

import { useAppContext } from "@/context/state";
import { useAuth, useResize } from "@/hooks";
import { useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LuMenu } from "react-icons/lu";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletAdaptor from "./WalletAdapterBtn";
import RegisterForm from "./RegisterForm";
import AuthBtn from "./AuthBtn";
import LoginBtn from "./LoginBtn";
import isEmpty from "just-is-empty";
// import { useConnectModal } from "@rainbow-me/rainbowkit";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
export function HeaderNav() {
  const { isMobileSize, isTabletSize } = useResize();

  const linkStyles = {
    display: isMobileSize || isTabletSize ? "block" : "inline-block",
    fontSize: "16px",
    textTransform: "capitalize" as any,
    pos: "relative" as any,
    pb: "2px",
    _before: {
      content: `''`,
      pos: "absolute",
      bottom: 0,
      left: 0,
      w: 0,
      h: "3px",
      bg: "gs-yellow.400",
      transition: "0.4s ease-in-out",
    },
    _hover: {
      textDecoration: "none",
      color: "gs-yellow.400",
      _before: { w: "full" },
    },
  };

  const router = useRouter();
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { openConnectModal } = useConnectModal();
  const {
    isOpen: isMobileNavbarOpen,
    onToggle: onMobileNavbarToggle,
    // onOpen: onMobileNavbarOpen,
    onClose: onMobileNavbarClose,
  } = useDisclosure();

  const { setAddress, setEnsName, user } = useAppContext();

  // const { publicKey, signMessage } = useWallet();
  const { address } = useAccount();
  //const address = publicKey?.toBase58();
  const {
    user: authUser,
    isAuthenticated,
    isLoading,
    session: userSession,
  } = useAuth();
  // console.log({ authUser });

  // console.log({ session, status, user, isAuthenticated, isLoading });
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     startTransition(() => {
  //       // router.push("/member/dashboard");
  //     });
  //   }
  // }),
  //   [isAuthenticated];
  useEffect(() => {
    setAddress(`${address}`);
    //setEnsName(ensName);
  }, [address, setAddress]);

  const isLoggedin = () => user && user?.userAddress !== "";
  const links = [
    <>
      <ListItem>
        <Link {...linkStyles} href={"/blog"}>
          Blog
        </Link>
      </ListItem>
      <ListItem>
        <Link {...linkStyles} href={"/communities"}>
          Communities
        </Link>
      </ListItem>
      <ListItem>
        <Link {...linkStyles} href={"/proposals"}>
          Governance
        </Link>
      </ListItem>
    </>,
  ];
  return (
    <>
      <HStack
        minH={"50px"}
        pl={5}
        bg={"blackAlpha.300"}
        justify={"space-between"}
        backdropFilter={"blur(5px)"}
      >
        <Heading>
          <Image
            src={"/logo-with-text.png"}
            alt={"Greenspace Logo"}
            width={"200px"}
            //   height={"100px"}
          />
        </Heading>

        <List
          display={"flex"}
          gap={4}
          fontWeight={500}
          hidden={isMobileSize || isTabletSize}
        >
          {[links]}
        </List>

        <HStack
          clipPath={"polygon(14% 0, 100% 0%, 100% 100%, 0% 100%);"}
          bg={"gs-yellow.400"}
          minW={{ base: 250, lg: 350 }}
          px={4}
          pr={8}
          py={2}
          justify={"flex-end"}
        >
          <HStack>
            {/* {" "}
            {ready && !authenticated && (
              <Button
                shadow={"md"}
                rounded={"lg"}
                onClick={() => handleLogin()}
              >
                Connect wallet
              </Button>
            )}
            <Box>
              {authenticated && walletReady && (
                <Button
                  gap={2}
                  // onClick={() => onOpen()}
                  variant={"outline"}
                  rounded={"lg"}
                  shadow={"md"}
                  colorScheme={"gray"}
                  fontWeight={700}
                >
                  <BoringAvatars variant="beam" size={24} />
                  {maskWalletAddress(wallets[0]?.address, 5)}
                  <LuChevronDown size={24} />{" "}
                </Button>
              )}
            </Box> */}
          </HStack>
          {!(isMobileSize || isTabletSize) && (
            <>
              {address && !isLoggedin() && isEmpty(userSession?.user) && (
                <HStack spacing={4}>
                  <LoginBtn />
                  <Button
                    // colorScheme="primaryColor"
                    variant={"solid"}
                    onClick={() => onOpen()}
                  >
                    Register
                  </Button>
                </HStack>
              )}
              {/* {!address && <WalletAdaptor />}{" "} */}
              {!address && (
                // <Button size={"lg"} onClick={openConnectModal}>
                //   Connect Wallet
                // </Button>
                <DynamicWidget />
              )}{" "}
              {userSession && <AuthBtn userSession={userSession} />}
            </>
          )}
          {/*{!(isMobileSize || isTabletSize) && (
            <>
              
              {userSession ? (
                <AuthBtn userSession={userSession} />
              ) : (
                <WalletAdaptor />
              )}
            </>
          )}*/}

          {(isMobileSize || isTabletSize) && (
            <IconButton
              ml={3}
              onClick={onMobileNavbarToggle}
              fontSize={24}
              aria-label="toggle mobile menu"
            >
              <LuMenu />
            </IconButton>
          )}
        </HStack>
      </HStack>
      {(isMobileSize || isTabletSize) && (
        <Drawer isOpen={isMobileNavbarOpen} onClose={onMobileNavbarClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader />
            <DrawerBody>
              <List
                my={10}
                display={"flex"}
                flexDir={"column"}
                gap={4}
                fontWeight={500}
              >
                {[links]}
              </List>
              <HStack
                // clipPath={"polygon(14% 0, 100% 0%, 100% 100%, 0% 100%);"}
                // bg={"gs-yellow.400"}
                minW={{ base: 150, lg: 350 }}
                p={2}
                // justify={"center"}
              >
                {/* <Button
                  display={"block"}
                  w={"full"}
                  layerStyle={"with-shadow"}
                  onClick={handleLogin}
                >
                  Connect Wallet
                </Button> */}

                <>
                  {address && !isLoggedin() && isEmpty(userSession?.user) && (
                    <HStack spacing={4}>
                      <LoginBtn />
                      <Button
                        // colorScheme='primaryColor'
                        variant={"solid"}
                        onClick={() => onOpen()}
                      >
                        Register
                      </Button>
                    </HStack>
                  )}
                  {/* {!address && <WalletAdaptor />} */}
                  {!address && (
                    // <Button size={"lg"} onClick={openConnectModal}>
                    //   Connect Wallet
                    // </Button>
                    <DynamicWidget />
                  )}
                  {/* 
                  {userSession ? (
                    <AuthBtn userSession={userSession} />
                  ) : (
                    <WalletAdaptor />
                  )} */}
                  {userSession && <AuthBtn userSession={userSession} />}
                </>
              </HStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
      <RegisterForm isOpen={isOpen} onClose={onClose} />
    </>
  );
}
