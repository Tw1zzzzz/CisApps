import { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { PrivateProfileDto } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { Button, IconButton, Muted, StateView, Title } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { Avatar } from "../components/Avatar";
import { CompletionRing } from "../components/CompletionRing";
import { StatCard } from "../components/StatCard";
import { FaceitCard } from "../components/FaceitCard";
import { CS2StatsCard } from "../components/CS2StatsCard";
import { SectionTitle } from "../components/Chips";
import { colors, fonts, radius, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";

interface Props {
  api: PartyUpApi;
  onEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenAnalytics?: () => void;
  onOpenModeration?: () => void;
}

export function MyProfileScreen({ api, onEditProfile, onOpenSettings, onOpenAnalytics, onOpenModeration }: Props) {
  const load = useCallback(() => api.getMe(), [api]);
  const { state, reload } = useAsync(load);

  if (state.status === "error") {
    return <MissingProfile onCreateProfile={onEditProfile} onRetry={reload} />;
  }

  if (state.status === "loading" || state.status === "empty") {
    return <StateView state={state.status} onRetry={reload} />;
  }

  return (
    <ProfileContent
      data={state.data}
      onEditProfile={onEditProfile}
      onOpenSettings={onOpenSettings}
      onOpenAnalytics={onOpenAnalytics}
      onOpenModeration={onOpenModeration}
    />
  );
}

function MissingProfile({ onCreateProfile, onRetry }: { onCreateProfile: () => void; onRetry: () => void }) {
  return (
    <View style={styles.missing}>
      <Title>Анкета не создана</Title>
      <Muted>Создай базовый CS2-профиль, чтобы появиться в discovery, получать лайки и создавать мэтчи.</Muted>
      <Button onPress={onCreateProfile}>Создать анкету</Button>
      <Button tone="ghost" onPress={onRetry}>Повторить загрузку</Button>
    </View>
  );
}

function ProfileContent({
  data,
  onEditProfile,
  onOpenSettings,
  onOpenAnalytics,
  onOpenModeration
}: {
  data: PrivateProfileDto;
  onEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenAnalytics?: (() => void) | undefined;
  onOpenModeration?: (() => void) | undefined;
}) {
  const { profile, user } = data;
  const faceit = profile.providerAccounts.find((account) => account.provider === "faceit");
  const isAdmin = user.role === "admin";

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Title>Профиль</Title>
        <View style={styles.headerActions}>
          {isAdmin && onOpenModeration ? (
            <IconButton onPress={onOpenModeration}>
              <Icon name="shield" size={18} color={colors.textDim} />
            </IconButton>
          ) : null}
          {isAdmin && onOpenAnalytics ? (
            <IconButton onPress={onOpenAnalytics}>
              <Icon name="chart" size={18} color={colors.textDim} />
            </IconButton>
          ) : null}
          <IconButton onPress={onOpenSettings}>
            <Icon name="settings" size={18} color={colors.textDim} />
          </IconButton>
        </View>
      </View>

      <View style={styles.hero}>
        <CompletionRing pct={data.completion} size={76}>
          <Avatar name={profile.displayName} hue={profile.avatarHue} size={70} />
        </CompletionRing>
        <View style={styles.heroMain}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.displayName}</Text>
            <Text style={styles.age}>{profile.age}</Text>
          </View>
          <Text style={styles.nick}>@{profile.nickname}</Text>
          <View style={styles.completionRow}>
            <Text style={styles.completionLabel}>Анкета заполнена</Text>
            <Text style={styles.completionValue}>{data.completion}%</Text>
          </View>
        </View>
      </View>

      {data.completion < 100 ? (
        <Pressable style={styles.cta} onPress={onEditProfile}>
          <View style={styles.ctaIcon}>
            <Icon name="bolt" size={16} stroke={2} color={colors.accent} />
          </View>
          <Text style={styles.ctaText}>Заверши анкету — получи +30% откликов</Text>
          <Icon name="chev_r" size={16} color={colors.textDim} />
        </Pressable>
      ) : null}

      <View style={styles.statGrid}>
        <StatCard label="Суперлайки" value={3} icon="bolt" color={colors.super} />
        <StatCard label="Бусты" value={1} icon="fire" color={colors.accent} />
        <StatCard label="Просмотры" value={142} icon="eye" color={colors.like} />
      </View>

      <SectionTitle>Faceit</SectionTitle>
      <FaceitCard
        nickname={faceit?.nickname ?? null}
        profileUrl={faceit?.profileUrl ?? null}
        verified={faceit?.verified ?? false}
      />

      <SectionTitle>CS2 · профиль</SectionTitle>
      <CS2StatsCard game={profile.gameProfile} />

      <SectionTitle>О себе</SectionTitle>
      <View style={styles.bioCard}>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <SectionTitle>Языки</SectionTitle>
      <View style={styles.tagsRow}>
        {profile.languages.map((lang) => (
          <View key={lang} style={styles.langTag}>
            <Icon name="globe" size={11} stroke={2} color={colors.textDim} />
            <Text style={styles.langText}>{lang}</Text>
          </View>
        ))}
      </View>

      <SectionTitle>Действия</SectionTitle>
      <RowAction icon="pencil" label="Редактировать анкету" onPress={onEditProfile} />
      <RowAction icon="share" label="Поделиться профилем" />
      <RowAction icon="eye_off" label="Скрыть профиль" subtle />
    </ScrollView>
  );
}

function RowAction({ icon, label, onPress, subtle = false }: { icon: "pencil" | "share" | "eye_off"; label: string; onPress?: () => void; subtle?: boolean }) {
  return (
    <Pressable onPress={onPress} style={styles.rowAction}>
      <Icon name={icon} size={18} stroke={2} color={subtle ? colors.textDim : colors.accent} />
      <Text style={[styles.rowText, subtle && { color: colors.textDim }]}>{label}</Text>
      <Icon name="chev_r" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg
  },
  missing: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.bg
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: spacing.lg
  },
  headerActions: {
    flexDirection: "row",
    gap: 8
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1
  },
  heroMain: {
    flex: 1,
    gap: 2
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6
  },
  name: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 20,
    letterSpacing: -0.4
  },
  age: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 18
  },
  nick: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 12
  },
  completionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6
  },
  completionLabel: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 11
  },
  completionValue: {
    color: colors.accent,
    fontFamily: fonts.monoBold,
    fontSize: 11
  },
  cta: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(42,171,238,0.08)",
    borderRadius: 12,
    borderColor: "rgba(42,171,238,0.18)",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  ctaIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  ctaText: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 13.5
  },
  statGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  bioCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 14
  },
  bio: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 21
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6
  },
  langTag: {
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
  langText: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 11.5
  },
  rowAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1
  },
  rowText: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 14
  }
});
