"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Send, CheckCircle, ArrowLeft, Mail } from "lucide-react";

const SUBJECTS = [
  "Question générale",
  "Demande de retrait de contenu",
  "Signalement de bug",
  "Suggestion",
  "Autre",
];

export default function ContactPage() {
  const t = useTranslations("legal");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi du message.");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center">
          {/* Success illustration */}
          <div className="relative mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-500/10">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-card ring-2 ring-emerald-500/30">
              <Mail className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-foreground">
            Message envoyé !
          </h2>
          <p className="mb-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Votre message a bien été transmis à notre équipe. Nous vous répondrons dans les
            plus brefs délais à l&apos;adresse indiquée.
          </p>
          <p className="mb-8 text-xs text-muted-foreground/50">
            Délai de réponse habituel : 24 à 48 heures
          </p>

          <Button
            variant="outline"
            onClick={() => {
              setStatus("idle");
              setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Envoyer un autre message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("contact")}</h1>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-6 text-sm text-muted-foreground">
          Pour toute question, demande de retrait de contenu ou signalement, remplissez
          le formulaire ci-dessous. Nous vous répondrons dans les meilleurs délais.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="contact-name"
            label="Nom"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Votre nom"
          />
          <Input
            id="contact-email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="votre@email.com"
          />
          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground/90">
              Sujet
            </label>
            <select
              id="contact-subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-white/[0.06] bg-background px-3.5 py-2 text-sm text-foreground transition-all duration-200 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="block text-sm font-medium text-foreground/90">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Décrivez votre demande..."
              className="w-full rounded-xl border border-white/[0.06] bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {status === "error" && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMsg}
            </div>
          )}

          <Button type="submit" loading={status === "loading"} className="w-full">
            <Send className="h-4 w-4" />
            {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
