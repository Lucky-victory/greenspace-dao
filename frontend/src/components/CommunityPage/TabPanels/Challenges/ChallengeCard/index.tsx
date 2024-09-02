import { Box, Heading, HStack, Stack, Text, Button, Image, Flex, useColorModeValue } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import MarkdownRenderer from "src/components/MarkdownRenderer";
import { replaceCloudflareIpfs, shortenText } from "src/utils";
import isEmpty from "just-is-empty";

export default function ChallengeCard({ spaceIdOrId, challenge }: { spaceIdOrId: string; challenge: any }) {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const tagBgColor = useColorModeValue("gray.200", "gray.700");
  const tagTextColor = useColorModeValue("gray.800", "gray.100");

  const tagStyles = {
    px: 2,
    rounded: "full",
    py: 1,
    fontSize: "13px",
    bg: tagBgColor,
    fontWeight: 500,
    color: tagTextColor
  };

  return (
    <Flex
      gap={3}
      wrap={{ base: "wrap", md: "nowrap" }}
      bg={bgColor}
      py={3}
      px={3}
      color={textColor}
      borderRadius="xl"
      overflow="hidden"
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
          src={replaceCloudflareIpfs(challenge?.coverImage) || "/assets/community-dp.png"}
        />
      </Box>
      <Stack flex={1}>
        <Heading size={"md"}>{challenge?.title}</Heading>
        <Box>
          <MarkdownRenderer markdown={shortenText(challenge?.details, 150)} />
        </Box>
        <Box>
          {!isEmpty(challenge?.tags) && (
            <HStack>
              {challenge?.tags.map((tag: { name: string }, i: number) => (
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
            href={`/community/${spaceIdOrId}/challenges/${challenge?.slugId}`}
            colorScheme="gs-yellow"
          >
            Find out more
          </Button>
        </Box>
      </Stack>
    </Flex>
  );
}
