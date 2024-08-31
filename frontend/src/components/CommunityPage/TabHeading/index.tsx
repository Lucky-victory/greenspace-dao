import { Heading, useColorModeValue } from "@chakra-ui/react";

export function TabHeading({
  title,
  size = "lg",
  styleProps
}: {
  styleProps?: Record<string, any>;
  title: string;
  size?: string;
}) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Heading
      size={size}
      fontWeight={500}
      borderBottom={"1px"}
      color={textColor}
      p={2}
      borderBottomColor={borderColor}
      textTransform={"uppercase"}
      {...styleProps}
    >
      {title}
    </Heading>
  );
}
