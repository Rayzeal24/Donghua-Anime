"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordRule {
  label: string;
  test: (v: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "8 caractères minimum", test: (v) => v.length >= 8 },
  { label: "Une lettre majuscule", test: (v) => /[A-Z]/.test(v) },
  { label: "Une lettre minuscule", test: (v) => /[a-z]/.test(v) },
  { label: "Un chiffre", test: (v) => /[0-9]/.test(v) },
  { label: "Un caractère spécial (!@#$%...)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function PasswordStrength({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const ratio = password.length > 0 ? passed / PASSWORD_RULES.length : 0;

  const color =
    ratio <= 0.4 ? "bg-red-500" : ratio <= 0.7 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-2">
      {password.length > 0 && (
        <div className="flex gap-1">
          {Array.from({ length: PASSWORD_RULES.length }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i < passed ? color : "bg-white/10"}`}
            />
          ))}
        </div>
      )}
      <ul className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.label}
              className={`flex items-center gap-2 text-xs transition-colors ${
                password.length === 0
                  ? "text-muted-foreground/50"
                  : ok
                    ? "text-emerald-400"
                    : "text-muted-foreground"
              }`}
            >
              {password.length > 0 ? (
                ok ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )
              ) : (
                <span className="h-3 w-3 rounded-full border border-white/10" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth.register");

  const passwordsMatch = form.password === form.confirmPassword;
  const allPasswordRulesOk = useMemo(
    () => PASSWORD_RULES.every((r) => r.test(form.password)),
    [form.password]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (!allPasswordRulesOk) {
      setError("Le mot de passe ne respecte pas toutes les exigences");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch {
      setError("Erreur réseau");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          id="name"
          name="name"
          type="text"
          label={t("name")}
          required
          minLength={3}
          maxLength={20}
          pattern="^[a-zA-Z0-9_-]+$"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="ex: KiritoFan_42"
        />
        <p className="mt-1 text-xs text-muted-foreground/50">
          3-20 caractères, lettres, chiffres, tirets et underscores
        </p>
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        label={t("email")}
        required
        autoComplete="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="votre@email.com"
      />

      <div>
        <Input
          id="password"
          name="password"
          type="password"
          label={t("password")}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="mt-2">
          <PasswordStrength password={form.password} />
        </div>
      </div>

      <div>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label={t("confirmPassword")}
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={
            form.confirmPassword.length > 0 && !passwordsMatch
              ? "Les mots de passe ne correspondent pas"
              : undefined
          }
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        disabled={!allPasswordRulesOk || !passwordsMatch || form.name.length < 3}
        className="w-full"
      >
        {t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href={`/${locale}/auth/login`} className="text-primary hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
