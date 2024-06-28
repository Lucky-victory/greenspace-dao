import React from "react";
import { Box, Flex, Text, useTheme } from "@chakra-ui/react";

const OnboardingProgress = ({ totalSteps, currentStep }: { totalSteps: number; currentStep: number }) => {
  const theme = useTheme();

  return (
    <Flex align="center" justify="space-between" w="100%" mb={6} mt={4}>
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <Flex direction="column" align="center">
            <Box
              w="30px"
              h="30px"
              borderRadius="50%"
              bg={index < currentStep ? theme.colors.blue[500] : "gray.200"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={index < currentStep ? "white" : "gray.500"}
              fontWeight="bold"
            >
              {index + 1}
            </Box>
          </Flex>
          {index < totalSteps - 1 && (
            <Box flex={1} h="2px" bg={index < currentStep - 1 ? theme.colors.blue[500] : "gray.200"} />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default OnboardingProgress;
