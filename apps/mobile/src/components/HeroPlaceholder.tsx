import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts } from "../design/tokens";

function hsl(hue: number, sat: number, light: number): string {
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function gradientFromHue(hue: number): readonly [string, string] {
  return [hsl(hue, 35, 30), hsl((hue + 30) % 360, 30, 16)];
}

interface HeroPlaceholderProps {
  hue: number;
  initial: string;
  label?: string;
  gradient?: readonly [string, string];
}

export function HeroPlaceholder({ hue, initial, label = "фото анкеты", gradient }: HeroPlaceholderProps) {
  const colorsArr: readonly [string, string] = gradient ?? gradientFromHue(hue);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={colorsArr}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={[styles.fill, { opacity: 0.6 }]}
      />
      <Text style={styles.initial}>{initial}</Text>
      <View style={styles.labelPill}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]}
        start={{ x: 0.5, y: 0.45 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomShade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden"
  },
  fill: {
    ...StyleSheet.absoluteFillObject
  },
  initial: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -110 }, { translateY: -130 }],
    width: 220,
    height: 220,
    textAlign: "center",
    color: "rgba(255,255,255,0.08)",
    fontFamily: fonts.black,
    fontSize: 220,
    lineHeight: 220,
    letterSpacing: -5
  },
  labelPill: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  labelText: {
    fontFamily: fonts.monoBold,
    fontSize: 9,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  bottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%"
  }
});

export { gradientFromHue, colors };
