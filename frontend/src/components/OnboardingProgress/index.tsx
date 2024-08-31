import React from "react";
import { Box, Flex, Text, useTheme, useColorModeValue } from "@chakra-ui/react";

const OnboardingProgress = ({ totalSteps, currentStep }: { totalSteps: number; currentStep: number }) => {
  const theme = useTheme();
  const activeColor = useColorModeValue(theme.colors["gs-yellow"][600], theme.colors["gs-yellow"][300]);
  const inactiveColor = useColorModeValue("gray.400", "gray.600");
  const activeTextColor = useColorModeValue("white", "black");
  const inactiveTextColor = useColorModeValue("gray.700", "gray.400");

  return (
    <Flex align="center" gap={2} justify="space-between" w="100%" mb={6} mt={4}>
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <Flex direction="column" align="center">
            <Box
              w="30px"
              h="30px"
              borderRadius="50%"
              bg={index < currentStep ? activeColor : inactiveColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={index < currentStep ? activeTextColor : inactiveTextColor}
              fontWeight="bold"
            >
              {index + 1}
            </Box>
          </Flex>
          {index < totalSteps - 1 && (
            <Box flex={1} h="2px" bg={index < currentStep - 1 ? activeColor : inactiveColor} />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default OnboardingProgress;
