import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "../components/Primitives";
import { Icon, type IconName } from "../components/Icon";
import { SectionTitle } from "../components/Chips";
import { colors, fonts, spacing } from "../design/tokens";

const SERIES = [12, 18, 14, 26, 24, 32, 38, 30, 42, 48, 52, 60, 56, 68, 72];
const RANKS = [
  { name: "Lvl 10 (2001+)", pct: 6, color: "#FFD24D" },
  { name: "Lvl 8–9 (1531–2000)", pct: 18, color: "#FF8FA0" },
  { name: "Lvl 6–7 (1201–1530)", pct: 34, color: "#6EC6FF" },
  { name: "Lvl 4–5 (901–1200)", pct: 26, color: "#A8E6C5" },
  { name: "Lvl 1–3 (<900)", pct: 16, color: "#9AA3B5" }
];
const FUNNEL = [
  { label: "Открыли бота", value: 24818, pct: 100 },
  { label: "Создали анкету", value: 18402, pct: 74 },
  { label: "Хотя бы 1 свайп", value: 16108, pct: 65 },
  { label: "≥1 мэтч", value: 9220, pct: 37 },
  { label: "≥1 сообщение", value: 6480, pct: 26 }
];
const MOD_QUEUE = [
  { type: "report" as const, who: "@spam_alex", reason: "Спам в чате", count: 4 },
  { type: "photo" as const, who: "@ghost_p", reason: "Фото на проверке" },
  { type: "report" as const, who: "@toxic_one", reason: "Токсичность", count: 2 }
];

export function AnalyticsScreen({ onClose }: { onClose: () => void }) {
  return (
    <SafeAreaView style={styles.overlay} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <IconButton onPress={onClose}>
          <Icon name="back" size={18} color={colors.text} />
        </IconButton>
        <Text style={styles.title}>Аналитика</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>admin</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.kpiGrid}>
          <KPI label="Активных за 24ч" value="14 820" delta="+8.4%" />
          <KPI label="Новые регистрации" value="486" delta="+12.1%" />
          <KPI label="Мэтчей сегодня" value="3 211" delta="+4.7%" />
          <KPI label="Сообщений" value="58 401" delta="-2.1%" down />
        </View>

        <View style={styles.section}>
          <SectionTitle>DAU · последние 15 дней</SectionTitle>
          <DauChart />
        </View>

        <View style={styles.section}>
          <SectionTitle>Распределение по рейтингу</SectionTitle>
          <RankCard />
        </View>

        <View style={styles.section}>
          <SectionTitle>Воронка</SectionTitle>
          <FunnelCard />
        </View>

        <View style={styles.section}>
          <SectionTitle>Модерация · очередь</SectionTitle>
          <View style={styles.modList}>
            {MOD_QUEUE.map((row) => (
              <ModRow key={row.who} type={row.type} who={row.who} reason={row.reason} count={row.count} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function KPI({ label, value, delta, down = false }: { label: string; value: string; delta: string; down?: boolean }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={[styles.kpiDelta, { color: down ? colors.dislike : colors.like }]}>{delta}</Text>
    </View>
  );
}

function DauChart() {
  const max = Math.max(...SERIES);
  return (
    <View style={styles.dauCard}>
      <View style={styles.dauBars}>
        {SERIES.map((v, i) => {
          const isLast = i === SERIES.length - 1;
          const heightPct = (v / max) * 100;
          return (
            <View key={i} style={styles.dauBarSlot}>
              {isLast ? (
                <LinearGradient
                  colors={[colors.accent, "#6EC6FF"]}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                  style={[styles.dauBar, { height: `${heightPct}%` }]}
                />
              ) : (
                <View style={[styles.dauBar, styles.dauBarIdle, { height: `${heightPct}%` }]} />
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.dauLabels}>
        <Text style={styles.dauLabel}>3 май</Text>
        <Text style={styles.dauLabel}>10 май</Text>
        <Text style={styles.dauLabel}>сегодня</Text>
      </View>
    </View>
  );
}

function RankCard() {
  return (
    <View style={styles.rankCard}>
      <View style={styles.rankStack}>
        {RANKS.map((r) => (
          <View key={r.name} style={{ width: `${r.pct}%`, backgroundColor: r.color, opacity: 0.7 }} />
        ))}
      </View>
      <View style={styles.rankList}>
        {RANKS.map((r) => (
          <View key={r.name} style={styles.rankRow}>
            <View style={[styles.rankDot, { backgroundColor: r.color }]} />
            <Text style={styles.rankName}>{r.name}</Text>
            <Text style={styles.rankPct}>{r.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FunnelCard() {
  return (
    <View style={styles.funnelCard}>
      {FUNNEL.map((row, i) => (
        <View key={row.label} style={[styles.funnelRow, i === FUNNEL.length - 1 && { marginBottom: 0 }]}>
          <View style={styles.funnelLabelRow}>
            <Text style={styles.funnelLabel}>{row.label}</Text>
            <Text style={styles.funnelValue}>
              {row.value.toLocaleString("ru-RU")} · {row.pct}%
            </Text>
          </View>
          <View style={styles.funnelTrack}>
            <LinearGradient
              colors={[colors.accent, colors.super]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.funnelFill, { width: `${row.pct}%` }]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function ModRow({ type, who, reason, count }: { type: "report" | "photo"; who: string; reason: string; count?: number | undefined }) {
  const iconName: IconName = type === "report" ? "flag" : "eye";
  const iconColor = type === "report" ? colors.dislike : colors.warn;
  const iconBg = type === "report" ? "rgba(255,77,94,0.12)" : "rgba(255,177,61,0.14)";
  return (
    <View style={styles.modRow}>
      <View style={[styles.modIcon, { backgroundColor: iconBg }]}>
        <Icon name={iconName} size={15} stroke={2} color={iconColor} />
      </View>
      <View style={styles.modContent}>
        <Text style={styles.modWho}>{who}</Text>
        <Text style={styles.modReason}>{reason}</Text>
      </View>
      {count ? (
        <View style={styles.modCount}>
          <Text style={styles.modCountText}>×{count}</Text>
        </View>
      ) : null}
      <View style={styles.modOpen}>
        <Text style={styles.modOpenText}>Открыть</Text>
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
    paddingBottom: 40
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: spacing.lg
  },
  kpi: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  kpiLabel: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  kpiValue: {
    color: colors.text,
    fontFamily: fonts.monoBold,
    fontSize: 22,
    letterSpacing: -0.4,
    marginTop: 6
  },
  kpiDelta: {
    fontFamily: fonts.monoBold,
    fontSize: 11,
    marginTop: 2
  },
  section: {
    paddingHorizontal: spacing.lg
  },
  dauCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8
  },
  dauBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 110
  },
  dauBarSlot: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end"
  },
  dauBar: {
    width: "100%",
    borderRadius: 3
  },
  dauBarIdle: {
    backgroundColor: "rgba(42,171,238,0.22)",
    borderColor: "rgba(42,171,238,0.15)",
    borderWidth: 1
  },
  dauLabels: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dauLabel: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 9.5
  },
  rankCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12
  },
  rankStack: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    borderColor: colors.border,
    borderWidth: 1
  },
  rankList: {
    gap: 8
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  rankDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    opacity: 0.8
  },
  rankName: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 13
  },
  rankPct: {
    color: colors.textDim,
    fontFamily: fonts.monoBold,
    fontSize: 12.5
  },
  funnelCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14
  },
  funnelRow: {
    marginBottom: 10
  },
  funnelLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4
  },
  funnelLabel: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 12.5
  },
  funnelValue: {
    color: colors.textDim,
    fontFamily: fonts.mono,
    fontSize: 12.5
  },
  funnelTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden"
  },
  funnelFill: {
    height: "100%",
    borderRadius: 3
  },
  modList: {
    gap: 8
  },
  modRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  modIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  modContent: {
    flex: 1,
    gap: 2
  },
  modWho: {
    color: colors.text,
    fontFamily: fonts.monoBold,
    fontSize: 13
  },
  modReason: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 11.5
  },
  modCount: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.surface3
  },
  modCountText: {
    color: colors.text,
    fontFamily: fonts.monoBold,
    fontSize: 11
  },
  modOpen: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.accent
  },
  modOpenText: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 12
  }
});
