import { heroui } from "@heroui/react";
export default heroui({
  layout: {
    disabledOpacity: 0.1,
    radius: {
      small: "0px",
      medium: "0px",
      large: "0px",
    },
    borderWidth: {
      small: "1px",
      medium: "1px",
      large: "2px",
    },
  },
  themes: {
    light: {
      colors: {
        primary: {
          foreground: "#FFFFFF",
          DEFAULT: "#000000",
        },
        secondary: {
          foreground: "#000000",
          DEFAULT: "#0AE98A"
        }
      },
    },
  },
});
