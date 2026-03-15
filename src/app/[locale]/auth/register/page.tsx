import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/components/auth/register-form";
import { Sparkles } from "lucide-react";

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center px-4 py-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse-glow absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            DonghuaStream
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-card/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
