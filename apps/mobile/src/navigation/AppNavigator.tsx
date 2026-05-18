import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createApiClient, createAuthClient } from "../api/client";
import type { PartyUpApi } from "../api/types";
import { Icon, type IconName } from "../components/Icon";
import { colors, fonts, spacing } from "../design/tokens";
import { DiscoveryScreen } from "../screens/DiscoveryScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen";
import { LikesScreen } from "../screens/LikesScreen";
import { ChatsScreen } from "../screens/ChatsScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { ProfileDetailScreen } from "../screens/ProfileDetailScreen";
import { MyProfileScreen } from "../screens/MyProfileScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { ModerationScreen } from "../screens/ModerationScreen";
import { AnalyticsScreen } from "../screens/AnalyticsScreen";
import { OrganizationsFeedScreen } from "../screens/OrganizationsFeedScreen";
import { OrganizationProfileScreen } from "../screens/OrganizationProfileScreen";
import { PurposeSelectionScreen } from "../screens/PurposeSelectionScreen";
import type { DiscoveryProfile, User } from "@party-up/domain";

type Tab = "discovery" | "teams" | "likes" | "chats" | "profile";
type Overlay =
  | { type: "profile-detail"; profile: DiscoveryProfile }
  | { type: "edit-profile" }
  | { type: "settings" }
  | { type: "moderation" }
  | { type: "analytics" }
  | null;

export function AppNavigator() {
  const authApi = useMemo(() => createAuthClient(), []);
  const [sessionToken, setSessionToken] = useState<string | null>(
    process.env.EXPO_PUBLIC_SKIP_ONBOARDING === "1" ? "mock-token" : null
  );
  const [sessionUser, setSessionUser] = useState<User | null>(
    process.env.EXPO_PUBLIC_SKIP_ONBOARDING === "1" ? mockSessionUser : null
  );
  const api = useMemo<PartyUpApi>(() => createApiClient(sessionToken), [sessionToken]);
  const [tab, setTab] = useState<Tab>("discovery");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [profileRevision, setProfileRevision] = useState(0);

  if (!sessionToken) {
    return (
      <OnboardingScreen
        authApi={authApi}
        onAuthenticated={(token, user) => {
          setSessionToken(token);
          setSessionUser(user);
          setTab(user.intent === "recruiter" ? "profile" : "discovery");
        }}
      />
    );
  }

  if (!sessionUser?.intent) {
    return (
      <PurposeSelectionScreen
        api={api}
        onSelected={(user) => {
          setSessionUser(user);
          setTab("profile");
          setOverlay(user.intent === "player" ? { type: "edit-profile" } : null);
        }}
      />
    );
  }

  const tabs = sessionUser.intent === "recruiter" ? RECRUITER_TABS : PLAYER_TABS;
  const activeTab = sessionUser.intent === "recruiter" ? "profile" : tab;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.root}>
        {activeTab === "discovery" ? (
          <DiscoveryScreen api={api} onOpenProfile={(profile) => setOverlay({ type: "profile-detail", profile })} />
        ) : null}
        {activeTab === "teams" ? <OrganizationsFeedScreen api={api} /> : null}
        {activeTab === "likes" ? <LikesScreen api={api} /> : null}
        {activeTab === "chats" ? <ChatsScreen api={api} /> : null}
        {activeTab === "profile" && sessionUser.intent === "player" ? (
          <MyProfileScreen
            key={profileRevision}
            api={api}
            onEditProfile={() => setOverlay({ type: "edit-profile" })}
            onOpenSettings={() => setOverlay({ type: "settings" })}
            onOpenAnalytics={() => setOverlay({ type: "analytics" })}
            onOpenModeration={() => setOverlay({ type: "moderation" })}
          />
        ) : null}
        {activeTab === "profile" && sessionUser.intent === "recruiter" ? <OrganizationProfileScreen api={api} /> : null}
        <TabBar tabs={tabs} tab={activeTab} onChange={setTab} likesCount={6} chatsCount={2} />
        {overlay?.type === "profile-detail" ? (
          <ProfileDetailScreen profile={overlay.profile} api={api} onClose={() => setOverlay(null)} />
        ) : null}
        {overlay?.type === "edit-profile" ? (
          <EditProfileScreen
            api={api}
            requireProfile={sessionUser.intent === "player" && tab === "profile"}
            onClose={() => {
              setOverlay(null);
              setProfileRevision((current) => current + 1);
            }}
          />
        ) : null}
        {overlay?.type === "settings" ? <SettingsScreen onClose={() => setOverlay(null)} /> : null}
        {overlay?.type === "moderation" ? <ModerationScreen onClose={() => setOverlay(null)} /> : null}
        {overlay?.type === "analytics" ? <AnalyticsScreen onClose={() => setOverlay(null)} /> : null}
      </View>
    </SafeAreaView>
  );
}

interface TabConfig {
  id: Tab;
  label: string;
  icon: IconName;
}

const TABS: TabConfig[] = [
  { id: "discovery", label: "Анкеты", icon: "cards" },
  { id: "teams", label: "Команды", icon: "flag" },
  { id: "likes", label: "Лайки", icon: "heart" },
  { id: "chats", label: "Чаты", icon: "chat" },
  { id: "profile", label: "Профиль", icon: "user" }
];

const PLAYER_TABS = TABS;
const RECRUITER_TABS: TabConfig[] = [
  { id: "profile", label: "Организация", icon: "flag" }
];

const mockSessionUser: User = {
  id: "user_me",
  email: "demo@partyup.local",
  role: "admin",
  intent: "player",
  createdAt: new Date("2026-05-17T12:00:00.000Z").toISOString()
};

function TabBar({
  tabs,
  tab,
  onChange,
  likesCount,
  chatsCount
}: {
  tabs: TabConfig[];
  tab: Tab;
  onChange: (tab: Tab) => void;
  likesCount: number;
  chatsCount: number;
}) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.tabSafe}>
      <View style={styles.tabs}>
        {tabs.map((item) => {
          const active = tab === item.id;
          const badge = item.id === "likes" ? likesCount : item.id === "chats" ? chatsCount : 0;
          const color = active ? colors.accent : colors.textMuted;
          return (
            <Pressable key={item.id} onPress={() => onChange(item.id)} style={styles.tab}>
              <View style={styles.tabIconWrap}>
                <Icon name={item.icon} size={22} stroke={2} color={color} />
                {badge > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.tabLabel, { color }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg
  },
  root: {
    flex: 1,
    backgroundColor: colors.bg
  },
  tabSafe: {
    backgroundColor: "rgba(11,14,20,0.96)",
    borderTopColor: colors.border,
    borderTopWidth: 1
  },
  tabs: {
    minHeight: 68,
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4
  },
  tabIconWrap: {
    position: "relative",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: colors.dislike,
    minWidth: 18,
    alignItems: "center"
  },
  badgeText: {
    color: "#fff",
    fontFamily: fonts.monoBold,
    fontSize: 10
  },
  tabLabel: {
    fontFamily: fonts.bold,
    fontSize: 11
  }
});
