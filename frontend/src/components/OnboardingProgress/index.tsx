import React from "react";
import { Box, Flex, Text, useTheme } from "@chakra-ui/react";

const OnboardingProgress = ({ totalSteps, currentStep }: { totalSteps: number; currentStep: number }) => {
  const theme = useTheme();

  return (
    <Flex align="center" gap={2} justify="space-between" w="100%" mb={6} mt={4}>
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <Flex direction="column" align="center">
            <Box
              w="30px"
              h="30px"
              borderRadius="50%"
              bg={index < currentStep ? theme.colors["gs-yellow"][500] : "gray.300"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={index < currentStep ? "white" : "gray.600"}
              fontWeight="bold"
            >
              {index + 1}
            </Box>
          </Flex>
          {index < totalSteps - 1 && (
            <Box flex={1} h="2px" bg={index < currentStep - 1 ? theme.colors["gs-yellow"][500] : "gray.300"} />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default OnboardingProgress;
