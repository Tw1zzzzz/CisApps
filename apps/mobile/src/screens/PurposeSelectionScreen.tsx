import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { User, UserIntent } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { Button, Muted, Surface, Title } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { colors, fonts, spacing } from "../design/tokens";

export function PurposeSelectionScreen({
  api,
  onSelected
}: {
  api: PartyUpApi;
  onSelected: (user: User) => void;
}) {
  const [intent, setIntent] = useState<UserIntent>("player");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const user = await api.setUserIntent({ intent });
      onSelected(user);
    } catch {
      setError("Не удалось сохранить цель. Проверь соединение и повтори.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.kicker}>PARTY UP</Text>
        <Title>Для чего ты заходишь?</Title>
        <Muted>Выбери основной сценарий. В MVP один аккаунт работает либо как игрок, либо как рекрутер.</Muted>
      </View>

      <View style={styles.options}>
        <IntentCard
          active={intent === "player"}
          icon="crosshair"
          title="Я игрок"
          body="Создать анкету, искать тиммейтов и отправлять заявки миксам, стакам и командам."
          onPress={() => setIntent("player")}
        />
        <IntentCard
          active={intent === "recruiter"}
          icon="search"
          title="Я ищу игроков"
          body="Создать профиль менеджера, тренера или аналитика и принять заявки в организацию."
          onPress={() => setIntent("recruiter")}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button onPress={save}>{saving ? "Сохраняем" : "Продолжить"}</Button>
    </View>
  );
}

function IntentCard({
  active,
  icon,
  title,
  body,
  onPress
}: {
  active: boolean;
  icon: "crosshair" | "search";
  title: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Surface style={[styles.card, active && styles.cardActive]}>
        <View style={[styles.iconBox, active && styles.iconBoxActive]}>
          <Icon name={icon} size={22} stroke={2.2} color={active ? "#fff" : colors.accent} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Muted>{body}</Muted>
        </View>
        {active ? <Icon name="check" size={20} stroke={2.4} color={colors.like} /> : null}
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.bg
  },
  header: {
    gap: spacing.sm
  },
  kicker: {
    color: colors.accent,
    fontFamily: fonts.monoBold,
    fontSize: 12
  },
  options: {
    gap: spacing.md
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  cardActive: {
    borderColor: "rgba(42,171,238,0.5)",
    backgroundColor: colors.accentSoft
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface2
  },
  iconBoxActive: {
    backgroundColor: colors.accent
  },
  cardText: {
    flex: 1,
    gap: 3
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 16
  },
  error: {
    color: colors.dislike,
    fontFamily: fonts.bold,
    fontSize: 13
  }
});
