import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Cs2Role, OrganizationProfile, OrganizationType, RecruiterProfile, RecruiterRole, TeamApplicationDto } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { Button, Muted, StateView, Surface, Title } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { colors, fonts, radius, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";

interface RecruiterHomeData {
  recruiterProfile: RecruiterProfile | null;
  organization: OrganizationProfile | null;
  applications: TeamApplicationDto[];
}

const roleLabels: Record<RecruiterRole, string> = {
  manager: "Менеджер",
  coach: "Тренер",
  analyst: "Аналитик"
};

const typeLabels: Record<OrganizationType, string> = {
  mix: "Микс",
  stack: "Стак",
  team: "Команда"
};

export function OrganizationProfileScreen({ api }: { api: PartyUpApi }) {
  const load = useCallback(async (): Promise<RecruiterHomeData> => {
    const [recruiterProfile, organization, applications] = await Promise.all([
      api.getRecruiterProfile(),
      api.getMyOrganization(),
      api.getOrganizationApplications()
    ]);
    return { recruiterProfile, organization, applications };
  }, [api]);
  const { state, reload } = useAsync(load);

  if (state.status === "loading" || state.status === "error" || state.status === "empty") {
    return <StateView state={state.status} onRetry={reload} />;
  }

  if (!state.data.recruiterProfile || !state.data.organization) {
    return <RecruiterSetupForm api={api} data={state.data} onCreated={reload} />;
  }

  return <RecruiterDashboard api={api} data={state.data} onChanged={reload} />;
}

function RecruiterSetupForm({
  api,
  data,
  onCreated
}: {
  api: PartyUpApi;
  data: RecruiterHomeData;
  onCreated: () => void;
}) {
  const [displayName, setDisplayName] = useState(data.recruiterProfile?.displayName ?? "Recruiter");
  const [role, setRole] = useState<RecruiterRole>(data.recruiterProfile?.role ?? "manager");
  const [type, setType] = useState<OrganizationType>("stack");
  const [name, setName] = useState("Evening Stack");
  const [targetEloMin, setTargetEloMin] = useState("1200");
  const [targetEloMax, setTargetEloMax] = useState("2400");
  const [neededRoles, setNeededRoles] = useState<Cs2Role[]>(["Rifler", "Support"]);
  const [description, setDescription] = useState("Ищем игроков для регулярных вечерних игр, праков и спокойного разбора ошибок.");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (!data.recruiterProfile) {
        await api.createRecruiterProfile({ role, displayName, contacts: [] });
      }
      if (!data.organization) {
        await api.createOrganization({
          type,
          name,
          game: "cs2",
          region: "EU West",
          targetEloMin: Number(targetEloMin),
          targetEloMax: Number(targetEloMax),
          neededRoles,
          languages: ["RU", "EN"],
          description,
          isRecruiting: true
        });
      }
      onCreated();
    } catch {
      setError("Не удалось создать профиль организации. Проверь поля и повтори.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Title>Профиль организации</Title>
      <Muted>Заполни роль рекрутера и карточку микса, стака или команды. Контакты не попадут в публичную ленту.</Muted>

      <Surface style={styles.form}>
        <Text style={styles.sectionLabel}>Рекрутер</Text>
        <Field label="Имя" value={displayName} onChangeText={setDisplayName} />
        <Segmented
          label="Роль"
          value={role}
          options={["manager", "coach", "analyst"]}
          labels={roleLabels}
          onChange={setRole}
        />
      </Surface>

      <Surface style={styles.form}>
        <Text style={styles.sectionLabel}>Организация</Text>
        <Segmented label="Тип" value={type} options={["mix", "stack", "team"]} labels={typeLabels} onChange={setType} />
        <Field label="Название" value={name} onChangeText={setName} />
        <View style={styles.row}>
          <Field label="ELO от" value={targetEloMin} onChangeText={setTargetEloMin} />
          <Field label="ELO до" value={targetEloMax} onChangeText={setTargetEloMax} />
        </View>
        <RolePicker value={neededRoles} onChange={setNeededRoles} />
        <Field label="Описание" value={description} onChangeText={setDescription} multiline />
      </Surface>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button onPress={save}>{saving ? "Создаём" : "Создать организацию"}</Button>
    </ScrollView>
  );
}

function RecruiterDashboard({
  api,
  data,
  onChanged
}: {
  api: PartyUpApi;
  data: RecruiterHomeData;
  onChanged: () => void;
}) {
  const organization = data.organization!;
  const activeApplications = useMemo(
    () => data.applications.filter((application) => application.status === "pending"),
    [data.applications]
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Title>{organization.name}</Title>
          <Muted>{typeLabels[organization.type]} · {organization.region} · ELO {organization.targetEloMin}-{organization.targetEloMax}</Muted>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeApplications.length}</Text>
        </View>
      </View>

      <Surface style={styles.summaryCard}>
        <Text style={styles.description}>{organization.description}</Text>
        <View style={styles.tags}>
          {organization.neededRoles.map((role) => <Tag key={role}>{role}</Tag>)}
          {organization.languages.map((language) => <Tag key={language}>{language}</Tag>)}
        </View>
      </Surface>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Входящие заявки</Text>
        <Text style={styles.sectionCount}>{data.applications.length}</Text>
      </View>

      {data.applications.length === 0 ? (
        <Surface style={styles.emptyBox}>
          <Muted>Пока нет заявок. Игроки увидят организацию в ленте команд и смогут отправить короткое сообщение.</Muted>
        </Surface>
      ) : (
        data.applications.map((application) => (
          <ApplicationRow key={application.id} api={api} application={application} onChanged={onChanged} />
        ))
      )}
    </ScrollView>
  );
}

function ApplicationRow({
  api,
  application,
  onChanged
}: {
  api: PartyUpApi;
  application: TeamApplicationDto;
  onChanged: () => void;
}) {
  const [saving, setSaving] = useState<ApplicationStatusAction | null>(null);

  async function update(status: ApplicationStatusAction) {
    setSaving(status);
    try {
      await api.updateApplicationStatus(application.id, status);
      onChanged();
    } finally {
      setSaving(null);
    }
  }

  return (
    <Surface style={styles.application}>
      <View style={styles.applicationHeader}>
        <View>
          <Text style={styles.playerName}>{application.player.displayName}</Text>
          <Text style={styles.playerMeta}>
            {application.player.gameProfile.role} · ELO {application.player.gameProfile.elo} · {application.player.region}
          </Text>
        </View>
        <StatusLabel status={application.status} />
      </View>
      <Text style={styles.message}>{application.message || "Без сообщения"}</Text>
      {application.status === "pending" ? (
        <View style={styles.actionsRow}>
          <Button tone="ghost" fullWidth={false} onPress={() => update("rejected")}>
            {saving === "rejected" ? "..." : "Отклонить"}
          </Button>
          <Button fullWidth={false} onPress={() => update("accepted")}>
            {saving === "accepted" ? "..." : "Принять"}
          </Button>
        </View>
      ) : null}
    </Surface>
  );
}

type ApplicationStatusAction = "accepted" | "rejected";

function StatusLabel({ status }: { status: TeamApplicationDto["status"] }) {
  const tone = status === "accepted" ? colors.like : status === "rejected" ? colors.dislike : colors.warn;
  return <Text style={[styles.status, { color: tone }]}>{status}</Text>;
}

function Field({
  label,
  value,
  onChangeText,
  multiline = false
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  labels,
  onChange
}: {
  label: string;
  value: T;
  options: T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.segmented}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.segment, option === value && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, option === value && styles.segmentTextActive]}>{labels[option]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RolePicker({ value, onChange }: { value: Cs2Role[]; onChange: (value: Cs2Role[]) => void }) {
  const roles: Cs2Role[] = ["AWPer", "Entry", "Rifler", "Support", "IGL"];

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Нужные роли</Text>
      <View style={styles.tags}>
        {roles.map((role) => {
          const active = value.includes(role);
          return (
            <Pressable
              key={role}
              onPress={() => onChange(active ? value.filter((item) => item !== role) : [...value, role])}
              style={[styles.roleChip, active && styles.roleChipActive]}
            >
              <Text style={[styles.roleText, active && styles.roleTextActive]}>{role}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: 8
  },
  form: {
    gap: spacing.md
  },
  sectionLabel: {
    color: colors.accent,
    fontFamily: fonts.monoBold,
    fontSize: 12,
    textTransform: "uppercase"
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm
  },
  field: {
    flex: 1,
    gap: spacing.sm
  },
  label: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 11,
    textTransform: "uppercase"
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    backgroundColor: colors.surface2,
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.medium,
    fontSize: 14
  },
  textarea: {
    minHeight: 112,
    paddingTop: spacing.md,
    textAlignVertical: "top"
  },
  segmented: {
    flexDirection: "row",
    gap: spacing.sm
  },
  segment: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    paddingHorizontal: 6
  },
  segmentActive: {
    borderColor: "rgba(42,171,238,0.55)",
    backgroundColor: colors.accentSoft
  },
  segmentText: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 12
  },
  segmentTextActive: {
    color: colors.text
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1
  },
  roleChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: "rgba(42,171,238,0.55)"
  },
  roleText: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 12
  },
  roleTextActive: {
    color: colors.text
  },
  error: {
    color: colors.dislike,
    fontFamily: fonts.bold
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.warnSoft
  },
  badgeText: {
    color: colors.warn,
    fontFamily: fonts.monoBold
  },
  summaryCard: {
    gap: spacing.md
  },
  description: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surface2
  },
  tagText: {
    color: colors.textDim,
    fontFamily: fonts.bold,
    fontSize: 12
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 17
  },
  sectionCount: {
    color: colors.textMuted,
    fontFamily: fonts.monoBold,
    fontSize: 12
  },
  emptyBox: {
    gap: spacing.sm
  },
  application: {
    gap: spacing.md
  },
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  playerName: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 16
  },
  playerMeta: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 3
  },
  message: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  status: {
    fontFamily: fonts.monoBold,
    fontSize: 11,
    textTransform: "uppercase"
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm
  }
});
