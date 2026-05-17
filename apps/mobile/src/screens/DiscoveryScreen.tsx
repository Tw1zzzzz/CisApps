import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import type { DiscoveryFilters, DiscoveryProfile, LikeAction } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { IconButton, StateView } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { HeroPlaceholder } from "../components/HeroPlaceholder";
import { EloBadge } from "../components/EloBadge";
import { MapPool, PlayTimeRow, RoleChip, StatusPill, Tag } from "../components/Chips";
import { colors, fonts, radius, shadows, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";
import { FiltersScreen } from "./FiltersScreen";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 90;
const SUPER_THRESHOLD = 130;

const defaultFilters: DiscoveryFilters = {
  role: "all",
  region: "EU+CIS",
  ageMin: 18,
  ageMax: 35,
  eloMin: 1200,
  eloMax: 2500,
  maps: [],
  onlyOnline: false,
  withMic: true,
  verifiedOnly: false
};

export function DiscoveryScreen({ api, onOpenProfile }: { api: PartyUpApi; onOpenProfile: (profile: DiscoveryProfile) => void }) {
  const [filters, setFilters] = useState<DiscoveryFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [stack, setStack] = useState<DiscoveryProfile[]>([]);
  const load = useCallback(() => api.getDiscovery(filters), [api, filters]);
  const { state, reload } = useAsync(load, (items) => items.length === 0);

  useEffect(() => {
    if (state.status === "success" || state.status === "empty") {
      setStack(state.data.map((d) => d.profile));
    }
  }, [state]);

  const filterSummary = useMemo(
    () => `CS2 · ${filters.region ?? "EU+CIS"} · elo ${filters.eloMin ?? 0}–${filters.eloMax ?? "∞"}`,
    [filters]
  );

  const handleAction = useCallback(
    (action: LikeAction, profile: DiscoveryProfile) => {
      setStack((prev) => prev.slice(1));
      void api.sendLike(profile.id, action).catch(() => undefined);
      if (stack.length <= 2) void reload();
    },
    [api, stack.length, reload]
  );

  if (showFilters) {
    return (
      <FiltersScreen
        filters={filters}
        onApply={(next) => {
          setFilters(next);
          setShowFilters(false);
        }}
        onClose={() => setShowFilters(false)}
      />
    );
  }

  const current = stack[0];
  const next = stack[1];
  const third = stack[2];

  return (
    <View style={styles.root}>
      <Header summary={filterSummary} onOpenFilters={() => setShowFilters(true)} />
      {state.status === "loading" || state.status === "error" ? (
        <StateView state={state.status} onRetry={reload} />
      ) : !current ? (
        <StateView state="empty" onRetry={reload} />
      ) : (
        <>
          <View style={styles.cardArea}>
            {third ? <BackCard profile={third} offset={20} scale={0.92} opacity={0.5} /> : null}
            {next ? <BackCard profile={next} offset={10} scale={0.96} opacity={0.85} /> : null}
            <SwipeCard
              key={current.id}
              profile={current}
              onAction={handleAction}
              onOpen={() => onOpenProfile(current)}
            />
          </View>
          <ActionDock onAction={(a) => handleAction(a, current)} />
        </>
      )}
    </View>
  );
}

function Header({ summary, onOpenFilters }: { summary: string; onOpenFilters: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Icon name="crosshair" size={16} color="#fff" stroke={2.2} />
        </View>
        <View>
          <Text style={styles.logoText}>PARTY UP</Text>
          <Text style={styles.logoSub}>{summary}</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <IconButton onPress={onOpenFilters}>
          <Icon name="filter" size={18} color={colors.textDim} />
        </IconButton>
        <IconButton>
          <Icon name="bell" size={18} color={colors.textDim} />
        </IconButton>
      </View>
    </View>
  );
}

function BackCard({ profile, offset, scale, opacity }: { profile: DiscoveryProfile; offset: number; scale: number; opacity: number }) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.card,
        styles.cardBackdrop,
        { transform: [{ translateY: offset }, { scale }], opacity }
      ]}
    >
      <HeroPlaceholder hue={profile.avatarHue} initial={profile.displayName.slice(0, 1).toUpperCase()} />
    </View>
  );
}

interface SwipeCardProps {
  profile: DiscoveryProfile;
  onAction: (action: LikeAction, profile: DiscoveryProfile) => void;
  onOpen: () => void;
}

function SwipeCard({ profile, onAction, onOpen }: SwipeCardProps) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const exiting = useSharedValue(0);

  const handleAction = useCallback(
    (a: LikeAction) => {
      onAction(a, profile);
    },
    [onAction, profile]
  );

  const fly = useCallback(
    (dir: "left" | "right" | "up") => {
      const target = dir === "left" ? -SCREEN_WIDTH * 1.5 : dir === "right" ? SCREEN_WIDTH * 1.5 : 0;
      const targetY = dir === "up" ? -SCREEN_WIDTH * 2 : 0;
      exiting.value = 1;
      tx.value = withTiming(target, { duration: 280 });
      ty.value = withTiming(targetY, { duration: 280 }, () => {
        runOnJS(handleAction)(dir === "left" ? "pass" : dir === "right" ? "like" : "super-like");
      });
    },
    [tx, ty, exiting, handleAction]
  );

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd(() => {
      if (tx.value > SWIPE_THRESHOLD) runOnJS(fly)("right");
      else if (tx.value < -SWIPE_THRESHOLD) runOnJS(fly)("left");
      else if (ty.value < -SUPER_THRESHOLD) runOnJS(fly)("up");
      else {
        tx.value = withSpring(0);
        ty.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${interpolate(tx.value, [-SCREEN_WIDTH, SCREEN_WIDTH], [-15, 15], Extrapolation.CLAMP)}deg` }
    ]
  }));

  const likeOp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP)
  }));
  const passOp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP)
  }));
  const superOp = useAnimatedStyle(() => ({
    opacity: interpolate(ty.value, [-SUPER_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP)
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]}>
        <HeroPlaceholder hue={profile.avatarHue} initial={profile.displayName.slice(0, 1).toUpperCase()} />
        <CardInfo profile={profile} onExpand={onOpen} />
        <Animated.View style={[styles.gestureBadge, styles.gestureLike, likeOp]}>
          <Text style={[styles.gestureText, { color: colors.like }]}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.gestureBadge, styles.gesturePass, passOp]}>
          <Text style={[styles.gestureText, { color: colors.dislike }]}>PASS</Text>
        </Animated.View>
        <Animated.View style={[styles.gestureBadge, styles.gestureSuper, superOp]}>
          <Text style={[styles.gestureText, { color: colors.super }]}>SUPER</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

function CardInfo({ profile, onExpand }: { profile: DiscoveryProfile; onExpand: () => void }) {
  return (
    <View style={styles.cardInfo}>
      <View style={styles.pills}>
        {profile.isOnline ? (
          <StatusPill>
            <View style={styles.onlineDot} />
            <Text style={styles.pillText}> online</Text>
          </StatusPill>
        ) : null}
        <StatusPill>
          <Icon name="globe" size={11} stroke={2} color="rgba(255,255,255,0.9)" />
          <Text style={styles.pillText}> {profile.region}</Text>
        </StatusPill>
        {profile.isVerified ? (
          <StatusPill color={colors.like}>
            <Icon name="shield" size={11} stroke={2.2} color={colors.like} />
            <Text style={[styles.pillText, { color: colors.like }]}> Faceit</Text>
          </StatusPill>
        ) : null}
        {profile.gameProfile.hasMic ? (
          <StatusPill>
            <Icon name="mic" size={11} stroke={2} color="rgba(255,255,255,0.9)" />
            <Text style={styles.pillText}> Мик</Text>
          </StatusPill>
        ) : null}
      </View>

      <View style={styles.cardBottomRow}>
        <View style={styles.cardBottomMain}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.displayName}</Text>
            <Text style={styles.age}>{profile.age}</Text>
          </View>
          <Text style={styles.nick}>@{profile.nickname}</Text>
          <View style={styles.eloRow}>
            <EloBadge elo={profile.gameProfile.elo} size="md" />
            <RoleChip role={profile.gameProfile.role} />
          </View>
          <View style={styles.mapsRow}>
            <MapPool maps={profile.gameProfile.maps} max={5} />
          </View>
          {profile.gameProfile.availability ? (
            <View style={styles.playTimeWrap}>
              <PlayTimeRow time={profile.gameProfile.availability} />
            </View>
          ) : null}
          <Text style={styles.bio} numberOfLines={2}>
            {profile.bio}
          </Text>
        </View>
        <Pressable onPress={onExpand} style={styles.expandButton}>
          <Icon name="chev_u" size={20} stroke={2.2} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function ActionDock({ onAction }: { onAction: (a: LikeAction) => void }) {
  return (
    <View style={styles.actionDock}>
      <Pressable onPress={() => onAction("super-like")} style={styles.fab}>
        <Icon name="bolt" size={22} stroke={2.4} color={colors.super} />
      </Pressable>
      <View style={styles.dockRow}>
        <Pressable style={[styles.dockBtn, { borderColor: colors.dislike + "55" }]} onPress={() => onAction("pass")}>
          <Icon name="x" size={20} stroke={2.4} color={colors.dislike} />
          <Text style={styles.dockText}>Скип</Text>
        </Pressable>
        <Pressable style={[styles.dockBtn, styles.dockBtnPrimary]} onPress={() => onAction("like")}>
          <Icon name="heart" size={20} stroke={2.4} color={colors.like} />
          <Text style={styles.dockText}>В пати</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 8
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.elevate1
  },
  logoText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.black,
    letterSpacing: -0.3,
    lineHeight: 18
  },
  logoSub: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.mono,
    marginTop: 2
  },
  headerActions: {
    flexDirection: "row",
    gap: 8
  },
  cardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  card: {
    position: "absolute",
    width: "100%",
    aspectRatio: 0.7,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadows.card
  },
  cardBackdrop: {
    backgroundColor: colors.surface
  },
  cardInfo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    gap: 10
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  pillText: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: fonts.medium,
    fontSize: 11
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.like
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12
  },
  cardBottomMain: {
    flex: 1,
    gap: 8
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8
  },
  name: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 26,
    letterSpacing: -0.5
  },
  age: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.medium,
    fontSize: 24
  },
  nick: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: fonts.mono,
    fontSize: 12,
    marginTop: -4
  },
  eloRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap"
  },
  mapsRow: {
    marginTop: 2
  },
  playTimeWrap: {
    marginTop: 2
  },
  bio: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  expandButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  gestureBadge: {
    position: "absolute",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: "rgba(11,14,20,0.55)"
  },
  gestureLike: {
    top: 40,
    left: 24,
    transform: [{ rotate: "-18deg" }],
    borderColor: colors.like
  },
  gesturePass: {
    top: 40,
    right: 24,
    transform: [{ rotate: "18deg" }],
    borderColor: colors.dislike
  },
  gestureSuper: {
    top: 24,
    alignSelf: "center",
    borderColor: colors.super
  },
  gestureText: {
    fontSize: 24,
    fontFamily: fonts.black,
    letterSpacing: 1
  },
  actionDock: {
    position: "relative",
    paddingTop: 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: 16
  },
  fab: {
    position: "absolute",
    top: -6,
    alignSelf: "center",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surface2,
    borderColor: colors.super,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    ...shadows.elevate2
  },
  dockRow: {
    flexDirection: "row",
    gap: 10
  },
  dockBtn: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...shadows.elevate1
  },
  dockBtnPrimary: {
    borderColor: colors.like + "55"
  },
  dockText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 15,
    letterSpacing: -0.2
  }
});

export { defaultFilters };
