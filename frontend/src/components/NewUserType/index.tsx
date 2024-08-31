import { Box, Button, Radio, RadioGroup, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";

export type RegisterType = "member" | "nutritionist";
export const NewUserType = ({
  onClick,
  getValue
}: {
  onClick?: () => void;
  getValue?: (val: RegisterType) => void;
}) => {
  const [value, setValue] = useState("member");
  const handleRadioChange = (val: RegisterType) => {
    setValue(val);
    getValue?.(val);
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box py={5} color={textColor}>
      <RadioGroup onChange={handleRadioChange} value={value} colorScheme="gs-yellow">
        <Stack spacing={"6"}>
          <Radio value="member">
            <Stack spacing={"1"}>
              <Text as={"span"} fontWeight={"medium"}>
                Individual
              </Text>
              <Text as={"span"} fontSize={"sm"} color={secondaryTextColor}>
                I want to join a community
              </Text>
            </Stack>
          </Radio>
          <Radio value="nutritionist">
            <Stack spacing={"1"}>
              <Text as={"span"} fontWeight={"medium"}>
                Nutritionist
              </Text>
              <Text as={"span"} fontSize={"sm"} color={secondaryTextColor}>
                I want to contribute as a nutritionist
              </Text>
            </Stack>
          </Radio>
        </Stack>
      </RadioGroup>
      <Button px={"8"} my={6} onClick={() => onClick?.()} rounded={"full"} colorScheme="gs-yellow">
        Continue
      </Button>
    </Box>
  );
};
