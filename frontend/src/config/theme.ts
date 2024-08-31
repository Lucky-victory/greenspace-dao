import { StyleFunctionProps, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

export const theme = extendTheme(
  {
    fonts: {
      heading: "var(--font-poppins)",
      body: "var(--font-poppins)",
      a: "var(--font-poppins)"
    },
    styles: {
      global: {
        "html, body": {
          // color: "gray.600",
          // lineHeight: "tall",
        },
        a: {
          color: "gs-yellow.400"
        }
      }
    },
    colors: {
      "gs-green": {
        50: "#e1fff0",
        100: "#b4fed7",
        200: "#85fcbd",
        300: "#57fba4",
        400: "#33fb8a",
        500: "#24e171",
        600: "#19af57",
        700: "#0d7e3e",
        800: "#014b25",
        900: "#001a09"
      },
      "gs-yellow": {
        50: "#fff4dd",
        100: "#fae3b3",
        200: "#f6d587",
        300: "#f1c959",
        400: "#edc02c",
        500: "#d39a12",
        600: "#a46d0a",
        700: "#754605",
        800: "#472500",
        900: "#1a0a00"
      },
      "gs-yellow-dark": {
        "50": "#1a0a00",
        "100": "#2b1600",
        "200": "#3c2200",
        "300": "#4c2d00",
        "400": "#5d3900",
        "500": "#6d4500",
        "600": "#7e5100",
        "700": "#8f5d00",
        "800": "#a06900",
        "900": "#b07500"
      },
      "gs-beige": {
        50: "#f9f9eb",
        100: "#eeebc8",
        200: "#e3daa4",
        300: "#d7c57e",
        400: "#cdad59",
        500: "#b48c41",
        600: "#8c6734",
        700: "#634525",
        800: "#3c2716",
        900: "#140c06"
      },
      "gs-gray": {
        50: "#e8f6f6",
        100: "#d4dbdd",
        200: "#bcc1c2",
        300: "#a4a9a9",
        400: "#8a8f91",
        500: "#707577",
        600: "#565c5d",
        700: "#3d4243",
        800: "#222729",
        900: "#001010"
      }
    },
    layerStyles: {
      "with-shadow": {
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)"
      }
    },
    config,
    components: {
      Button: {
        variants: {
          solid: (styleProps: StyleFunctionProps) => {
            if (styleProps.colorScheme === "gs-green") {
              return {
                bg: "gs-green.700",
                color: "white",
                _hover: {
                  bg: "gs-green.800"
                }
              };
            }
            if (styleProps.colorScheme === "gs-yellow") {
              return {
                bg: "gs-yellow.500",
                _hover: {
                  bg: "gs-yellow.600"
                }
              };
            }
            if (styleProps.colorScheme === "red") {
              return {
                bg: "red.500",
                _hover: {
                  bg: "red.600"
                }
              };
            }
          }
        },
        defaultProps: {
          colorScheme: "gs-green",
          variant: "solid"
        }
      }
    }
  },
  withDefaultColorScheme({ colorScheme: "gs-yellow" })
);

export default theme;
