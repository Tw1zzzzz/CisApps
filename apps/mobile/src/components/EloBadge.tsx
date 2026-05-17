import { StyleSheet, Text, View } from "react-native";
import { fonts } from "../design/tokens";
import { Icon } from "./Icon";

interface EloMeta {
  tier: string;
  color: string;
  bg: string;
  border: string;
}

function eloMeta(elo: number): EloMeta {
  if (elo >= 2001) return { tier: "Lvl 10", color: "#FFD24D", bg: "rgba(255,210,77,0.12)", border: "rgba(255,210,77,0.32)" };
  if (elo >= 1751) return { tier: "Lvl 9", color: "#FF8FA0", bg: "rgba(255,143,160,0.10)", border: "rgba(255,143,160,0.28)" };
  if (elo >= 1531) return { tier: "Lvl 8", color: "#FFB78A", bg: "rgba(255,183,138,0.10)", border: "rgba(255,183,138,0.28)" };
  if (elo >= 1351) return { tier: "Lvl 7", color: "#6EC6FF", bg: "rgba(110,198,255,0.10)", border: "rgba(110,198,255,0.28)" };
  if (elo >= 1201) return { tier: "Lvl 6", color: "#8FB7FF", bg: "rgba(143,183,255,0.10)", border: "rgba(143,183,255,0.28)" };
  if (elo >= 1051) return { tier: "Lvl 5", color: "#A8E6C5", bg: "rgba(168,230,197,0.10)", border: "rgba(168,230,197,0.28)" };
  if (elo >= 901) return { tier: "Lvl 4", color: "#A8E6C5", bg: "rgba(168,230,197,0.08)", border: "rgba(168,230,197,0.22)" };
  if (elo >= 751) return { tier: "Lvl 3", color: "#9AA3B5", bg: "rgba(154,163,181,0.10)", border: "rgba(154,163,181,0.22)" };
  if (elo >= 501) return { tier: "Lvl 2", color: "#9AA3B5", bg: "rgba(154,163,181,0.08)", border: "rgba(154,163,181,0.18)" };
  return { tier: "Lvl 1", color: "#9AA3B5", bg: "rgba(154,163,181,0.06)", border: "rgba(154,163,181,0.15)" };
}

interface EloBadgeProps {
  elo: number;
  size?: "sm" | "md" | "lg";
  label?: boolean;
  verified?: boolean;
}

const sizes = {
  sm: { fs: 13, padV: 4, padH: 8, lfs: 9, gap: 1 },
  md: { fs: 16, padV: 6, padH: 10, lfs: 9, gap: 2 },
  lg: { fs: 22, padV: 8, padH: 12, lfs: 9.5, gap: 2 }
};

export function EloBadge({ elo, size = "md", label = true, verified = false }: EloBadgeProps) {
  const m = eloMeta(elo);
  const s = sizes[size];

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingVertical: s.padV,
          paddingHorizontal: s.padH,
          backgroundColor: m.bg,
          borderColor: m.border,
          gap: s.gap
        }
      ]}
    >
      {label ? (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: m.color, fontSize: s.lfs }]}>FACEIT · {m.tier}</Text>
          {verified ? <Icon name="check" size={s.lfs + 1} stroke={3} color={m.color} /> : null}
        </View>
      ) : null}
      <View style={styles.valueRow}>
        <Text style={[styles.value, { fontSize: s.fs }]}>{elo}</Text>
        <Text style={[styles.valueSuffix, { fontSize: s.fs * 0.55 }]}>elo</Text>
      </View>
    </View>
  );
}

export { eloMeta };

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  label: {
    fontFamily: fonts.monoBold,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline"
  },
  value: {
    color: "#fff",
    fontFamily: fonts.monoBold,
    letterSpacing: -0.4
  },
  valueSuffix: {
    color: "rgba(255,255,255,0.55)",
    fontFamily: fonts.mono,
    marginLeft: 3
  }
});
