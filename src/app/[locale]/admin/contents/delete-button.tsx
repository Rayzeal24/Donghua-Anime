"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteContentButton({ contentId }: { contentId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Supprimer ce contenu ?")) return;
    setLoading(true);
    await fetch(`/api/admin/contents/${contentId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
