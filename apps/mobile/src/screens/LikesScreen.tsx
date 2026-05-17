import { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { LikeSummaryDto } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { StateView, Title } from "../components/Primitives";
import { colors, fonts, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";

const FILTERS = ["Все", "Онлайн", "AWPer", "IGL", "Entry", "Rifler", "Support", "Lurker"] as const;
type Filter = (typeof FILTERS)[number];

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_PADDING = spacing.lg;
const GRID_GAP = 10;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH / 0.78;

export function LikesScreen({ api }: { api: PartyUpApi }) {
  const [tab, setTab] = useState<"incoming" | "outgoing">("incoming");
  const [filter, setFilter] = useState<Filter>("Все");
  const load = useCallback(() => api.getLikes(tab), [api, tab]);
  const { state, reload } = useAsync(load, (items) => items.length === 0);

  const data = useMemo(() => {
    const items = state.status === "success" || state.status === "empty" ? state.data : [];
    if (filter === "Все") return items;
    if (filter === "Онлайн") return items.filter((item) => item.profile.isOnline);
    return items.filter((item) => item.profile.gameProfile.role === filter);
  }, [filter, state]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Title>Лайки</Title>
        <Text style={styles.subtitle}>
          <Text style={styles.subtitleAccent}>{data.length}</Text>{" "}
          {tab === "incoming" ? "человек хотят в твоё пати" : "анкет в исходящих"}
        </Text>
      </View>

      <View style={styles.tabsWrap}>
        <View style={styles.tabs}>
          <Pressable onPress={() => setTab("incoming")} style={[styles.tab, tab === "incoming" && styles.tabActive]}>
            <Text style={[styles.tabText, tab === "incoming" && styles.tabTextActive]}>Мне лайкнули</Text>
          </Pressable>
          <Pressable onPress={() => setTab("outgoing")} style={[styles.tab, tab === "outgoing" && styles.tabActive]}>
            <Text style={[styles.tabText, tab === "outgoing" && styles.tabTextActive]}>Я лайкнул</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {state.status === "loading" || state.status === "error" ? (
        <StateView state={state.status} onRetry={reload} />
      ) : data.length === 0 ? (
        <StateView state="empty" onRetry={reload} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LikeCard like={item} />}
          numColumns={2}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function LikeCard({ like }: { like: LikeSummaryDto }) {
  const profile = like.profile;
  const gradientColors: readonly [string, string, string] = [
    hsl(profile.avatarHue, 65, 45),
    hsl((profile.avatarHue + 40) % 360, 60, 22),
    hsl((profile.avatarHue + 80) % 360, 55, 14)
  ];

  return (
    <Pressable style={styles.card}>
      <LinearGradient colors={gradientColors} start={{ x: 0.3, y: 0.25 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
      <Text style={styles.cardInitial}>{profile.displayName[0]?.toUpperCase() ?? ""}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{profile.gameProfile.role}</Text>
      </View>
      {like.action === "super-like" ? (
        <View style={styles.superBadge}>
          <Text style={styles.superText}>SUPER</Text>
        </View>
      ) : null}
      {profile.isOnline ? <View style={styles.onlineDot} /> : null}
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} start={{ x: 0.5, y: 0.45 }} end={{ x: 0.5, y: 1 }} style={styles.cardShade} />
      <View style={styles.cardInfo}>
        <View style={styles.cardNameRow}>
          <Text style={styles.cardName}>{profile.displayName}</Text>
          <Text style={styles.cardAge}>{profile.age}</Text>
        </View>
        <Text style={styles.cardElo}>{profile.gameProfile.elo.toLocaleString("ru-RU")} ELO</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 4
  },
  subtitle: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 13
  },
  subtitleAccent: {
    color: colors.accent,
    fontFamily: fonts.monoBold
  },
  tabsWrap: {
    paddingHorizontal: spacing.lg
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 4
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center"
  },
  tabActive: {
    backgroundColor: colors.surface3
  },
  tabText: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 13
  },
  tabTextActive: {
    color: colors.text
  },
  filterWrap: {
    height: 48,
    marginTop: 12
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    gap: 8
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
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
  grid: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 4,
    paddingBottom: 140,
    gap: GRID_GAP
  },
  columnWrap: {
    gap: GRID_GAP
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    position: "relative"
  },
  cardInitial: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    textAlign: "center",
    transform: [{ translateY: -55 }],
    color: "rgba(255,255,255,0.10)",
    fontFamily: fonts.black,
    fontSize: 120,
    lineHeight: 120,
    letterSpacing: 0
  },
  roleBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: "rgba(11,14,20,0.65)"
  },
  roleText: {
    color: "#fff",
    fontFamily: fonts.monoBold,
    fontSize: 9.5,
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  superBadge: {
    position: "absolute",
    top: 8,
    left: 24,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: colors.super
  },
  superText: {
    color: "#fff",
    fontFamily: fonts.monoBold,
    fontSize: 9
  },
  onlineDot: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.like,
    borderColor: "rgba(11,14,20,0.6)",
    borderWidth: 2
  },
  cardShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%"
  },
  cardInfo: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
    gap: 2
  },
  cardNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4
  },
  cardName: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 14
  },
  cardAge: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.medium,
    fontSize: 12
  },
  cardElo: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.mono,
    fontSize: 11
  }
});
