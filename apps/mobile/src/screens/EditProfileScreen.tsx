import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { PrivateProfileDto } from "@party-up/domain";
import type { PartyUpApi } from "../api/types";
import { Button, Muted, StateView, Title } from "../components/Primitives";
import { colors, radius, spacing } from "../design/tokens";
import { useAsync } from "../state/useAsync";

export function EditProfileScreen({
  api,
  onClose,
  requireProfile = false
}: {
  api: PartyUpApi;
  onClose: () => void;
  requireProfile?: boolean;
}) {
  const load = useCallback(() => api.getMe(), [api]);
  const { state, reload } = useAsync(load);

  if (state.status === "loading" || state.status === "empty" || state.status === "error") {
    if (state.status === "error") {
      return <CreateForm api={api} onClose={onClose} requireProfile={requireProfile} />;
    }

    return (
      <View style={styles.root}>
        <StateView state={state.status} onRetry={reload} />
      </View>
    );
  }

  return <EditForm data={state.data} api={api} onClose={onClose} />;
}

function CreateForm({ api, onClose, requireProfile }: { api: PartyUpApi; onClose: () => void; requireProfile: boolean }) {
  const [nickname, setNickname] = useState("new_player");
  const [displayName, setDisplayName] = useState("Новый игрок");
  const [age, setAge] = useState("21");
  const [elo, setElo] = useState("1200");
  const [bio, setBio] = useState("Ищу стабильное пати для CS2, играю спокойно и с микрофоном.");
  const [availability, setAvailability] = useState("Вечером · 19-23");
  const [openToOrganizations, setOpenToOrganizations] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setSaving(true);
    setError(null);
    try {
      await api.createProfile({
        nickname,
        displayName,
        age: Number(age),
        region: "EU West",
        bio,
        languages: ["RU", "EN"],
        contacts: [],
        openToOrganizations,
        gameProfile: {
          role: "Rifler",
          elo: Number(elo),
          peakElo: null,
          maps: ["Mirage", "Inferno"],
          availability,
          hasMic: true,
          hours: null
        }
      });
      onClose();
    } catch {
      setError("Не удалось создать анкету. Проверь nickname, возраст и ELO.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Title>Создать анкету</Title>
        <Muted>Минимальный профиль нужен, чтобы показываться в discovery и получать мэтчи.</Muted>
        <Field label="Nickname" value={nickname} onChangeText={setNickname} />
        <Field label="Имя" value={displayName} onChangeText={setDisplayName} />
        <Field label="Возраст" value={age} onChangeText={setAge} />
        <Field label="ELO" value={elo} onChangeText={setElo} />
        <Field label="О себе" value={bio} onChangeText={setBio} multiline />
        <Field label="Когда играешь" value={availability} onChangeText={setAvailability} />
        <ToggleRow
          value={openToOrganizations}
          onChange={setOpenToOrganizations}
          title="Показывать организациям"
          body="Миксы, стаки и команды смогут найти твою анкету и оценить заявку."
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {requireProfile ? <Button onPress={create}>{saving ? "Создаём" : "Создать"}</Button> : null}
      </ScrollView>
      {requireProfile ? null : (
        <View style={styles.footer}>
          <Button tone="ghost" onPress={onClose}>Позже</Button>
          <Button onPress={create}>{saving ? "Создаём" : "Создать"}</Button>
        </View>
      )}
    </View>
  );
}

function EditForm({ data, api, onClose }: { data: PrivateProfileDto; api: PartyUpApi; onClose: () => void }) {
  const [displayName, setDisplayName] = useState(data.profile.displayName);
  const [bio, setBio] = useState(data.profile.bio);
  const [availability, setAvailability] = useState(data.profile.gameProfile.availability);
  const [openToOrganizations, setOpenToOrganizations] = useState(data.profile.openToOrganizations);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await api.updateProfile({
        displayName,
        bio,
        openToOrganizations,
        gameProfile: { availability }
      });
      onClose();
    } catch {
      setError("Не удалось сохранить анкету.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Title>Редактировать</Title>
        <Muted>Изменения проходят через typed profile contract и затем будут сохраняться через API.</Muted>
        <Field label="Имя" value={displayName} onChangeText={setDisplayName} />
        <Field label="О себе" value={bio} onChangeText={setBio} multiline />
        <Field label="Когда играешь" value={availability} onChangeText={setAvailability} />
        <ToggleRow
          value={openToOrganizations}
          onChange={setOpenToOrganizations}
          title="Показывать организациям"
          body="Если выключить, профиль не должен попадать в рекрутерские сценарии."
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        <Button tone="ghost" onPress={onClose}>Отмена</Button>
        <Button onPress={save}>{saving ? "Сохраняем" : "Сохранить"}</Button>
      </View>
    </View>
  );
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
        style={[styles.input, multiline && styles.textarea]}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

function ToggleRow({
  value,
  onChange,
  title,
  body
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  title: string;
  body: string;
}) {
  return (
    <Pressable style={styles.toggleRow} onPress={() => onChange(!value)}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleBody}>{body}</Text>
      </View>
      <View style={[styles.switchTrack, value && styles.switchTrackOn]}>
        <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    backgroundColor: colors.bg
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
    gap: spacing.lg
  },
  field: {
    gap: spacing.sm
  },
  label: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontWeight: "600"
  },
  textarea: {
    minHeight: 120,
    paddingTop: spacing.md,
    textAlignVertical: "top"
  },
  error: {
    color: colors.dislike,
    fontWeight: "700"
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md
  },
  toggleCopy: {
    flex: 1,
    gap: 4
  },
  toggleTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 14
  },
  toggleBody: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600"
  },
  switchTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface2,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    padding: 3
  },
  switchTrackOn: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textMuted
  },
  switchThumbOn: {
    transform: [{ translateX: 18 }],
    backgroundColor: colors.accent
  },
  footer: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: "row",
    gap: spacing.md
  }
});
