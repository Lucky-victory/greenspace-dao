import {
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

import { LuMenu } from "react-icons/lu";

import { useResize } from "src/hooks/common";
import { ConnectOrLogout } from "../Auth/ConnectOrRegister";
import RegisterForm from "../RegisterForm";

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isMobileNavbarOpen,
    onToggle: onMobileNavbarToggle,
    // onOpen: onMobileNavbarOpen,
    onClose: onMobileNavbarClose,
  } = useDisclosure();

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
      <ListItem>
        <Link {...linkStyles} href={"/shop/supplements"}>
          Shop
        </Link>
      </ListItem>
    </>,
  ];
  return (
    <>
      <HStack
        minH={{ base: "50px", md: "70px" }}
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

        <List className="is-nav" display={"flex"} gap={4} fontWeight={500} hidden={isMobileSize || isTabletSize}>
          {[links]}
        </List>

        <HStack
          // clipPath={"polygon(14% 0, 100% 0%, 100% 100%, 0% 100%);"}
          // bg={"gs-yellow.400"}
          minW={{ base: 250, lg: 350 }}
          px={4}
          pr={8}
          py={2}
          h={"full"}
          justify={"flex-end"}
        >
          {!(isMobileSize || isTabletSize) && <ConnectOrLogout openModal={onOpen} />}

          {(isMobileSize || isTabletSize) && (
            <IconButton ml={3} onClick={onMobileNavbarToggle} fontSize={24} aria-label="toggle mobile menu">
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
              <List my={10} className="is-nav" display={"flex"} flexDir={"column"} gap={4} fontWeight={500}>
                {[links]}
              </List>
              <HStack
                // clipPath={"polygon(14% 0, 100% 0%, 100% 100%, 0% 100%);"}
                // bg={"gs-yellow.400"}
                minW={{ base: 150, lg: 350 }}
                p={2}
                // justify={"center"}
              >
                <ConnectOrLogout openModal={onOpen} />
              </HStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
      {/* <RegisterForm isOpen={isOpen} onClose={onClose} /> */}
      <RegisterForm isOpen={isOpen} onClose={onClose} />
    </>
  );
}
