import type { Content, Episode, Genre, ContentType, ContentStatus } from "@prisma/client";

export type ContentWithRelations = Content & {
  genres: { genre: Genre }[];
  episodes: Episode[];
  _count?: { favorites: number; watchHistory: number };
};

export type ContentCardData = {
  id: string;
  slug: string;
  title: string;
  titleAlt: string | null;
  coverImage: string | null;
  type: ContentType;
  status: ContentStatus;
  year: number | null;
  totalEpisodes: number | null;
  genres: { genre: { name: string; slug: string } }[];
  episodes: { id: string }[];
};

export type EpisodeWithContent = Episode & {
  content: Content;
};

export type SearchResult = {
  id: string;
  slug: string;
  title: string;
  titleAlt: string | null;
  coverImage: string | null;
  type: ContentType;
  year: number | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
