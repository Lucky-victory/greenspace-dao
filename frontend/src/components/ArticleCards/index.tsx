import { Flex } from "@chakra-ui/react";
import ArticleCard from "src/components/ArticleCard";

export default function ArticleCards({ articles }: { articles: any[] }) {
  const randomID = () => Math.random().toString(16).substring(2);

  return (
    <Flex wrap={"wrap"} gap={5} py={5}>
      {articles?.map((article, i) => (
        <ArticleCard key={`article-${i}-${randomID()}`} article={article} />
      ))}
    </Flex>
  );
}
