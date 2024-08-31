import { Flex, Spinner, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  text?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

export default function PageLoader({ isLoading = false, text = "Loading...", children }: Props) {
  const bgColor = useColorModeValue("white", "black");
  const spinnerColor = useColorModeValue("gs-yellow.500", "gs-yellow.500");
  const spinnerEmptyColor = useColorModeValue("gray.200", "gray.900");
  const textColor = useColorModeValue("gs-yellow.500", "gs-yellow.500");

  return (
    <>
      {isLoading && (
        <Flex
          pos={"fixed"}
          h={"full"}
          w={"full"}
          top={0}
          left={0}
          zIndex={99999}
          bg={bgColor}
          align={"center"}
          justify={"center"}
        >
          <Stack align={"center"}>
            <Spinner
              mb={4}
              borderWidth={4}
              color={spinnerColor}
              speed="0.55s"
              emptyColor={spinnerEmptyColor}
              w={{ md: "70px", base: "60px" }}
              h={{ md: "70px", base: "60px" }}
            ></Spinner>
            {text && (
              <Text as={"span"} fontWeight={500} fontSize={"18px"} color={textColor}>
                {text}
              </Text>
            )}
          </Stack>
        </Flex>
      )}
      {!isLoading && children ? children : <></>}
    </>
  );
}
