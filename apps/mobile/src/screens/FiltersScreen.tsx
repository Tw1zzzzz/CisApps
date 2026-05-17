import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CS2_MAPS, CS2_ROLES, type Cs2Map, type DiscoveryFilters } from "@party-up/domain";
import { Button, Title } from "../components/Primitives";
import { SectionTitle, Tag } from "../components/Chips";
import { colors, spacing } from "../design/tokens";

export function FiltersScreen({
  filters,
  onApply,
  onClose
}: {
  filters: DiscoveryFilters;
  onApply: (filters: DiscoveryFilters) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<DiscoveryFilters>(filters);
  const selectedMaps = local.maps ?? [];

  function toggleMap(map: Cs2Map) {
    setLocal((current) => ({
      ...current,
      maps: selectedMaps.includes(map) ? selectedMaps.filter((item) => item !== map) : [...selectedMaps, map]
    }));
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Title>Фильтры</Title>
        <Pressable onPress={onClose}>
          <Text style={styles.close}>Закрыть</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle>Роль</SectionTitle>
        <View style={styles.wrap}>
          {(["all", ...CS2_ROLES] as const).map((role) => (
            <Pressable key={role} onPress={() => setLocal((current) => ({ ...current, role }))}>
              <Tag accent={(local.role ?? "all") === role}>{role === "all" ? "Все" : role}</Tag>
            </Pressable>
          ))}
        </View>
        <SectionTitle>Карты</SectionTitle>
        <View style={styles.wrap}>
          {CS2_MAPS.map((map) => (
            <Pressable key={map} onPress={() => toggleMap(map)}>
              <Tag accent={selectedMaps.includes(map)}>{map}</Tag>
            </Pressable>
          ))}
        </View>
        <SectionTitle>Опции</SectionTitle>
        <View style={styles.wrap}>
          <Pressable onPress={() => setLocal((current) => ({ ...current, onlyOnline: !current.onlyOnline }))}>
            <Tag accent={Boolean(local.onlyOnline)}>Онлайн</Tag>
          </Pressable>
          <Pressable onPress={() => setLocal((current) => ({ ...current, withMic: !current.withMic }))}>
            <Tag accent={Boolean(local.withMic)}>С микрофоном</Tag>
          </Pressable>
          <Pressable onPress={() => setLocal((current) => ({ ...current, verifiedOnly: !current.verifiedOnly }))}>
            <Tag accent={Boolean(local.verifiedOnly)}>Verified</Tag>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button tone="ghost" onPress={() => setLocal({ role: "all", region: "EU+CIS", ageMin: 18, ageMax: 35, eloMin: 0, eloMax: 5000, maps: [], onlyOnline: false, withMic: true, verifiedOnly: false })}>
          Сброс
        </Button>
        <Button onPress={() => onApply(local)}>Применить</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  close: {
    color: colors.accent,
    fontWeight: "800"
  },
  content: {
    paddingBottom: 120
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.lg
  }
});
