import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function DashboardEmptyArea({
  isEmpty = true,
  isLoading = true,
  children,
  loadingText = "Fetching data...",
  text = "No data to show",
}: {
  isEmpty?: boolean;
  loadingText?: string;
  isLoading?: boolean;
  children?: ReactNode;
  text?: string;
}) {
  return (
    <>
      {(isLoading || isEmpty) && (
        <Flex
          h={250}
          w={"full"}
          justify={"center"}
          align={"center"}
          rounded={"md"}
          my={4}
          bg={"gray.700"}
        >
          {isLoading && (
            <VStack fontWeight={400} fontSize={"17px"}>
              <Spinner
                borderWidth={3}
                color="gs-yellow.500"
                speed="0.35s"
                size={"lg"}
                emptyColor="gray.900"
              />
              <Text color={"gray.400"}>{loadingText}</Text>
            </VStack>
          )}
          {!isLoading && isEmpty && (
            <Text color={"gray.400"} fontWeight={500} fontSize={"18px"}>
              {text}
            </Text>
          )}
        </Flex>
      )}
      {!isLoading && !isEmpty && children ? children : <></>}
    </>
  );
}
