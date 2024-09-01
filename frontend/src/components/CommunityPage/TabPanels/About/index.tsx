import { Box, Heading, Text, Stack, useColorModeValue } from "@chakra-ui/react";
import MarkdownRenderer from "src/components/MarkdownRenderer";
import { TabHeading } from "../../TabHeading";

export default function About({ spaceIdOrId, description }: { spaceIdOrId: string; description: string }) {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack flex={1} maxH={"full"} overflowY={"auto"} pb={6} pt={5}>
      <TabHeading title="About this community" />

      {description && <MarkdownRenderer markdown={description} />}
      {!description && (
        <Text textAlign={"center"} color={textColor} mt={3}>
          No description provided
        </Text>
      )}
    </Stack>
  );
}
