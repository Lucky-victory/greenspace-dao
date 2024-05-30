import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import MarkdownRenderer from "src/components/MarkdownRenderer";
import { TabHeading } from "../../TabHeading";

export default function About({
  spaceIdOrId,
  description,
}: {
  spaceIdOrId: string;
  description: string;
}) {
  return (
    <Stack flex={1} maxH={"full"} overflowY={"auto"} pb={6}>
      <TabHeading title="About this community" />

      {description && <MarkdownRenderer markdown={description} />}
      {!description && (
        <Text textAlign={"center"} color={"gray.500"} mt={3}>
          No description provided
        </Text>
      )}
    </Stack>
  );
}
