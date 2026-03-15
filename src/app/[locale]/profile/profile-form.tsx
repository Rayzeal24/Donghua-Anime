"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Camera, User } from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("profile");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image trop lourde (2 Mo max)");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format non supporté (JPG, PNG, WebP, GIF)");
      return;
    }

    setError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la sauvegarde");
        setLoading(false);
        return;
      }

      setSaved(true);
      setAvatarFile(null);
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const initial = (name || user.email)[0]?.toUpperCase() || "U";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/10 transition-all hover:ring-primary/40"
        >
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-accent/20">
              <span className="text-3xl font-bold text-primary">{initial}</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground/50">
          JPG, PNG, WebP ou GIF — 2 Mo max
        </p>
      </div>

      {/* Name */}
      <div>
        <Input
          id="name"
          label={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={3}
          maxLength={20}
          pattern="^[a-zA-Z0-9_-]+$"
          required
        />
        <p className="mt-1 text-xs text-muted-foreground/50">
          3-20 caractères, lettres, chiffres, tirets et underscores
        </p>
      </div>

      {/* Email (read-only) */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-foreground/90">
          {t("email")}
        </label>
        <div className="flex h-10 w-full items-center rounded-xl border border-white/[0.06] bg-background px-3.5 text-sm text-muted-foreground/50">
          {user.email}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
          <Check className="h-4 w-4" />
          {t("saved")}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Enregistrer
      </Button>
    </form>
  );
}
