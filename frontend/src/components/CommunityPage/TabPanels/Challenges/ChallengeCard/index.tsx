import {
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  Button,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
export default function ChallengeCard({
  spaceIdOrId,
}: {
  spaceIdOrId: string;
}) {
  const tagStyles = {
    px: 2,
    rounded: "sm",
    py: 1,
    fontSize: "13px",
    bg: "gray.500",
    fontWeight: 500,
    color: "black",
  };
  return (
    <Flex
      gap={3}
      wrap={{ base: "wrap", md: "nowrap" }}
      bg={"gray.900"}
      py={3}
      px={3}
    >
      <Box
        flexShrink={0}
        w={{ md: 200, base: "full" }}
        minH={{ md: "100%", base: 200 }}
        maxH={{ base: 250 }}
        bg={"gay.900"}
      >
        <Image
          w={"full"}
          h={"full"}
          objectFit={"cover"}
          alt=""
          src={"/assets/community-dp.png"}
        />
      </Box>
      <Stack flex={1}>
        <Heading size={"md"}>Challenge title</Heading>
        <Box>
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus
            minima iusto vitae veniam libero esse nostrum consequatur architecto
            et molestias...
          </Text>
        </Box>
        <Box>
          <HStack>
            <Text as={"span"} {...tagStyles}>
              Health
            </Text>
            <Text as={"span"} {...tagStyles}>
              Fun
            </Text>
            <Text as={"span"} {...tagStyles}>
              Meetup
            </Text>
            <Text as={"span"} {...tagStyles}>
              Grow
            </Text>
          </HStack>
          <Button
            rounded={"full"}
            mt={4}
            as={Link}
            href={`/community/${spaceIdOrId}/challenges/ieodockweb`}
            colorScheme="gs-yellow"
          >
            Find out more
          </Button>
        </Box>
      </Stack>
    </Flex>
  );
}
