import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import MarkdownRenderer from "src/components/MarkdownRenderer";

export default function About({
  spaceIdOrId,
  description,
}: {
  spaceIdOrId: string;
  description: string;
}) {
  return (
    <Stack flex={1} maxH={"full"} overflowY={"auto"} pb={6}>
      <Heading size={"lg"} fontWeight={600} mb={5}>
        About this community
      </Heading>

      {description && <MarkdownRenderer markdown={description} />}
      {!description && (
        <Text textAlign={"center"} color={"gray.500"} mt={3}>
          No description provided
        </Text>
      )}
    </Stack>
  );
}
