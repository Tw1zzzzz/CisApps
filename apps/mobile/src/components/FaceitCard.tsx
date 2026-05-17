import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts } from "../design/tokens";
import { Icon } from "./Icon";

interface Props {
  nickname: string | null;
  profileUrl: string | null;
  verified: boolean;
}

export function FaceitCard({ nickname, profileUrl, verified }: Props) {
  const linked = Boolean(nickname);

  return (
    <View style={[styles.wrap, linked ? styles.wrapLinked : styles.wrapEmpty]}>
      {linked ? (
        <LinearGradient
          colors={["rgba(255,80,0,0.10)", "rgba(255,210,77,0.05)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      <View style={[styles.fc, linked ? styles.fcLinked : null]}>
        <Text style={[styles.fcText, linked ? { color: colors.faceit } : null]}>FC</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{linked ? nickname : "Не привязан"}</Text>
          {linked && verified ? (
            <View style={styles.verifiedPill}>
              <Icon name="check" size={9} stroke={3} color={colors.like} />
              <Text style={styles.verifiedText}>verified</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.url} numberOfLines={1}>
          {linked ? profileUrl ?? "" : "добавь ссылку или укажи elo вручную"}
        </Text>
      </View>
      <Icon name={linked ? "share" : "plus"} size={16} color={colors.textDim} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    overflow: "hidden"
  },
  wrapLinked: {
    borderColor: "rgba(255,150,50,0.22)"
  },
  wrapEmpty: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  fc: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center"
  },
  fcLinked: {
    backgroundColor: colors.faceitSoft
  },
  fcText: {
    color: colors.textDim,
    fontFamily: fonts.monoBold,
    fontSize: 16,
    letterSpacing: -0.4
  },
  content: {
    flex: 1,
    gap: 3
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.bold
  },
  url: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 11
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.likeSoft
  },
  verifiedText: {
    color: colors.like,
    fontFamily: fonts.monoBold,
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  }
});
