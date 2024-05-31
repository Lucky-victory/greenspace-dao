import { Heading } from "@chakra-ui/react";

export function TabHeading({
  title,
  size = "lg",
  styleProps,
}: {
  styleProps?: Record<string, any>;
  title: string;
  size?: string;
}) {
  return (
    <Heading
      size={size}
      fontWeight={500}
      borderBottom={"1px"}
      color={"gray.400"}
      p={2}
      borderBottomColor={"gray.700"}
      textTransform={"uppercase"}
      {...styleProps}
    >
      {title}
    </Heading>
  );
}
