import { useResize } from "src/hooks/common";
import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Icon, Image, List, ListItem, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

export default function DashboardSideNav(props: {
  entryPath?: string;
  links: Array<{
    title: string;
    url: string;
    icon: IconType;
    child?: string[];
    nestedChild?: string[];
  }>;
}) {
  const { isMobileSize, isTabletSize } = useResize();
  const pathname = usePathname();
  const miniSidebarStyles = {
    w: "60px",
    px: 0
  };
  const parts = pathname.split("/");
  const beforeLastPart = parts[parts.length - 2];
  const lastPart = parts[parts.length - 1];

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const activeBgColor = useColorModeValue("gs-yellow.100", "gs-yellow.900");
  const activeColor = useColorModeValue("gs-yellow.700", "gs-yellow.300");
  const hoverBgColor = useColorModeValue("gs-yellow.50", "gs-yellow.800");
  const textColor = useColorModeValue("gray.800", "white");
  const smallLogoSrc = useColorModeValue("/icons/small-black-logo.svg", "/icons/small-white-logo.svg");
  const largLogoSrc = useColorModeValue("/black-logo.svg", "/white-logo.svg");

  const _links = props.links.map((link, i) => {
    const isActive =
      lastPart === link?.url ||
      (beforeLastPart == link.url && link?.child?.includes(lastPart)) ||
      (link?.child?.includes(beforeLastPart) && link?.nestedChild?.includes(lastPart)) ||
      (link?.url === "overview" && lastPart === "dashboard");

    const buildLink = (entry: string, url: string) => (url.toLowerCase() === "overview" ? entry + "" : entry + url);
    const activeStyles = {
      bg: activeBgColor,
      fontWeight: 500,
      borderLeftColor: activeColor,
      color: activeColor
    };

    return (
      <ListItem pos={"relative"} key={"dash-sidebar-nav-link" + i} pl={1}>
        <Link
          _hover={{ ...activeStyles, fontWeight: "normal", bg: hoverBgColor }}
          rounded={isMobileSize ? "none" : "md"}
          borderLeft={"4px solid"}
          borderLeftColor={"transparent"}
          bg={"transparent"}
          py={"10px"}
          px={3}
          fontWeight={300}
          {...(isActive && activeStyles)}
          textDecor={"none!important"}
          href={buildLink(props?.entryPath as string, link?.url)}
          alignItems={"center"}
          display={"flex"}
          gap={4}
          color={textColor}
        >
          <Icon as={link?.icon} fontSize={isMobileSize ? 24 : 20} />
          {!isMobileSize && (
            <Text fontSize={"15px"} as={"span"}>
              {link?.title}
            </Text>
          )}
        </Link>
      </ListItem>
    );
  });

  return (
    <Box
      pos={"sticky"}
      top={0}
      zIndex={10}
      flexShrink={0}
      borderRight={"1px"}
      borderRightColor={borderColor}
      bg={bgColor}
      h={"full"}
      {...(isMobileSize ? miniSidebarStyles : { w: 250, px: 3 })}
    >
      <Box mb={5}>
        <Link href="/">
          {isMobileSize ? (
            <Image
              alt=""
              mx={"auto"}
              mt={2}
              display={"block"}
              src={smallLogoSrc}
              width={40 + "px"}
              height={40 + "px"}
            />
          ) : (
            <Image alt="" src={largLogoSrc} width={170} height={60 + "px"} />
          )}
        </Link>
      </Box>
      <Flex direction={"column"} as={List} gap={4} className="is-nav">
        {_links}
      </Flex>
    </Box>
  );
}
