import { extendTheme, theme as base } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#e3f9ff",
    100: "#c8ecf8",
    200: "#a0dff0",
    300: "#5fc6de",
    400: "#2ab0cc",
    500: "#1296b3",
    600: "#0a7891",
    700: "#075e72",
    800: "#064055",
    900: "#042736",
  },
  surface: "#0c1324",
  surfaceMuted: "#141c31",
};

const styles = {
  global: {
    "html, body": {
      backgroundColor: "surface",
      color: "whiteAlpha.900",
      minHeight: "100%",
      backgroundImage:
        "radial-gradient(circle at 25% 25%, rgba(42,176,204,0.15), transparent 45%), radial-gradient(circle at 75% 0%, rgba(16,24,40,0.85), #040910)",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    },
    body: {
      fontFamily: `'Inter', ${base.fonts?.body}`,
    },
    "#root": {
      minHeight: "100vh",
      backgroundColor: "transparent",
    },
    "::selection": {
      backgroundColor: "brand.400",
      color: "gray.900",
    },
  },
};

const components = {
  Container: {
    baseStyle: {
      px: { base: 6, md: 8 },
    },
  },
  Card: {
    baseStyle: {
      bg: "surfaceMuted",
    },
  },
  Heading: {
    baseStyle: {
      color: "whiteAlpha.900",
      letterSpacing: "wide",
    },
  },
  Text: {
    baseStyle: {
      color: "whiteAlpha.800",
    },
  },
  Button: {
    baseStyle: {
      rounded: "xl",
      fontWeight: "semibold",
    },
    defaultProps: {
      colorScheme: "brand",
    },
  },
  Table: {
    baseStyle: {
      th: {
        textTransform: "capitalize",
        letterSpacing: "wide",
      },
    },
  },
};

const theme = extendTheme({ config, colors, styles, components });

export default theme;
