import { theme } from "@/providers/chakra";
import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />{" "}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <NextScript />
      </body>
    </Html>
  );
}
