import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";

export default function HeroArea() {
    return (
        <Flex
            borderBottom={"1px"}
            borderBottomColor={"gs-gray.700"}
            wrap={{ base: "wrap-reverse", md: "nowrap" }}
            px={{ base: 4, md: 12 }}
            align={"center"}
            mt={12}
            mb={4}
            gap={5}
            pb={8}
        >
            <Stack maxW={{ md: 600, base: "auto" }}>
                <Heading mb={6} size={"3xl"}>
                    Want to Live{" "}
                    <Text as={"span"} color={"gs-green.500"}>
                        Healthier
                    </Text>{" "}
                    and
                    <Text as={"span"} color={"gs-yellow.400"}>
                        {" "}
                        Longer?
                    </Text>
                </Heading>
                <Text lineHeight={"taller"} maxW={{ md: 550, base: "auto" }}>
                    {/* We&apos;re building healthy communities focused on longevity all
          around the world, we want to help people live longer, better through
          community inclusive programs that improve productivity, make people
          live happier lives with a sense of purpose and belonging in their
          community */}
                    We&apos;re building a network of decentralized communities,
                    called <b>Green spaces</b>, focused on longevity to help people
                    live longer, better through community inclusive programs
                    like challenges, events, weekly and one-on-one sessions with
                    longevity focused nutritionists and incentivizing these
                    nutritionists as a focal point, to improve health,
                    productivity and make our members live happier lives with a
                    sense of purpose and belonging in their community.
                </Text>
            </Stack>

            <Box>
                <Box
                    as="video"
                    muted
                    loop
                    autoPlay
                    src="/assets/group-video.mp4"
                    minH={{ base: 350, sm: 450 }}
                    rounded={"20px"}
                    objectFit={"cover"}
                >
                    <span>Video not supported</span>
                </Box>
            </Box>
        </Flex>
    );
}
