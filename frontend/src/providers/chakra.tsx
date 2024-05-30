import {
  ChakraBaseProvider,
  extendTheme,
  theme as chakraTheme,
  StyleFunctionProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// export function AppChakraProvider({ children }: { children: ReactNode }) {
//   return <ChakraBaseProvider theme={theme}>{children}</ChakraBaseProvider>;
// }
