import { Html, Head, Main, NextScript } from "next/document";
import { theme } from "src/config/theme";
import { ColorModeScript } from "@chakra-ui/react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />

        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <NextScript />
      </body>
    </Html>
  );
}
