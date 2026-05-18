import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { OrganizationFeedItemDto } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { Button, Muted, StateView, Surface, Title } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { colors, fonts, radius, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";

const typeLabels = {
  mix: "Микс",
  stack: "Стак",
  team: "Команда"
} as const;

export function OrganizationsFeedScreen({ api }: { api: PartyUpApi }) {
  const load = useCallback(() => api.getOrganizationFeed(), [api]);
  const { state, reload } = useAsync(load, (items) => items.length === 0);

  if (state.status === "loading" || state.status === "empty" || state.status === "error") {
    return <StateView state={state.status} onRetry={reload} />;
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Title>Команды</Title>
          <Muted>Лента миксов, стаков и команд, которые сейчас набирают игроков.</Muted>
        </View>
        <View style={styles.countPill}>
          <Icon name="search" size={14} color={colors.accent} stroke={2.2} />
          <Text style={styles.countText}>{state.data.length}</Text>
        </View>
      </View>

      {state.data.map((item) => (
        <OrganizationCard key={item.organization.id} item={item} api={api} onApplied={reload} />
      ))}
    </ScrollView>
  );
}

function OrganizationCard({
  item,
  api,
  onApplied
}: {
  item: OrganizationFeedItemDto;
  api: PartyUpApi;
  onApplied: () => void;
}) {
  const { organization } = item;
  const [message, setMessage] = useState("Готов сыграть тестовую и обсудить расписание.");
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(item.applied ? "Заявка уже отправлена" : null);

  async function apply() {
    setSaving(true);
    setStatus(null);
    try {
      await api.applyToOrganization(organization.id, message);
      setStatus("Заявка отправлена");
      setExpanded(false);
      onApplied();
    } catch {
      setStatus("Не удалось отправить заявку.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Surface style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typePill}>
          <Text style={styles.typeText}>{typeLabels[organization.type]}</Text>
        </View>
        <Text style={styles.region}>{organization.region}</Text>
      </View>

      <Text style={styles.name}>{organization.name}</Text>
      <Text style={styles.description}>{organization.description}</Text>

      <View style={styles.metaGrid}>
        <Meta label="ELO" value={`${organization.targetEloMin}-${organization.targetEloMax}`} />
        <Meta label="Роли" value={organization.neededRoles.join(", ")} />
        <Meta label="Языки" value={organization.languages.join(", ")} />
      </View>

      {expanded ? (
        <View style={styles.applyBox}>
          <Text style={styles.label}>Сообщение</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={300}
            placeholder="Коротко напиши, почему ты подходишь."
            placeholderTextColor={colors.textMuted}
            style={styles.textarea}
          />
          <View style={styles.actionsRow}>
            <Button tone="ghost" fullWidth={false} onPress={() => setExpanded(false)}>
              Отмена
            </Button>
            <Button fullWidth={false} onPress={apply}>
              {saving ? "Отправляем" : "Apply"}
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.actionsRow}>
          {status ? <Text style={styles.status}>{status}</Text> : <View />}
          <Button tone={item.applied ? "ghost" : "primary"} fullWidth={false} onPress={() => setExpanded(true)}>
            {item.applied ? "Повторить" : "Откликнуться"}
          </Button>
        </View>
      )}
    </Surface>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.meta}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: 8,
    paddingBottom: spacing.sm
  },
  countPill: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.accentSoft
  },
  countText: {
    color: colors.accent,
    fontFamily: fonts.monoBold,
    fontSize: 12
  },
  card: {
    gap: spacing.md
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.surface2
  },
  typeText: {
    color: colors.accent,
    fontFamily: fonts.bold,
    fontSize: 12
  },
  region: {
    color: colors.textDim,
    fontFamily: fonts.monoBold,
    fontSize: 12
  },
  name: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 20
  },
  description: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  metaGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  meta: {
    flex: 1,
    minHeight: 58,
    padding: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    gap: 4
  },
  metaLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    textTransform: "uppercase"
  },
  metaValue: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16
  },
  applyBox: {
    gap: spacing.sm
  },
  label: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 11,
    textTransform: "uppercase"
  },
  textarea: {
    minHeight: 92,
    borderRadius: radius.md,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    backgroundColor: colors.surface2,
    color: colors.text,
    padding: spacing.md,
    textAlignVertical: "top",
    fontFamily: fonts.medium,
    fontSize: 14
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  status: {
    flex: 1,
    color: colors.like,
    fontFamily: fonts.bold,
    fontSize: 12
  }
});
