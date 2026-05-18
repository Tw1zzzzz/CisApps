import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ModerationStatus, OrganizationModerationItemDto } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { IconButton, Muted, StateView, Surface } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { colors, fonts, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";

type FilterKey = ModerationStatus | "all";
type Verdict = "approved" | "rejected" | "restricted";

const FILTERS: Array<{ id: FilterKey; label: string }> = [
  { id: "pending", label: "На проверке" },
  { id: "approved", label: "Одобрены" },
  { id: "rejected", label: "Отклонены" },
  { id: "restricted", label: "Ограничены" },
  { id: "all", label: "Все" }
];

const statusLabels: Record<ModerationStatus, string> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  restricted: "restricted"
};

const typeLabels = {
  mix: "Микс",
  stack: "Стак",
  team: "Команда"
} as const;

export function ModerationScreen({ api, onClose }: { api: PartyUpApi; onClose: () => void }) {
  const [filter, setFilter] = useState<FilterKey>("pending");
  const [toast, setToast] = useState<string | null>(null);
  const load = useCallback(() => api.getOrganizationModerationQueue(filter), [api, filter]);
  const { state, reload } = useAsync(load, (items) => items.length === 0);

  const counts = useMemo(() => {
    const items = state.status === "success" || state.status === "empty" ? state.data : [];
    return {
      visible: items.length,
      pending: items.filter((item) => item.organization.moderationStatus === "pending").length
    };
  }, [state]);

  async function moderate(id: string, status: Verdict) {
    try {
      await api.updateOrganizationModeration(id, { status });
      setToast(status === "approved" ? "Организация одобрена" : status === "rejected" ? "Организация отклонена" : "Организация ограничена");
      setTimeout(() => setToast(null), 1400);
      await reload();
    } catch {
      setToast("Не удалось обновить статус");
      setTimeout(() => setToast(null), 1400);
    }
  }

  return (
    <SafeAreaView style={styles.overlay} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <IconButton onPress={onClose}>
          <Icon name="back" size={18} color={colors.text} />
        </IconButton>
        <Text style={styles.title}>Модерация организаций</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>admin</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statStrip}>
          <ModStat label="В выборке" value={counts.visible} accent />
          <ModStat label="Pending" value={counts.pending} />
          <ModStat label="SLA" value={24} suffix="ч" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((item) => (
            <FilterChip
              key={item.id}
              label={item.label}
              active={filter === item.id}
              onPress={() => setFilter(item.id)}
            />
          ))}
        </ScrollView>

        {state.status === "loading" || state.status === "error" ? (
          <StateView state={state.status} onRetry={reload} />
        ) : state.status === "empty" ? (
          <View style={styles.empty}>
            <Text style={styles.emptyMark}>✓</Text>
            <Text style={styles.emptyText}>Очередь пуста</Text>
            <Muted>Новые миксы, стаки и команды появятся здесь до публикации в ленте.</Muted>
          </View>
        ) : (
          state.data.map((item) => (
            <OrganizationModCard
              key={item.organization.id}
              item={item}
              onApprove={() => moderate(item.organization.id, "approved")}
              onReject={() => moderate(item.organization.id, "rejected")}
              onRestrict={() => moderate(item.organization.id, "restricted")}
            />
          ))
        )}
      </ScrollView>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function ModStat({ label, value, accent = false, suffix = "" }: { label: string; value: number; accent?: boolean; suffix?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && { color: colors.accent }]}>{value}{suffix}</Text>
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

function OrganizationModCard({
  item,
  onApprove,
  onReject,
  onRestrict
}: {
  item: OrganizationModerationItemDto;
  onApprove: () => void;
  onReject: () => void;
  onRestrict: () => void;
}) {
  const organization = item.organization;
  const statusColor =
    organization.moderationStatus === "approved"
      ? colors.like
      : organization.moderationStatus === "rejected"
        ? colors.dislike
        : organization.moderationStatus === "restricted"
          ? colors.super
          : colors.warn;

  return (
    <Surface style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.orgIcon}>
          <Icon name="flag" size={18} color={colors.accent} stroke={2.2} />
        </View>
        <View style={styles.cardMain}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{organization.name}</Text>
            <Text style={styles.type}>{typeLabels[organization.type]}</Text>
          </View>
          <Text style={styles.owner}>{item.recruiter?.displayName ?? "Recruiter"} · {item.ownerEmail}</Text>
        </View>
        <Text style={[styles.status, { color: statusColor }]}>{statusLabels[organization.moderationStatus]}</Text>
      </View>

      <Text style={styles.description}>{organization.description}</Text>

      <View style={styles.metaGrid}>
        <Meta label="Регион" value={organization.region} />
        <Meta label="ELO" value={`${organization.targetEloMin}-${organization.targetEloMax}`} />
        <Meta label="Роли" value={organization.neededRoles.join(", ")} />
      </View>

      <View style={styles.tags}>
        {organization.languages.map((language) => (
          <View key={language} style={styles.tag}>
            <Text style={styles.tagText}>{language}</Text>
          </View>
        ))}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{organization.isRecruiting ? "Набор открыт" : "Набор закрыт"}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onReject} style={[styles.actionBtn, styles.rejectBtn]}>
          <Icon name="x" size={15} stroke={2.4} color={colors.dislike} />
          <Text style={[styles.actionText, { color: colors.dislike }]}>Reject</Text>
        </Pressable>
        <Pressable onPress={onRestrict} style={[styles.actionBtn, styles.restrictBtn]}>
          <Icon name="eye_off" size={15} stroke={2.2} color={colors.super} />
          <Text style={[styles.actionText, { color: colors.super }]}>Restrict</Text>
        </Pressable>
        <Pressable onPress={onApprove} style={[styles.actionBtn, styles.approveBtn]}>
          <Icon name="check" size={15} stroke={2.4} color={colors.like} />
          <Text style={[styles.actionText, { color: colors.like }]}>Approve</Text>
        </Pressable>
      </View>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    backgroundColor: colors.bg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 14
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 17
  },
  adminBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.warnSoft
  },
  adminText: {
    color: colors.warn,
    fontFamily: fonts.monoBold,
    fontSize: 9.5,
    textTransform: "uppercase"
  },
  scroll: {
    flex: 1
  },
  content: {
    gap: spacing.md,
    paddingBottom: 30
  },
  statStrip: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.lg
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    textTransform: "uppercase"
  },
  statValue: {
    color: colors.text,
    fontFamily: fonts.monoBold,
    fontSize: 22,
    marginTop: 6
  },
  filterRow: {
    gap: 8,
    paddingHorizontal: spacing.lg
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface
  },
  filterChipActive: {
    borderColor: "rgba(42,171,238,0.45)",
    backgroundColor: colors.accentSoft
  },
  filterText: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 12
  },
  filterTextActive: {
    color: colors.text
  },
  empty: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.xl
  },
  emptyMark: {
    color: colors.like,
    fontFamily: fonts.black,
    fontSize: 42
  },
  emptyText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18
  },
  card: {
    gap: spacing.md,
    marginHorizontal: spacing.lg
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  orgIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft
  },
  cardMain: {
    flex: 1,
    gap: 3
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8
  },
  name: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 17
  },
  type: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 11
  },
  owner: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12
  },
  status: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    textTransform: "uppercase"
  },
  description: {
    color: colors.text,
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
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surface2
  },
  tagText: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 11
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  actionBtn: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1
  },
  rejectBtn: {
    backgroundColor: colors.dislikeSoft,
    borderColor: "rgba(255,77,94,0.25)"
  },
  restrictBtn: {
    backgroundColor: colors.superSoft,
    borderColor: "rgba(181,127,255,0.25)"
  },
  approveBtn: {
    backgroundColor: colors.likeSoft,
    borderColor: "rgba(78,203,113,0.25)"
  },
  actionText: {
    fontFamily: fonts.bold,
    fontSize: 12
  },
  toast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.surface3
  },
  toastText: {
    color: colors.text,
    fontFamily: fonts.bold
  }
});
