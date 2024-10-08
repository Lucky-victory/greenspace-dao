import { Box, Heading, HStack, Stack, Text, Button, Image, Flex, useColorModeValue } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import MarkdownRenderer from "src/components/MarkdownRenderer";
import { replaceCloudflareIpfs, shortenText } from "src/utils";
import isEmpty from "just-is-empty";

export default function EventCards({ spaceIdOrId, event }: { spaceIdOrId: string; event: any }) {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("black", "white");
  const tagBgColor = useColorModeValue("gray.300", "gray.600");

  const tagStyles = {
    px: 2,
    rounded: "full",
    py: 1,
    fontSize: "13px",
    bg: tagBgColor,
    fontWeight: 500,
    color: textColor
  };

  return (
    <Flex
      gap={3}
      wrap={{ base: "wrap", md: "nowrap" }}
      bg={bgColor}
      py={4}
      px={4}
      color={textColor}
      borderRadius="xl"
      boxShadow="md"
    >
      <Box
        flexShrink={0}
        w={{ md: 200, base: "full" }}
        minH={{ md: "100%", base: 200 }}
        maxH={{ base: 250 }}
        bg={bgColor}
        borderRadius="lg"
        overflow="hidden"
      >
        <Image
          w={"full"}
          h={"full"}
          objectFit={"cover"}
          alt=""
          src={replaceCloudflareIpfs(event?.coverImage) || "/assets/community-dp.png"}
        />
      </Box>
      <Stack flex={1} spacing={3}>
        <Heading size={"md"}>{event?.title}</Heading>
        <Box>
          <MarkdownRenderer markdown={shortenText(event?.details, 150)} />
        </Box>
        <Box>
          {!isEmpty(event?.tags) && (
            <HStack spacing={2}>
              {event?.tags.map((tag: { name: string }, i: number) => (
                <Text as={"span"} {...tagStyles} key={tag?.name + i}>
                  {tag?.name}
                </Text>
              ))}
            </HStack>
          )}
          <Button
            rounded={"full"}
            mt={4}
            as={Link}
            href={`/community/${spaceIdOrId}/events/${event?.slugId}`}
            colorScheme="gs-yellow"
            fontWeight="medium"
            _hover={{ transform: "translateY(-2px)", boxShadow: "sm" }}
            transition="all 0.2s"
          >
            Find out more
          </Button>
        </Box>
      </Stack>
    </Flex>
  );
}
