import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { DiscoveryProfile } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { Muted, Surface, Title } from "../components/Primitives";
import { HeroPlaceholder } from "../components/HeroPlaceholder";
import { Icon } from "../components/Icon";
import { EloBadge } from "../components/EloBadge";
import { FaceitCard } from "../components/FaceitCard";
import { CS2StatsCard } from "../components/CS2StatsCard";
import { SectionTitle, StatusPill, Tag } from "../components/Chips";
import { colors, fonts, shadows, spacing } from "../design/tokens";

export function ProfileDetailScreen({ profile, api, onClose }: { profile: DiscoveryProfile; api: PartyUpApi; onClose: () => void }) {
  const onPass = () => void api.sendLike(profile.id, "pass").then(onClose);
  const onLike = () => void api.sendLike(profile.id, "like").then(onClose);
  const onSuper = () => void api.sendLike(profile.id, "super-like").then(onClose);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <HeroPlaceholder hue={profile.avatarHue} initial={profile.displayName.slice(0, 1).toUpperCase()} label="галерея фото" />
          <View style={styles.heroTop}>
            <Pressable onPress={onClose} style={styles.heroBtn}>
              <Icon name="chev_d" size={20} stroke={2.2} color="#fff" />
            </Pressable>
            <Pressable style={styles.heroBtn}>
              <Icon name="flag" size={18} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroPills}>
              {profile.isOnline ? (
                <StatusPill>
                  <View style={styles.onlineDot} />
                  <Text style={styles.pillText}> online</Text>
                </StatusPill>
              ) : null}
              <StatusPill>
                <Icon name="pin" size={11} stroke={2} color="rgba(255,255,255,0.9)" />
                <Text style={styles.pillText}> {profile.region}</Text>
              </StatusPill>
            </View>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName}>{profile.displayName}</Text>
              <Text style={styles.heroAge}>{profile.age}</Text>
            </View>
            <Text style={styles.heroNick}>@{profile.nickname}</Text>
          </View>
        </View>

        <View style={styles.bioWrap}>
          <Surface>
            <Text style={styles.bio}>{profile.bio}</Text>
          </Surface>
        </View>

        <View style={styles.section}>
          <SectionTitle>Faceit</SectionTitle>
          <FaceitCard
            nickname={profile.faceit?.nickname ?? null}
            profileUrl={profile.faceit?.profileUrl ?? null}
            verified={profile.faceit?.verified ?? false}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle>CS2 · профиль</SectionTitle>
          <CS2StatsCard game={profile.gameProfile} />
        </View>

        <View style={styles.section}>
          <SectionTitle>Языки</SectionTitle>
          <View style={styles.tagsRow}>
            {profile.languages.map((lang) => (
              <Tag key={lang} icon="globe">{lang}</Tag>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Параметры</SectionTitle>
          <View style={styles.kvGrid}>
            <KV label="Регион" value={profile.region} />
            <KV label="ELO" value={`${profile.gameProfile.elo}`} mono />
            <KV label="Роль" value={profile.gameProfile.role} />
            <KV label="Часы" value={String(profile.gameProfile.hours ?? "—")} mono />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable onPress={onPass} style={[styles.fab, { borderColor: colors.dislike }]}>
          <Icon name="x" size={20} stroke={2.4} color={colors.dislike} />
        </Pressable>
        <Pressable onPress={onSuper} style={[styles.fab, styles.fabSuper]}>
          <Icon name="bolt" size={18} stroke={2.4} color={colors.super} />
        </Pressable>
        <Pressable onPress={onLike} style={[styles.fab, { borderColor: colors.like }]}>
          <Icon name="heart" size={20} stroke={2.4} color={colors.like} />
        </Pressable>
      </View>
    </View>
  );
}

function KV({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.kv}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValue, mono && { fontFamily: fonts.monoBold }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    backgroundColor: colors.bg
  },
  content: {
    paddingBottom: 130
  },
  hero: {
    height: 460,
    position: "relative"
  },
  heroTop: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  heroBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(11,14,20,0.55)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  heroBottom: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    gap: 8
  },
  heroPills: {
    flexDirection: "row",
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
  heroNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8
  },
  heroName: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 32,
    letterSpacing: -0.5
  },
  heroAge: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.medium,
    fontSize: 26
  },
  heroNick: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.mono,
    fontSize: 13
  },
  bioWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 18
  },
  bio: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22
  },
  section: {
    paddingHorizontal: spacing.lg
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6
  },
  kvGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  kv: {
    width: "48%",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  kvLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  kvValue: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 14,
    marginTop: 4
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: 14,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    backgroundColor: colors.bg
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surface2,
    borderColor: colors.borderStrong,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.elevate2
  },
  fabSuper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: colors.super
  }
});
