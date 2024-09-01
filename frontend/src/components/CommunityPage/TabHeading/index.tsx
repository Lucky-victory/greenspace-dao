import { Heading, useColorModeValue } from "@chakra-ui/react";

interface TabHeadingProps {
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  styleProps?: Record<string, any>;
}

export const TabHeading: React.FC<TabHeadingProps> = ({ title, size = "lg", styleProps }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Heading
      as="h2"
      size={size}
      fontWeight="medium"
      borderBottom="1px"
      color={textColor}
      p={2}
      borderBottomColor={borderColor}
      // textTransform="uppercase"
      {...styleProps}
    >
      {title}
    </Heading>
  );
};
