import { Box, Heading, Text } from "@chakra-ui/react";
import MarkdownRenderer from "../MarkdownRenderer";

export default function About({
  spaceIdOrId,
  description,
}: {
  spaceIdOrId: string;
  description: string;
}) {
  return (
    <>
      <Heading size={"lg"} fontWeight={600} mb={5}>
        About this community
      </Heading>

      {description && <MarkdownRenderer markdown={description} />}
      {!description && (
        <Text textAlign={"center"} color={"gray.500"} mt={3}>
          No description provided
        </Text>
      )}
    </>
  );
}
