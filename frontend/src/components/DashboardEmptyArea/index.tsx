import { Box, Flex, Spinner, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function DashboardEmptyArea({
  isEmpty = true,
  isLoading = true,
  children,
  loadingText = "Fetching data...",
  text = "No data to show"
}: {
  isEmpty?: boolean;
  loadingText?: string;
  isLoading?: boolean;
  children?: ReactNode;
  text?: string;
}) {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const spinnerEmptyColor = useColorModeValue("gray.200", "gray.900");

  return (
    <>
      {(isLoading || isEmpty) && (
        <Flex h={250} w={"full"} justify={"center"} align={"center"} rounded={"md"} my={4} bg={bgColor}>
          {isLoading && (
            <VStack fontWeight={400} fontSize={"17px"}>
              <Spinner borderWidth={3} color="gs-yellow.500" speed="0.35s" size={"lg"} emptyColor={spinnerEmptyColor} />
              <Text color={textColor}>{loadingText}</Text>
            </VStack>
          )}
          {!isLoading && isEmpty && (
            <Text color={textColor} fontWeight={500} fontSize={"18px"}>
              {text}
            </Text>
          )}
        </Flex>
      )}
      {!isLoading && !isEmpty && children ? children : <></>}
    </>
  );
}
