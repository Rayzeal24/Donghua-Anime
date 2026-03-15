"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Ban, Trash2, ShieldCheck, Database, ShieldOff } from "lucide-react";

interface UserActionsProps {
  userId: string;
  banned: boolean;
  role: string;
  callerRole: string;
}

const ROLE_LABELS: Record<string, string> = {
  USER: "Utilisateur",
  MODERATOR: "Modérateur",
  CONTENT_MANAGER: "Gestionnaire",
  ADMIN: "Admin",
};

export function UserActions({ userId, banned, role, callerRole }: UserActionsProps) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const router = useRouter();

  const doAction = async (actionType: string) => {
    setLoading(true);
    setConfirm(null);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: actionType }),
    });
    router.refresh();
    setLoading(false);
  };

  const handleClick = (actionType: string) => {
    if (actionType === "delete") {
      if (confirm === "delete") {
        doAction("delete");
      } else {
        setConfirm("delete");
        setTimeout(() => setConfirm(null), 3000);
      }
      return;
    }
    doAction(actionType);
  };

  const isAdmin = callerRole === "ADMIN";
  const isMod = callerRole === "MODERATOR";
  const canBan = isAdmin || isMod;
  const isTargetAdmin = role === "ADMIN";

  return (
    <div className="flex flex-wrap justify-end gap-1">
      {/* Ban / Unban */}
      {canBan && !isTargetAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleClick(banned ? "unban" : "ban")}
          disabled={loading}
          className="gap-1 text-xs"
        >
          <Ban className="h-3.5 w-3.5" />
          {banned ? "Débannir" : "Bannir"}
        </Button>
      )}

      {/* Role management (admin only) */}
      {isAdmin && !isTargetAdmin && (
        <>
          {role === "USER" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClick("makeModerator")}
                disabled={loading}
                className="gap-1 text-xs text-blue-400 hover:text-blue-300"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Modo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClick("makeContentManager")}
                disabled={loading}
                className="gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                <Database className="h-3.5 w-3.5" />
                Gestionnaire
              </Button>
            </>
          )}
          {(role === "MODERATOR" || role === "CONTENT_MANAGER") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClick("removeRole")}
              disabled={loading}
              className="gap-1 text-xs text-muted-foreground"
            >
              <ShieldOff className="h-3.5 w-3.5" />
              Retirer rôle
            </Button>
          )}
        </>
      )}

      {/* Delete (admin only) */}
      {isAdmin && !isTargetAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleClick("delete")}
          disabled={loading}
          className={`gap-1 text-xs ${confirm === "delete" ? "text-destructive bg-destructive/10" : "text-destructive/60 hover:text-destructive"}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {confirm === "delete" ? "Confirmer ?" : "Supprimer"}
        </Button>
      )}
    </div>
  );
}
