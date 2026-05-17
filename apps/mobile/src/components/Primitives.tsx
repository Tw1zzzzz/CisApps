import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { colors, fonts, radius, spacing, typography } from "../design/tokens";

export function Screen({ children, padded = true }: { children: ReactNode; padded?: boolean }) {
  return <View style={[styles.screen, padded && styles.padded]}>{children}</View>;
}

export function Surface({ children, style, padding = spacing.lg }: { children: ReactNode; style?: ViewStyle; padding?: number }) {
  return <View style={[styles.surface, { padding }, style]}>{children}</View>;
}

export function Title({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Muted({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}

export function Mono({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[styles.mono, style]}>{children}</Text>;
}

export function Button({ children, onPress, tone = "primary", icon, fullWidth = true }: { children: ReactNode; onPress: () => void; tone?: "primary" | "ghost" | "danger"; icon?: ReactNode; fullWidth?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === "ghost" && styles.buttonGhost,
        tone === "danger" && styles.buttonDanger,
        fullWidth && { alignSelf: "stretch" },
        pressed && styles.buttonPressed
      ]}
    >
      {icon}
      <Text style={[styles.buttonText, tone === "ghost" && styles.buttonTextGhost]}>{children}</Text>
    </Pressable>
  );
}

export function IconButton({ children, onPress, style }: { children: ReactNode; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed, style]}>
      {children}
    </Pressable>
  );
}

export function StateView({ state, onRetry }: { state: "loading" | "empty" | "error"; onRetry?: () => void }) {
  if (state === "loading") {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={colors.accent} />
        <Muted>Загружаем данные</Muted>
      </View>
    );
  }

  return (
    <View style={styles.state}>
      <Text style={styles.stateTitle}>{state === "empty" ? "Пока ничего нет" : "Не получилось загрузить"}</Text>
      <Muted>{state === "empty" ? "Попробуй изменить фильтры или вернуться позже." : "Проверь соединение и повтори запрос."}</Muted>
      {onRetry ? (
        <Button onPress={onRetry} tone="ghost" fullWidth={false}>
          Повторить
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg
  },
  padded: {
    paddingHorizontal: spacing.lg
  },
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontFamily: fonts.black,
    letterSpacing: -0.5
  },
  muted: {
    color: colors.textDim,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium
  },
  mono: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: typography.body
  },
  button: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12
  },
  buttonGhost: {
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1
  },
  buttonDanger: {
    backgroundColor: colors.dislike
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fonts.bold,
    letterSpacing: -0.2
  },
  buttonTextGhost: {
    color: colors.text
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  state: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl
  },
  stateTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.black
  }
});
