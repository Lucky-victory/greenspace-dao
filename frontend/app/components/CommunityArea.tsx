import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function CommunityArea() {
  return (
    <Flex
      gap={5}
      borderBottom={"1px"}
      borderBottomColor={"gs-gray.700"}
      wrap={{ base: "wrap", md: "nowrap" }}
      mt={12}
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 12 }}
      justify={"space-between"}
    >
      <Box>
        <Image
          minW={300}
          flexShrink={0}
          src="/assets/community.jpg"
          alt=""
          maxH={{ base: 350, sm: 450 }}
          maxW={{ base: "auto" }}
          rounded={"20px"}
          objectFit={"cover"}
        />
      </Box>
      <Stack maxW={{ md: 550, base: "auto" }}>
        <Heading mb={5} size={"2xl"}>
          Community For Everyone
        </Heading>
        <Text mb={5} maxW={{ lg: 500, base: "auto" }} lineHeight={"taller"}>
          {/* We&apos;re building a nurturing space centered on healthy eating and
          longevity—a haven where everyone&apos;s well-being shines. Here, join
          others passionate about nourishing their bodies for vibrant, enduring
          health. Whether you&apos;re into plant-based eats, mindful dining, or
          nutritional science, find a supportive community to share insights and
          discoveries. */}
          Our members are called <b>Green heads</b>, think of what we&apos;re
          building as AA for longevity. It&apos;s not just about wanting to live
          longer, but having a roadmap, mission and a group to journey with.
          We&apos;re bringing people together to focus on longevity by
          incorporating healthy habits into their lifestyle with weekly health
          challenges with a group that is accountable to each other as regular
          peer accountability sessions are key and are proven. The health
          challenges become a way of life.
        </Text>
        {/* <Button
          textDecor={"none!important"}
          as={"a"}
          href={"#waitlist-form"}
          alignSelf={"flex-start"}
          size={"lg"}
        >
          Join the waitlist
        </Button> */}
      </Stack>
    </Flex>
  );
}
