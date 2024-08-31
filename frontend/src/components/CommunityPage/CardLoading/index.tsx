import { Box, Heading, Stack, Skeleton, HStack, useColorModeValue, Image, Text, Button } from "@chakra-ui/react";

export const CardLoading = ({ isLoaded = false }: { isLoaded?: boolean }) => {
  const cardBgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const skeletonStartColor = useColorModeValue("gray.200", "gray.700");
  const skeletonEndColor = useColorModeValue("gray.400", "gray.500");

  return (
    <HStack gap={6} wrap="wrap" align="stretch" justify="center">
      <Stack
        bg={cardBgColor}
        rounded="xl"
        shadow="lg"
        overflow="hidden"
        minW={280}
        maxW={320}
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      >
        <Box h={200} pos="relative">
          <Skeleton h="full" w="full" startColor={skeletonStartColor} endColor={skeletonEndColor} />
          <Box pos="absolute" bottom={-10} left={4} bg={cardBgColor} rounded="full" p={1} shadow="md">
            <Skeleton w={20} h={20} rounded="full" startColor={skeletonStartColor} endColor={skeletonEndColor} />
          </Box>
        </Box>
        <Box p={6} pt={12}>
          <Skeleton h={6} w="70%" mb={3} rounded="md" startColor={skeletonStartColor} endColor={skeletonEndColor} />
          <Skeleton h={4} w="full" mb={4} rounded="md" startColor={skeletonStartColor} endColor={skeletonEndColor} />
          <Stack spacing={3}>
            <Skeleton h={8} w="full" rounded="full" startColor={skeletonStartColor} endColor={skeletonEndColor} />
            <Skeleton h={8} w="full" rounded="full" startColor={skeletonStartColor} endColor={skeletonEndColor} />
          </Stack>
        </Box>
      </Stack>
    </HStack>
  );
};
