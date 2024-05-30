import { Box } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode } from "react";
import { cn } from "src/utils/tailwind";

export default function PageWrapper({
  children,
  h = "var(--chakra-vh)",
  bg = "black",
  maxW = 1350,
  props,
}: {
  children?: ReactNode;
  maxW?: number;
  h?: string | number;

  bg?: string;
  props?: any;
}) {
  return (
    <Box
      h={h}
      bg={bg}
      as="main"
      maxW={maxW}
      mx={"auto"}
      {...props}
      className={"no-scrollbar"}
    >
      {children}
    </Box>
  );
}
