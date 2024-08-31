import { shortenText } from "src/utils";
import { Article } from "src/types/shared";
import { Link } from "@chakra-ui/next-js";
import { Box, Heading, Image, LinkBox, LinkOverlay, Text, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";

const MAX_CHARACTER_LENGTH = 100;
const ArticleCard = ({ article }: { article: Article | Partial<Article> }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const hoverBgColor = useColorModeValue("gray.200", "gray.600");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const headingColor = useColorModeValue("gs-yellow.600", "gs-yellow.400");

  return (
    <LinkBox
      _hover={{ bg: hoverBgColor, shadow: "md" }}
      display={"flex"}
      flexDir={"column"}
      gap={"2"}
      maxW={"340px"}
      rounded={"md"}
      p={"2"}
      pb={4}
      minW={"250px"}
      border={"1px"}
      borderColor={borderColor}
      bg={bgColor}
    >
      <Image
        alt=""
        src={article?.image || "/images/placeholder-image.png"}
        objectFit={"cover"}
        rounded={"inherit"}
        w={"full"}
        h={200}
      />
      <LinkOverlay href={"/blog/article/" + article?.slug} as={NextLink}>
        <Heading as={"h3"} size={"md"} color={headingColor} _hover={{ textDecor: "underline" }}>
          {article?.title}
        </Heading>
      </LinkOverlay>
      <Text>
        {article?.intro
          ? shortenText(article?.intro as string, MAX_CHARACTER_LENGTH)
          : shortenText(article?.content as string, MAX_CHARACTER_LENGTH)}
      </Text>
    </LinkBox>
  );
};

export default ArticleCard;
