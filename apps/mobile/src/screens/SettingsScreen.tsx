import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "../components/Primitives";
import { Icon, type IconName } from "../components/Icon";
import { SectionTitle } from "../components/Chips";
import { colors, fonts, spacing } from "../design/tokens";

interface SetRowProps {
  icon: IconName;
  label: string;
  value?: string;
  highlight?: boolean;
  danger?: boolean;
  mono?: boolean;
  onPress?: () => void;
}

export function SettingsScreen({ onClose }: { onClose: () => void }) {
  return (
    <SafeAreaView style={styles.overlay} edges={["top", "left", "right", "bottom"]}>
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <IconButton onPress={onClose}>
          <Icon name="back" size={18} color={colors.text} />
        </IconButton>
        <Text style={styles.title}>Настройки</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SectionTitle>Аккаунт</SectionTitle>
      <SetRow icon="user" label="Telegram ID" value="@crowley" mono />
      <SetRow icon="shield" label="Верификация" value="Не пройдена" highlight />
      <SetRow icon="bell" label="Уведомления" value="Включены" />

      <SectionTitle>Приватность</SectionTitle>
      <SetRow icon="eye_off" label="Невидимый режим" value="Выкл" />
      <SetRow icon="globe" label="Регион по умолчанию" value="EU West" />
      <SetRow icon="pin" label="Расстояние" value="до 50 км" />

      <SectionTitle>Поддержка</SectionTitle>
      <SetRow icon="info" label="О приложении" />
      <SetRow icon="flag" label="Правила сообщества" />
      <SetRow icon="chat" label="Связаться с поддержкой" />

      <SectionTitle>Опасная зона</SectionTitle>
      <SetRow icon="trash" label="Удалить аккаунт" danger />

      <View style={styles.footer}>
        <Text style={styles.footerText}>PARTY UP · v0.1.0</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

function SetRow({ icon, label, value, highlight, danger, mono, onPress }: SetRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
        <Icon name={icon} size={15} stroke={2} color={danger ? colors.dislike : colors.textDim} />
      </View>
      <Text style={[styles.label, danger && { color: colors.dislike }]}>{label}</Text>
      {value ? (
        <Text
          style={[
            styles.value,
            highlight && { color: colors.warn },
            mono && { fontFamily: fonts.mono }
          ]}
        >
          {value}
        </Text>
      ) : null}
      <Icon name="chev_r" size={15} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    backgroundColor: colors.bg
  },
  root: {
    flex: 1,
    backgroundColor: colors.bg
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 60
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: spacing.lg
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 17
  },
  headerSpacer: {
    width: 36
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center"
  },
  iconBoxDanger: {
    backgroundColor: "rgba(255,77,94,0.12)"
  },
  label: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 14
  },
  value: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 13
  },
  footer: {
    paddingVertical: 24,
    alignItems: "center"
  },
  footerText: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 11
  }
});
