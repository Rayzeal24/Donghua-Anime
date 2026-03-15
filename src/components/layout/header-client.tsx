"use client";

import Link from "next/link";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface HeaderClientProps {
  user: { name?: string | null; email: string; role: string; avatar?: string | null } | null;
  locale: string;
  loginLabel: string;
}

export function HeaderClient({ user, locale, loginLabel }: HeaderClientProps) {
  if (user) {
    return <UserMenu user={user} />;
  }

  return (
    <Link href={`/${locale}/auth/login`} className="hidden sm:block">
      <Button variant="primary" size="sm" className="gap-2 glow-sm">
        <LogIn className="h-3.5 w-3.5" />
        {loginLabel}
      </Button>
    </Link>
  );
}
