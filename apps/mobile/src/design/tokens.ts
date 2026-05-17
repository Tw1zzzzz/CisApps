export const colors = {
  bg: "#0B0E14",
  bg2: "#11151E",
  surface: "#161A23",
  surface2: "#1E2330",
  surface3: "#262C3B",
  border: "rgba(255,255,255,0.07)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#F0F2F5",
  textDim: "#9AA3B5",
  textMuted: "#5E6675",
  accent: "#2AABEE",
  accentSoft: "rgba(42,171,238,0.14)",
  like: "#4ECB71",
  likeSoft: "rgba(78,203,113,0.16)",
  dislike: "#FF4D5E",
  dislikeSoft: "rgba(255,77,94,0.12)",
  super: "#B57FFF",
  superSoft: "rgba(181,127,255,0.14)",
  warn: "#FFB13D",
  warnSoft: "rgba(255,177,61,0.14)",
  faceit: "#FF8A3D",
  faceitSoft: "rgba(255,150,50,0.18)"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28
} as const;

export const typography = {
  title: 26,
  section: 17,
  body: 14,
  small: 12,
  tiny: 10
} as const;

export const fonts = {
  body: "Manrope_500Medium",
  medium: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  black: "Manrope_800ExtraBold",
  mono: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_700Bold"
} as const;

export const shadows = {
  elevate1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6
  },
  elevate2: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 12
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.55,
    shadowRadius: 60,
    elevation: 16
  }
} as const;
