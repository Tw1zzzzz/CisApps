import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../design/tokens";
import { Icon, type IconName } from "./Icon";

interface Props {
  label: string;
  value: string | number;
  icon: IconName;
  color: string;
}

export function StatCard({ label, value, icon, color }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Icon name={icon} size={13} stroke={2} color={color} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  label: {
    color: colors.textMuted,
    fontSize: 10.5,
    fontFamily: fonts.medium,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  value: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.monoBold,
    letterSpacing: -0.4
  }
});
