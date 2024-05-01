import { Box } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode } from "react";

export default function PageWrapper({
  children,
  h = "auto",
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
    <>
      <Box h={"auto"} bg={bg} as="main" maxW={maxW} mx={"auto"} {...props}>
        {children}
      </Box>
    </>
  );
}
