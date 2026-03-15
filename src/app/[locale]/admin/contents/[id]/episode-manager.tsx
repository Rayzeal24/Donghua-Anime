"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, X, Check, Link as LinkIcon, AlertTriangle } from "lucide-react";
import type { Episode } from "@prisma/client";

interface EpisodeManagerProps {
  contentId: string;
  initialEpisodes: Episode[];
}

export function EpisodeManager({ contentId, initialEpisodes }: EpisodeManagerProps) {
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState((episodes.length + 1).toString());
  const [odyseeUrl, setOdyseeUrl] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Episode | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!deleteTarget) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteTarget(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [deleteTarget]);

  const addEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/contents/${contentId}/episodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: parseInt(number),
        odyseeUrl,
      }),
    });

    if (res.ok) {
      const ep = await res.json();
      setEpisodes([...episodes, ep].sort((a, b) => a.number - b.number));
      setNumber((episodes.length + 2).toString());
      setOdyseeUrl("");
      setDuration("");
      setShowForm(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Erreur lors de l'ajout");
    }
    setLoading(false);
  };

  const startEdit = (ep: Episode) => {
    setEditingId(ep.id);
    setEditNumber(ep.number.toString());
    setEditUrl(ep.odyseeUrl);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError("");
  };

  const saveEdit = async (epId: string) => {
    setEditLoading(true);
    setError("");

    const res = await fetch(`/api/admin/episodes/${epId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: parseInt(editNumber),
        odyseeUrl: editUrl,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setEpisodes(
        episodes.map((ep) => (ep.id === epId ? updated : ep)).sort((a, b) => a.number - b.number)
      );
      setEditingId(null);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Erreur lors de la modification");
    }
    setEditLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    const res = await fetch(`/api/admin/episodes/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setEpisodes(episodes.filter((e) => e.id !== deleteTarget.id));
      router.refresh();
    }
    setDeleteTarget(null);
    setDeleteLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Épisodes
          <span className="ml-2 text-sm font-normal text-muted-foreground">({episodes.length})</span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="gap-2"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Fermer" : "Ajouter"}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addEpisode} className="space-y-3 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
          <p className="text-sm font-medium text-primary">Nouvel épisode</p>
          <Input id="ep-number" label="Numéro" type="number" value={number} onChange={(e) => setNumber(e.target.value)} required />
          <Input id="ep-url" label="URL Odysee" value={odyseeUrl} onChange={(e) => setOdyseeUrl(e.target.value)} required placeholder="https://odysee.com/..." />
          <div className="flex gap-2">
            <Button type="submit" loading={loading} size="sm">Ajouter</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Annuler</Button>
          </div>
        </form>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Episode list */}
      <div className="space-y-1">
        {episodes.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun épisode ajouté</p>
        )}

        {episodes.map((ep) =>
          editingId === ep.id ? (
            /* Inline edit mode */
            <div key={ep.id} className="rounded-xl border border-primary/30 bg-primary/[0.03] p-3 space-y-3">
              <p className="text-xs font-medium text-primary">Modification de l&apos;épisode {ep.number}</p>
              <Input
                id={`edit-num-${ep.id}`}
                label="N°"
                type="number"
                value={editNumber}
                onChange={(e) => setEditNumber(e.target.value)}
                required
              />
              <Input
                id={`edit-url-${ep.id}`}
                label="URL Odysee"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="gap-1.5"
                  loading={editLoading}
                  onClick={() => saveEdit(ep.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Enregistrer
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit} className="gap-1.5">
                  <X className="h-3.5 w-3.5" />
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            /* Display mode */
            <div
              key={ep.id}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-secondary/40"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
                {ep.number}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  Épisode {ep.number}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                  <LinkIcon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{ep.odyseeUrl}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => startEdit(ep)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  title="Modifier"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(ep)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div
            ref={modalRef}
            className="relative w-full max-w-sm animate-in fade-in zoom-in-95 rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">Supprimer l&apos;épisode</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Supprimer l&apos;épisode {deleteTarget.number} ?
                <br />
                <span className="text-xs">Cette action est irréversible.</span>
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={confirmDelete}
                loading={deleteLoading}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
