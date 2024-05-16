import { Box, Text } from "@chakra-ui/react";

export default function MatIcon({
  name,
  size = 24,
  bold = false,
  fill = false,
  color = "inherit",
}: {
  name: string;
  size?: number;
  bold?: boolean;
  fill?: boolean;
  color?: string;
}) {
  //@ts-ignore

  return (
    <Text
      maxW={size + 4 + "px"}
      overflow={"hidden"}
      as={"span"}
      color={color}
      fontSize={size + "px"}
      className={`material-symbols-outlined ${bold ? "bold" : ""} ${fill ? "fill" : ""} `}
    >
      {name}
    </Text>
  );
}
