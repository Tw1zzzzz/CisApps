import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { GameProfile } from "@party-up/domain";
import { colors, fonts } from "../design/tokens";
import { EloBadge } from "./EloBadge";
import { MapPool } from "./Chips";
import { Icon } from "./Icon";

interface Props {
  game: GameProfile;
  side?: string;
}

export function CS2StatsCard({ game, side = "B-site" }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <LinearGradient
          colors={["rgba(110,198,255,0.08)", "rgba(181,127,255,0.05)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <EloBadge elo={game.elo} size="lg" />
        <View style={styles.peakBox}>
          <Text style={styles.peakLabel}>Peak elo</Text>
          <Text style={styles.peakValue}>{(game.peakElo ?? game.elo).toLocaleString("ru-RU")}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <StatBlock label="Роль" value={game.role} />
        <StatBlock label="Сайд" value={side} />
        <StatBlock label="Часов" value={(game.hours ?? 0).toLocaleString("ru-RU")} mono />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Маппул · {game.maps.length}/9</Text>
        <MapPool maps={game.maps} max={9} mode="full" />
      </View>

      <View style={styles.timeRow}>
        <View>
          <Text style={styles.sectionLabel}>Когда играет</Text>
          <Text style={styles.timeValue}>{game.availability}</Text>
        </View>
        <View style={styles.timeIconBox}>
          <Icon name="bell" size={16} stroke={2} color={colors.accent} />
        </View>
      </View>
    </View>
  );
}

function StatBlock({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, mono && { fontFamily: fonts.monoBold }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden"
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: colors.border,
    borderBottomWidth: 1
  },
  peakBox: {
    alignItems: "flex-end"
  },
  peakLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  peakValue: {
    color: colors.text,
    fontFamily: fonts.monoBold,
    fontSize: 16,
    marginTop: 2
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: 1
  },
  stat: {
    flex: 1
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
    fontFamily: fonts.bold,
    fontSize: 14,
    marginTop: 4,
    letterSpacing: -0.2
  },
  section: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomColor: colors.border,
    borderBottomWidth: 1
  },
  sectionLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  timeValue: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 14,
    marginTop: 4
  },
  timeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  }
});
