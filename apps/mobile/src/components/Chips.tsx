import type { ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors, fonts } from "../design/tokens";
import { Icon, type IconName } from "./Icon";

const MAP_ABBR: Record<string, string> = {
  Mirage: "mir",
  Inferno: "inf",
  Ancient: "anc",
  Anubis: "anu",
  Nuke: "nuk",
  Dust2: "d2",
  Overpass: "ovp",
  Vertigo: "vrt",
  Train: "trn"
};

export function MapChip({ name, mode = "short" }: { name: string; mode?: "short" | "full" }) {
  const label = mode === "short" ? (MAP_ABBR[name] ?? name.slice(0, 3).toLowerCase()) : name;
  return (
    <View style={styles.mapChip}>
      <Text style={[styles.mapText, mode === "short" && styles.mapTextLower]}>{label}</Text>
    </View>
  );
}

export function MapPool({ maps, max = 4, mode = "short" }: { maps: string[]; max?: number; mode?: "short" | "full" }) {
  const shown = maps.slice(0, max);
  const extra = maps.length - shown.length;
  return (
    <View style={styles.mapPool}>
      {shown.map((m) => (
        <MapChip key={m} name={m} mode={mode} />
      ))}
      {extra > 0 ? (
        <View style={[styles.mapChip, styles.mapChipMuted]}>
          <Text style={[styles.mapText, { color: colors.textMuted }]}>+{extra}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function RoleChip({ role, side }: { role: string; side?: string }) {
  return (
    <View style={styles.roleChip}>
      <Icon name="crosshair" size={11} stroke={2.2} color="rgba(255,255,255,0.7)" />
      <Text style={styles.roleText}>
        {role}
        {side ? <Text style={styles.roleSide}> · {side}</Text> : null}
      </Text>
    </View>
  );
}

export function Tag({ children, accent = false, icon, style }: { children: ReactNode; accent?: boolean; icon?: IconName; style?: ViewStyle }) {
  return (
    <View style={[styles.tag, accent && styles.tagAccent, style]}>
      {icon ? <Icon name={icon} size={11} stroke={2} color={accent ? colors.accent : colors.textDim} /> : null}
      <Text style={[styles.tagText, accent && styles.tagTextAccent]}>{children}</Text>
    </View>
  );
}

export function StatusPill({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <View style={[styles.statusPill, color ? { borderColor: color + "55" } : null]}>
      <Text style={[styles.statusText, color ? { color } : null]}>{children}</Text>
    </View>
  );
}

export function PlayTimeRow({ time, color = "rgba(255,255,255,0.7)" }: { time: string; color?: string }) {
  return (
    <View style={styles.playTimeRow}>
      <Icon name="rewind" size={11} stroke={2} color={color} />
      <Text style={[styles.playTimeText, { color }]}>{time}</Text>
    </View>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitleText}>{children}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  mapChip: {
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1
  },
  mapChipMuted: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.06)"
  },
  mapText: {
    fontFamily: fonts.monoBold,
    fontSize: 10.5,
    color: "rgba(255,255,255,0.88)",
    letterSpacing: 0.5
  },
  mapTextLower: {
    textTransform: "lowercase"
  },
  mapPool: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    alignSelf: "flex-start"
  },
  roleText: {
    color: "#fff",
    fontSize: 11.5,
    fontFamily: fonts.bold
  },
  roleSide: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: fonts.medium
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.06)",
    borderWidth: 1
  },
  tagAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: "transparent"
  },
  tagText: {
    fontSize: 11.5,
    color: colors.textDim,
    fontFamily: fonts.medium
  },
  tagTextAccent: {
    color: colors.accent
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(10,12,18,0.5)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1
  },
  statusText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
    fontFamily: fonts.medium
  },
  playTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  playTimeText: {
    fontSize: 11.5,
    fontFamily: fonts.medium
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 10
  },
  sectionTitleText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  }
});
