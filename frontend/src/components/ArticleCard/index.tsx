import { shortenText } from "src/utils";
import { Article } from "src/types/shared";
import { Link } from "@chakra-ui/next-js";
import { Box, Heading, Image, LinkBox, LinkOverlay, Text, useColorModeValue, Flex, Badge } from "@chakra-ui/react";
import NextLink from "next/link";
import { format } from "date-fns";

const MAX_CHARACTER_LENGTH = 100;
const ArticleCard = ({ article }: { article: Article | Partial<Article> }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("gs-yellow.600", "gs-yellow.400");
  const metaColor = useColorModeValue("gray.600", "gray.400");

  return (
    <LinkBox
      key={article?.id}
      _hover={{ bg: hoverBgColor, transform: "translateY(-4px)", transition: "all 0.3s ease" }}
      display={"flex"}
      flexDir={"column"}
      maxW={"340px"}
      w="full"
      rounded={"lg"}
      overflow={"hidden"}
      boxShadow={"lg"}
      bg={bgColor}
    >
      <Image alt="" src={article?.image || "/images/placeholder-image.png"} objectFit={"cover"} w={"full"} h={200} />
      <Flex direction={"column"} p={6} flex={1}>
        <LinkOverlay href={"/blog/" + article?.slug} as={NextLink}>
          <Heading as={"h3"} size={"md"} color={headingColor} mb={2} _hover={{ color: "gs-yellow.500" }}>
            {article?.title}
          </Heading>
        </LinkOverlay>
        <Text fontSize={"sm"} color={"gray.500"} mb={4} flex={1}>
          {article?.intro
            ? shortenText(article?.intro as string, MAX_CHARACTER_LENGTH)
            : shortenText(article?.content as string, MAX_CHARACTER_LENGTH)}
        </Text>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"xs"} fontWeight={"bold"} color={metaColor}>
            {format(new Date(article?.createdAt as Date), "MMMM dd, yyyy")}
          </Text>
          <Flex alignItems={"center"}>
            <Text fontSize={"xs"} fontWeight={"bold"} color={metaColor} mr={1}>
              Views:
            </Text>
            <Text fontSize={"xs"} fontWeight={"bold"} color={metaColor}>
              {article?.views}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </LinkBox>
  );
};

export default ArticleCard;
