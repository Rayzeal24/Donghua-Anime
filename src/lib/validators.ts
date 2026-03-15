import { z } from "zod";

const BANNED_WORDS = [
  "admin", "administrator", "moderator", "support", "donghuastream",
  "putain", "merde", "connard", "salope", "enculé", "nique", "batard",
  "fuck", "shit", "bitch", "asshole", "dick", "pussy", "nigger", "faggot",
  "nazi", "hitler", "porn", "sex", "hentai",
];

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

function containsBannedWord(value: string): boolean {
  const lower = value.toLowerCase().replace(/[_\-.\s]/g, "");
  return BANNED_WORDS.some((word) => lower.includes(word));
}

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "3 caractères minimum")
    .max(20, "20 caractères maximum")
    .regex(USERNAME_REGEX, "Lettres, chiffres, tirets et underscores uniquement")
    .refine((val) => !containsBannedWord(val), {
      message: "Ce nom d'utilisateur n'est pas autorisé",
    }),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "8 caractères minimum")
    .max(64, "64 caractères maximum")
    .regex(/[A-Z]/, "Au moins une lettre majuscule requise")
    .regex(/[a-z]/, "Au moins une lettre minuscule requise")
    .regex(/[0-9]/, "Au moins un chiffre requis")
    .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial requis (!@#$%...)"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const contentSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  titleAlt: z.string().optional(),
  slug: z.string().min(1, "Slug requis"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  bannerImage: z.string().optional(),
  type: z.enum(["DONGHUA", "ANIME", "FILM", "OVA", "ONA"]),
  status: z.enum(["ONGOING", "COMPLETED", "UPCOMING"]),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  totalEpisodes: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  genreIds: z.array(z.string()).default([]),
});

export const episodeSchema = z.object({
  number: z.coerce.number().int().min(1),
  title: z.string().optional(),
  odyseeUrl: z.string().min(1, "URL Odysee requise"),
  thumbnail: z.string().optional(),
  duration: z.coerce.number().int().min(0).optional(),
});

export const profileSchema = z.object({
  name: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContentInput = z.infer<typeof contentSchema>;
export type EpisodeInput = z.infer<typeof episodeSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
