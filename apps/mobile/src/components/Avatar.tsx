import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts } from "../design/tokens";

interface AvatarProps {
  name: string;
  hue?: number;
  size?: number;
  rounded?: boolean;
  gradient?: readonly [string, string];
}

function hsl(hue: number, sat: number, light: number): string {
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export function Avatar({ name, hue = 200, size = 56, rounded = true, gradient }: AvatarProps) {
  const initial = (name || "?").slice(0, 1).toUpperCase();
  const radius = rounded ? size / 2 : 14;
  const gradientColors: readonly [string, string, string] = gradient
    ? [gradient[0], gradient[1], gradient[1]]
    : [hsl(hue, 70, 45), hsl((hue + 40) % 360, 65, 22), hsl((hue + 80) % 360, 60, 14)];

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.3, y: 0.25 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fill, { borderRadius: radius }]}
      />
      <View style={[styles.inner, { borderRadius: radius }]} />
      <Text style={[styles.letter, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  fill: {
    ...StyleSheet.absoluteFillObject
  },
  inner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)"
  },
  letter: {
    color: "rgba(255,255,255,0.92)",
    fontFamily: fonts.bold,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  }
});

export { colors };
