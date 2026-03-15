"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { Genre, Content } from "@prisma/client";

interface ContentFormProps {
  genres: Genre[];
  content?: Content & { genres: { genreId: string }[] };
}

export function ContentForm({ genres, content }: ContentFormProps) {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState(content?.title || "");
  const [titleAlt, setTitleAlt] = useState(content?.titleAlt || "");
  const [slug, setSlug] = useState(content?.slug || "");
  const [description, setDescription] = useState(content?.description || "");
  const [coverImage, setCoverImage] = useState(content?.coverImage || "");
  const [bannerImage, setBannerImage] = useState(content?.bannerImage || "");
  const [type, setType] = useState<string>(content?.type || "DONGHUA");
  const [status, setStatus] = useState<string>(content?.status || "ONGOING");
  const [year, setYear] = useState(content?.year?.toString() || "");
  const [totalEpisodes, setTotalEpisodes] = useState(content?.totalEpisodes?.toString() || "");
  const [featured, setFeatured] = useState(content?.featured || false);
  const [visible, setVisible] = useState(content?.visible !== false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    content?.genres.map((g) => g.genreId) || []
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!content) setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      title,
      titleAlt: titleAlt || undefined,
      slug,
      description: description || undefined,
      coverImage: coverImage || undefined,
      bannerImage: bannerImage || undefined,
      type,
      status,
      year: year ? parseInt(year) : undefined,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : undefined,
      featured,
      visible,
      genreIds: selectedGenres,
    };

    const url = content ? `/api/admin/contents/${content.id}` : "/api/admin/contents";
    const method = content ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSuccess(true);
      setError("");
      window.location.href = `/${locale}/admin/contents`;
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Erreur lors de la sauvegarde");
      setLoading(false);
    }
  };

  const selectClass =
    "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <Input id="title" label="Titre" value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
      <Input id="titleAlt" label="Titre alternatif" value={titleAlt} onChange={(e) => setTitleAlt(e.target.value)} />
      <Input id="slug" label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <Input id="coverImage" label="Image couverture (URL)" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
      {coverImage && (
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt="Aperçu couverture"
            className="h-32 w-24 rounded-lg border border-border object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="text-xs text-muted-foreground">Aperçu couverture</span>
        </div>
      )}
      <Input id="bannerImage" label="Image bannière (URL)" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} />
      {bannerImage && (
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImage}
            alt="Aperçu bannière"
            className="h-28 w-52 rounded-lg border border-border object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="text-xs text-muted-foreground">Aperçu bannière</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
            <option value="DONGHUA">Donghua</option>
            <option value="ANIME">Anime</option>
            <option value="FILM">Film</option>
            <option value="OVA">OVA</option>
            <option value="ONA">ONA</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="ONGOING">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="UPCOMING">À venir</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="year" label="Année" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        <Input id="totalEpisodes" label="Total épisodes" type="number" value={totalEpisodes} onChange={(e) => setTotalEpisodes(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Genres</label>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <label key={g.id} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={selectedGenres.includes(g.id)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedGenres([...selectedGenres, g.id]);
                  else setSelectedGenres(selectedGenres.filter((id) => id !== g.id));
                }}
                className="rounded"
              />
              {g.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
          À la une
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="rounded" />
          Visible
        </label>
      </div>

      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Sauvegardé avec succès ! Redirection...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} disabled={success}>
        {content ? "Modifier" : "Créer"}
      </Button>
    </form>
  );
}
