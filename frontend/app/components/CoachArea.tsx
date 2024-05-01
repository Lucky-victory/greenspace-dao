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

export default function CoachArea() {
  return (
    <Flex
      gap={5}
      borderBottom={"1px"}
      borderBottomColor={"gs-gray.700"}
      wrap={{ base: "wrap-reverse", md: "nowrap" }}
      mt={12}
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 12 }}
      justify={"space-between"}
    >
      <Stack maxW={{ md: 550, base: "auto" }}>
        <Heading mb={5} size={"2xl"}>
          One-on-One{" "}
          <Text as={"span"} color={"gs-yellow.400"}>
            {" "}
            <Text as={"span"} color={"gs-yellow.400"}>
              {" "}
              Coaching
            </Text>
          </Text>
        </Heading>
        <Text mb={5} maxW={{ lg: 500, base: "auto" }} lineHeight={"taller"}>
          We also offer one-on-one sessions with our vetted nutritionists for
          personalized guidance tailored to your needs. Whether you&apos;re
          seeking advice on dietary choices, meal planning, or specific health
          concerns, our experts are here to support you every step of the way.
        </Text>
        <Text>
          Also if you&apos;re a nutritonist looking to work with us, send us an
          email at{" "}
          <Link
            color={"gs-yellow.400"}
            href={"mailto:apply@greenspacedao.xyz"}
            isExternal
          >
            apply@greenspacedao.xyz
          </Link>{" "}
          and we would be happy to have you on board.
        </Text>
        {/* <Button
                    textDecor={"none!important"}
                    as={"a"}
                    colorScheme="gs-yellow"
                    href={"#waitlist-form"}
                    alignSelf={"flex-start"}
                    size={"lg"}
                >
                    Join the waitlist
                </Button> */}
      </Stack>
      <Box>
        <Image
          minW={300}
          flexShrink={0}
          src="/assets/coaching.jpg"
          alt=""
          maxH={{ base: 350, sm: 450 }}
          maxW={{ base: "auto" }}
          rounded={"20px"}
          objectFit={"cover"}
        />
      </Box>
    </Flex>
  );
}
