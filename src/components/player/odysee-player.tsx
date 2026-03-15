"use client";

import { useState } from "react";
import { getOdyseeEmbedUrl } from "@/lib/utils";
import { ExternalLink, AlertCircle, RefreshCw } from "lucide-react";

interface OdyseePlayerProps {
  odyseeUrl: string;
  title?: string;
}

export function OdyseePlayer({ odyseeUrl, title }: OdyseePlayerProps) {
  const embedUrl = getOdyseeEmbedUrl(odyseeUrl);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {status !== "error" && (
        <iframe
          src={embedUrl}
          title={title || "Video player"}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-popups-to-escape-sandbox"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}

      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-primary" />
          <p className="text-sm text-white/50">Chargement du lecteur...</p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/95 px-6 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-white/80">
              Le lecteur intégré n&apos;a pas pu se charger
            </p>
            <p className="mt-1 text-xs text-white/40">
              Odysee peut bloquer l&apos;intégration en développement local
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus("loading")}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </button>
            <a
              href={odyseeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir sur Odysee
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
