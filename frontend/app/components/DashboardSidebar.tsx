import { useResize } from "@/hooks";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  Icon,
  Image,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
export default function DashboardSideNav(props: {
  entryPath?: string;
  links: Array<{
    title: string;
    url: string;
    icon: IconType;
    child?: string[];
  }>;
}) {
  const { isMobileSize, isTabletSize } = useResize();
  const pathname = usePathname();
  const miniSidebarStyles = {
    w: "60px",
    px: 0,
  };
  const parts = pathname.split("/");
  const beforeLastPart = parts[parts.length - 2];
  const lastPart = parts[parts.length - 1];
  const _links = props.links.map((link, i) => {
    const isActive =
      lastPart === link?.url ||
      (beforeLastPart == link.url && link?.child?.includes(lastPart)) ||
      (link?.url === "overview" && lastPart === "dashboard");

    const buildLink = (entry: string, url: string) =>
      url.toLowerCase() === "overview" ? entry + "" : entry + url;
    const activeStyles = {
      bg: "gs-yellow.900",
      fontWeight: 500,
      borderLeftColor: "gs-yellow.300",
      color: "gs-yellow.300",
    };

    return (
      <ListItem pos={"relative"} key={"dash-sidebar-nav-link" + i}>
        <Link
          _hover={{ ...activeStyles, fontWeight: "normal" }}
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
      borderRightColor={"gray.500"}
      bg={"gray.700"}
      h={"full"}
      {...(isMobileSize ? miniSidebarStyles : { w: 250, px: 3 })}
    >
      <Box mb={5}>
        <Link href="/">
          {isMobileSize && (
            <Image
              alt=""
              mx={"auto"}
              mt={2}
              display={"block"}
              src="/icons/small-white-logo.svg"
              width={40 + "px"}
              height={40 + "px"}
            />
          )}
          {!isMobileSize && (
            <Image
              alt=""
              src="/white-logo.svg"
              width={170}
              height={60 + "px"}
            />
          )}
        </Link>
      </Box>
      <Flex direction={"column"} as={List} gap={4}>
        {[_links]}
      </Flex>
    </Box>
  );
}
