import { shortenText } from "@/utils";
import { Article } from "@/types/shared";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

const MAX_CHARACTER_LENGTH = 100;
const ArticleCard = ({ article }: { article: Article | Partial<Article> }) => {
  return (
    <LinkBox
      _hover={{ bg: "gray.700", shadow: "md" }}
      display={"flex"}
      flexDir={"column"}
      gap={"2"}
      maxW={"340px"}
      rounded={"md"}
      p={"2"}
      pb={4}
      minW={"250px"}
      border={"1px"}
      borderColor={"gray.600"}
    >
      <Image
        alt=""
        src={article?.image || "/images/placeholder-image.png"}
        objectFit={"cover"}
        rounded={"inherit"}
        placeholder="blur"
        w={"full"}
        h={200}
      />
      <LinkOverlay href={"/blog/article/" + article?.slug} as={NextLink}>
        <Heading
          as={"h3"}
          size={"md"}
          color={"gs-yellow.400"}
          _hover={{ textDecor: "underline" }}
        >
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
