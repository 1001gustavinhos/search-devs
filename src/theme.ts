import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      pageBg: "#FCFCFC",
      searchBlue: "#0069CA",
      accent: "#8C19D2",
      mobileProfileCardBg: "#EADDFF",
      surface: "#FFFFFF",
      title: "#171923",
      text: "#4A5568",
      usernameDesktop: "#A0AEC0",
    },
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "brand.pageBg",
        color: "brand.text",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "6px",
        fontWeight: "semibold",
      },
      variants: {
        solid: {
          bg: "brand.accent",
          color: "brand.surface",
          _hover: {
            bg: "#7C12BA",
          },
          _active: {
            bg: "#6E0FA8",
          },
        },
      },
      defaultProps: {
        size: "lg",
        variant: "solid",
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "4px",
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "brand.surface",
            _focusVisible: {
              borderColor: "brand.accent",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-accent)",
            },
          },
        },
      },
      defaultProps: {
        variant: "outline",
        focusBorderColor: "brand.accent",
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: "brand.surface",
            _focusVisible: {
              borderColor: "brand.accent",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-accent)",
            },
          },
        },
      },
      defaultProps: {
        variant: "outline",
        focusBorderColor: "brand.accent",
      },
    },
    Link: {
      baseStyle: {
        color: "brand.text",
        textDecoration: "none",
        _hover: {
          color: "brand.accent",
          textDecoration: "none",
        },
        _focusVisible: {
          textDecoration: "none",
        },
      },
    },
  },
});
