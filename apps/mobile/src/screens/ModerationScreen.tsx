import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "../components/Primitives";
import { Icon, type IconName } from "../components/Icon";
import { Avatar } from "../components/Avatar";
import { EloBadge } from "../components/EloBadge";
import { RoleChip } from "../components/Chips";
import { colors, fonts, spacing } from "../design/tokens";

type Kind = "new" | "report" | "photo" | "edit";
type Severity = "low" | "med" | "high";

interface ModItem {
  id: string;
  kind: Kind;
  name: string;
  nick: string;
  age: number;
  elo: number;
  role: string;
  reason: string;
  count?: number;
  faceitNick: string | null;
  verified: boolean;
  ts: string;
  hue: number;
  severity: Severity;
}

const INITIAL_QUEUE: ModItem[] = [
  { id: "m1", kind: "new", name: "Кирилл", nick: "kkk_one", age: 19, elo: 1240, role: "Entry", reason: "Новая анкета", faceitNick: "kkk_one", verified: true, ts: "2 мин", hue: 30, severity: "low" },
  { id: "m2", kind: "report", name: "Аноним", nick: "spam_alex", age: 24, elo: 850, role: "Rifler", reason: "Жалоба: спам в био", count: 4, faceitNick: null, verified: false, ts: "8 мин", hue: 0, severity: "high" },
  { id: "m3", kind: "photo", name: "Денис", nick: "wraith", age: 25, elo: 2480, role: "IGL", reason: "Фото на проверке", faceitNick: "wraithcs", verified: true, ts: "14 мин", hue: 45, severity: "low" },
  { id: "m4", kind: "report", name: "Игорь", nick: "toxic_one", age: 28, elo: 1450, role: "AWPer", reason: "Токсичность · мут в чате", count: 2, faceitNick: "igor_awp", verified: true, ts: "23 мин", hue: 200, severity: "med" },
  { id: "m5", kind: "new", name: "Полина", nick: "pln", age: 20, elo: 1670, role: "Support", reason: "Новая анкета", faceitNick: "pln_sup", verified: true, ts: "32 мин", hue: 320, severity: "low" },
  { id: "m6", kind: "edit", name: "Стас", nick: "staz", age: 23, elo: 1980, role: "Lurker", reason: "Изменил bio · нужна проверка", faceitNick: "staz_lurk", verified: true, ts: "1 ч", hue: 165, severity: "low" }
];

interface KindMeta {
  label: string;
  color: string;
  bg: string;
  icon: IconName;
}

const KIND_META: Record<Kind, KindMeta> = {
  new: { label: "Новая", color: colors.accent, bg: "rgba(42,171,238,0.12)", icon: "plus" },
  report: { label: "Жалоба", color: colors.dislike, bg: "rgba(255,77,94,0.12)", icon: "flag" },
  photo: { label: "Фото", color: colors.warn, bg: "rgba(255,177,61,0.14)", icon: "eye" },
  edit: { label: "Правка", color: colors.super, bg: "rgba(181,127,255,0.14)", icon: "pencil" }
};

type FilterKey = "all" | Kind;

export function ModerationScreen({ onClose }: { onClose: () => void }) {
  const [queue, setQueue] = useState<ModItem[]>(INITIAL_QUEUE);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [toast, setToast] = useState<"approve" | "reject" | "ban" | null>(null);

  const counts = useMemo(
    () => ({
      new: queue.filter((c) => c.kind === "new").length,
      report: queue.filter((c) => c.kind === "report").length,
      photo: queue.filter((c) => c.kind === "photo").length,
      edit: queue.filter((c) => c.kind === "edit").length
    }),
    [queue]
  );

  const filtered = useMemo(() => (filter === "all" ? queue : queue.filter((c) => c.kind === filter)), [filter, queue]);

  function handle(id: string, verdict: "approve" | "reject" | "ban") {
    setQueue((q) => q.filter((c) => c.id !== id));
    setToast(verdict);
    setTimeout(() => setToast(null), 1500);
  }

  return (
    <SafeAreaView style={styles.overlay} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <IconButton onPress={onClose}>
          <Icon name="back" size={18} color={colors.text} />
        </IconButton>
        <Text style={styles.title}>Модерация</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>admin</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statStrip}>
          <ModStat label="В очереди" value={queue.length} accent />
          <ModStat label="Сегодня · ✓" value={142} />
          <ModStat label="Сегодня · ✕" value={18} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <FilterChip label="Все" count={queue.length} active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterChip label="Новые" count={counts.new} active={filter === "new"} onPress={() => setFilter("new")} />
          <FilterChip label="Жалобы" count={counts.report} active={filter === "report"} onPress={() => setFilter("report")} />
          <FilterChip label="Фото" count={counts.photo} active={filter === "photo"} onPress={() => setFilter("photo")} />
          <FilterChip label="Правки" count={counts.edit} active={filter === "edit"} onPress={() => setFilter("edit")} />
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyMark}>✓</Text>
            <Text style={styles.emptyText}>Очередь пуста</Text>
          </View>
        ) : (
          filtered.map((item) => (
            <ModCard
              key={item.id}
              item={item}
              onApprove={() => handle(item.id, "approve")}
              onReject={() => handle(item.id, "reject")}
            />
          ))
        )}
      </ScrollView>

      {toast ? (
        <View
          style={[
            styles.toast,
            {
              backgroundColor:
                toast === "approve" ? colors.like : toast === "ban" ? colors.super : colors.dislike
            }
          ]}
        >
          <Text style={styles.toastText}>
            {toast === "approve" ? "✓ Одобрено" : toast === "ban" ? "⛔ Забанено" : "✕ Отклонено"}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function ModStat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && { color: colors.accent }]}>{value}</Text>
    </View>
  );
}

function FilterChip({ label, count, active, onPress }: { label: string; count: number; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
      <View style={[styles.filterCount, active && styles.filterCountActive]}>
        <Text style={styles.filterCountText}>{count}</Text>
      </View>
    </Pressable>
  );
}

function ModCard({ item, onApprove, onReject }: { item: ModItem; onApprove: () => void; onReject: () => void }) {
  const meta = KIND_META[item.kind];
  return (
    <View style={[styles.card, item.severity === "high" && styles.cardHigh]}>
      <View style={styles.cardTop}>
        <Avatar name={item.name} hue={item.hue} size={48} />
        <View style={styles.cardTopContent}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardAge}>{item.age}</Text>
            <Text style={styles.cardNick}>@{item.nick}</Text>
          </View>
          <View style={styles.cardMetaRow}>
            <View style={[styles.kindPill, { backgroundColor: meta.bg }]}>
              <Icon name={meta.icon} size={10} stroke={2.2} color={meta.color} />
              <Text style={[styles.kindText, { color: meta.color }]}>
                {meta.label}
                {item.count ? ` ·${item.count}` : ""}
              </Text>
            </View>
            <Text style={styles.cardTs}>{item.ts}</Text>
          </View>
        </View>
        <Icon name="chev_r" size={16} color={colors.textMuted} />
      </View>

      <View style={styles.cardChips}>
        <EloBadge elo={item.elo} size="sm" />
        <RoleChip role={item.role} />
      </View>

      <View style={styles.cardReason}>
        <Text style={styles.cardReasonText}>
          <Text style={styles.cardReasonLabel}>Причина: </Text>
          <Text style={styles.cardReasonValue}>{item.reason}</Text>
        </Text>
      </View>

      <View style={styles.cardActions}>
        <Pressable onPress={onReject} style={[styles.actionBtn, styles.actionReject]}>
          <Icon name="x" size={15} stroke={2.4} color={colors.dislike} />
          <Text style={[styles.actionText, { color: colors.dislike }]}>Отклонить</Text>
        </Pressable>
        <Pressable onPress={onApprove} style={[styles.actionBtn, styles.actionApprove]}>
          <Icon name="check" size={15} stroke={2.4} color={colors.like} />
          <Text style={[styles.actionText, { color: colors.like }]}>Одобрить</Text>
        </Pressable>
      </View>
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
    backgroundColor: "rgba(255,177,61,0.14)"
  },
  adminText: {
    color: colors.warn,
    fontFamily: fonts.monoBold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  scroll: {
    flex: 1
  },
  content: {
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
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  statValue: {
    color: colors.text,
    fontFamily: fonts.monoBold,
    fontSize: 22,
    letterSpacing: -0.4,
    marginTop: 4
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 6
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  filterChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: "transparent"
  },
  filterText: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 12
  },
  filterTextActive: {
    color: colors.accent
  },
  filterCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.05)"
  },
  filterCountActive: {
    backgroundColor: "rgba(42,171,238,0.18)"
  },
  filterCountText: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 10
  },
  empty: {
    marginHorizontal: spacing.lg,
    marginTop: 14,
    paddingVertical: 32,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderStyle: "dashed"
  },
  emptyMark: {
    color: colors.like,
    fontFamily: fonts.black,
    fontSize: 30,
    marginBottom: 8
  },
  emptyText: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 13
  },
  card: {
    marginHorizontal: spacing.lg,
    marginTop: 10,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden"
  },
  cardHigh: {
    borderColor: "rgba(255,77,94,0.3)"
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  cardTopContent: {
    flex: 1,
    gap: 4
  },
  cardNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    flexWrap: "wrap"
  },
  cardName: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 15
  },
  cardAge: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 13
  },
  cardNick: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 11
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  kindPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5
  },
  kindText: {
    fontFamily: fonts.monoBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  cardTs: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 11
  },
  cardChips: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 10
  },
  cardReason: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderTopColor: colors.border,
    borderTopWidth: 1
  },
  cardReasonText: {
    fontSize: 12.5
  },
  cardReasonLabel: {
    color: colors.textMuted,
    fontFamily: fonts.medium
  },
  cardReasonValue: {
    color: colors.text,
    fontFamily: fonts.bold
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
    borderTopColor: colors.border,
    borderTopWidth: 1
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1
  },
  actionReject: {
    backgroundColor: "rgba(255,77,94,0.10)",
    borderColor: "rgba(255,77,94,0.24)"
  },
  actionApprove: {
    backgroundColor: "rgba(78,203,113,0.12)",
    borderColor: "rgba(78,203,113,0.28)"
  },
  actionText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    letterSpacing: -0.2
  },
  toast: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10
  },
  toastText: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 13
  }
});
