import { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { MatchSummaryDto } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { Title, IconButton, StateView } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { Avatar } from "../components/Avatar";
import { SectionTitle } from "../components/Chips";
import { colors, fonts, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";

export function ChatsScreen({ api }: { api: PartyUpApi }) {
  const load = useCallback(() => api.getChats(), [api]);
  const { state, reload } = useAsync(load, (items) => items.length === 0);
  const chats = state.status === "success" || state.status === "empty" ? state.data : [];
  const unreadCount = chats.filter((c) => c.unreadCount > 0).length;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Title>Чаты</Title>
          <Text style={styles.subtitle}>
            <Text style={styles.subtitleAccent}>{chats.length}</Text> мэтчей · {unreadCount} непрочитано
          </Text>
        </View>
        <IconButton>
          <Icon name="search" size={18} color={colors.textDim} />
        </IconButton>
      </View>

      {state.status === "loading" || state.status === "error" ? (
        <StateView state={state.status} onRetry={reload} />
      ) : chats.length === 0 ? (
        <StateView state="empty" onRetry={reload} />
      ) : (
        <>
          <SectionTitle>Сообщения</SectionTitle>
          {chats.map((chat) => (
            <ChatRow key={chat.id} chat={chat} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

function ChatRow({ chat }: { chat: MatchSummaryDto }) {
  return (
    <Pressable style={[styles.chatRow, chat.unreadCount > 0 && styles.chatRowUnread]}>
      <View style={styles.chatAvatar}>
        <Avatar name={chat.profile.displayName} hue={chat.profile.avatarHue} size={48} />
        {chat.profile.isOnline ? <View style={styles.chatOnline} /> : null}
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatTitleRow}>
          <Text style={styles.chatName}>{chat.profile.displayName}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>{chat.profile.gameProfile.role}</Text>
          </View>
          <Text style={styles.chatElo}>{chat.profile.gameProfile.elo.toLocaleString("ru-RU")}</Text>
        </View>
        <Text style={[styles.chatLast, chat.unreadCount > 0 && styles.chatLastUnread]} numberOfLines={1}>
          {chat.lastMessage ?? "Новый мэтч. Можно написать первым."}
        </Text>
      </View>
      <View style={styles.chatRight}>
        <Text style={styles.chatTime}>{new Date(chat.createdAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</Text>
        {chat.unreadCount > 0 ? (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{chat.unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    paddingBottom: 8
  },
  subtitle: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 13,
    marginTop: 4
  },
  subtitleAccent: {
    color: colors.accent,
    fontFamily: fonts.monoBold
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6
  },
  chatRowUnread: {
    backgroundColor: "rgba(42,171,238,0.05)"
  },
  chatAvatar: {
    position: "relative"
  },
  chatOnline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.like,
    borderColor: colors.bg,
    borderWidth: 2
  },
  chatContent: {
    flex: 1,
    gap: 3
  },
  chatTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  chatName: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 14.5
  },
  rolePill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  rolePillText: {
    color: colors.textDim,
    fontFamily: fonts.monoBold,
    fontSize: 9,
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  chatElo: {
    color: colors.textMuted,
    fontFamily: fonts.monoBold,
    fontSize: 10
  },
  chatLast: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 13
  },
  chatLastUnread: {
    color: colors.text,
    fontFamily: fonts.bold
  },
  chatRight: {
    alignItems: "flex-end",
    gap: 4
  },
  chatTime: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 11
  },
  unreadBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.accent,
    minWidth: 18,
    alignItems: "center"
  },
  unreadText: {
    color: "#fff",
    fontFamily: fonts.monoBold,
    fontSize: 10
  }
});
