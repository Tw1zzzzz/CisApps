import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Muted, Surface } from "../components/Primitives";
import { Icon } from "../components/Icon";
import { colors, fonts, radius, spacing } from "../design/tokens";
import type { PartyUpAuthApi } from "../api/types";

type AuthStep = "email" | "otp";

export function OnboardingScreen({
  authApi,
  onAuthenticated
}: {
  authApi: PartyUpAuthApi;
  onAuthenticated: (token: string) => void;
}) {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("demo@partyup.local");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const canSubmitEmail = normalizedEmail.includes("@") && normalizedEmail.includes(".");
  const canSubmitOtp = /^\d{6}$/.test(otp);

  async function requestOtp() {
    if (!canSubmitEmail) {
      setMessage("Введите рабочий email.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      const response = await authApi.requestOtp(normalizedEmail);
      setDevOtp(response.devOtp ?? null);
      setOtp(response.devOtp ?? "");
      setStep("otp");
    } catch {
      setMessage("Не удалось отправить код. Проверь API и повтори запрос.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp() {
    if (!canSubmitOtp) {
      setMessage("Код должен состоять из 6 цифр.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      const response = await authApi.verifyOtp(normalizedEmail, otp);
      onAuthenticated(response.token);
    } catch {
      setMessage("Код не подошёл или истёк. Запроси новый код.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Icon name="crosshair" size={32} stroke={2.2} color="#fff" />
          </View>
          <Text style={styles.title}>PARTY UP</Text>
          <Muted>Находи CS2-тиммейтов по роли, ELO, картам, языкам и времени игры.</Muted>
        </View>

        <Surface style={styles.card}>
          <Text style={styles.cardTitle}>{step === "email" ? "Вход по email" : "Проверь код"}</Text>
          {step === "email" ? (
            <>
              <Muted>Для MVP используем OTP-контракт API. Приватные контакты и профиль доступны только после входа.</Muted>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="email@example.com"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </>
          ) : (
            <>
              <Muted>Код отправлен на {normalizedEmail}. В local/dev окружении API возвращает одноразовый код для проверки.</Muted>
              {devOtp ? <Text style={styles.devCode}>DEV OTP: {devOtp}</Text> : null}
              <TextInput
                value={otp}
                onChangeText={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
                keyboardType="number-pad"
                placeholder="000000"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.otpInput]}
                maxLength={6}
              />
            </>
          )}
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </Surface>

        <View style={styles.actions}>
          {step === "otp" ? (
            <Button onPress={() => setStep("email")} tone="ghost">
              Изменить email
            </Button>
          ) : null}
          <Button onPress={step === "email" ? requestOtp : verifyOtp}>
            {isSubmitting ? "Проверяем..." : step === "email" ? "Получить код" : "Войти"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg
  },
  keyboard: {
    flex: 1,
    justifyContent: "space-between"
  },
  hero: {
    gap: spacing.lg,
    paddingTop: 72
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 44,
    letterSpacing: 0
  },
  card: {
    gap: spacing.sm
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    backgroundColor: colors.surface2,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.medium,
    fontSize: 15
  },
  otpInput: {
    fontFamily: fonts.monoBold,
    fontSize: 22,
    letterSpacing: 0,
    textAlign: "center"
  },
  devCode: {
    color: colors.warn,
    fontFamily: fonts.monoBold,
    fontSize: 12
  },
  message: {
    color: colors.warn,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18
  },
  actions: {
    gap: spacing.sm
  }
});
