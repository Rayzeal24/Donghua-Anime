import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tLegal = await getTranslations("legal");
  const tNav = await getTranslations("nav");

  return (
    <footer className="border-t border-white/[0.04] bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-gradient text-lg font-bold tracking-tight">DonghuaStream</p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground/70">
              {t("legalNotice")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2.5">
              <FooterLink href={`/${locale}`}>{tNav("home")}</FooterLink>
              <FooterLink href={`/${locale}/catalogue`}>{tNav("catalogue")}</FooterLink>
              <FooterLink href={`/${locale}/search`}>{tNav("search")}</FooterLink>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
              Legal
            </h4>
            <nav className="flex flex-col gap-2.5">
              <FooterLink href={`/${locale}/legal/mentions`}>{tLegal("mentions")}</FooterLink>
              <FooterLink href={`/${locale}/legal/terms`}>{tLegal("terms")}</FooterLink>
              <FooterLink href={`/${locale}/legal/privacy`}>{tLegal("privacy")}</FooterLink>
              <FooterLink href={`/${locale}/legal/contact`}>{tLegal("contact")}</FooterLink>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
              Compte
            </h4>
            <nav className="flex flex-col gap-2.5">
              <FooterLink href={`/${locale}/auth/login`}>{tNav("login")}</FooterLink>
              <FooterLink href={`/${locale}/auth/register`}>{tNav("register")}</FooterLink>
              <FooterLink href={`/${locale}/library`}>{tNav("library")}</FooterLink>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/[0.04] pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} DonghuaStream. {t("rights")}.
          </p>
          <p className="text-xs text-muted-foreground/40">
            {tLegal("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground/60 transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}
