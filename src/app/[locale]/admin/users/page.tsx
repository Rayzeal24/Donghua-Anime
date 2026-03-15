import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./user-actions";

const ROLE_BADGE: Record<string, { variant: "default" | "secondary"; label: string }> = {
  ADMIN: { variant: "default", label: "Admin" },
  MODERATOR: { variant: "default", label: "Modérateur" },
  CONTENT_MANAGER: { variant: "default", label: "Gestionnaire" },
  USER: { variant: "secondary", label: "Utilisateur" },
};

export default async function AdminUsersPage() {
  const session = await auth();
  const caller = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true },
  });
  const callerRole = caller?.role || "USER";

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
      _count: { select: { favorites: true, watchHistory: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Utilisateur</th>
              <th className="px-4 py-3 text-left font-medium">Rôle</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-center font-medium">Fav.</th>
              <th className="px-4 py-3 text-center font-medium">Vues</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const badge = ROLE_BADGE[u.role] || ROLE_BADGE.USER;
              return (
                <tr key={u.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={badge.variant} className={
                      u.role === "MODERATOR" ? "border-blue-500/30 bg-blue-500/20 text-blue-400" :
                      u.role === "CONTENT_MANAGER" ? "border-amber-500/30 bg-amber-500/20 text-amber-400" :
                      ""
                    }>
                      {badge.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {u.banned ? (
                      <Badge variant="warning">Banni</Badge>
                    ) : (
                      <Badge variant="success">Actif</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{u._count.favorites}</td>
                  <td className="px-4 py-3 text-center">{u._count.watchHistory}</td>
                  <td className="px-4 py-3">
                    <UserActions userId={u.id} banned={u.banned} role={u.role} callerRole={callerRole} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
