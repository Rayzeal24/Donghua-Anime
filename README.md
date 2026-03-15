# DonghuaStream

Plateforme de streaming donghua/animé personnelle, moderne et rapide. Interface en français, multilingue (FR/EN/ZH), avec panel admin intégré.

## Stack technique

- **Next.js 16** (App Router, Server Components, Turbopack)
- **TypeScript** strict
- **Tailwind CSS v4** (dark mode)
- **Prisma 6** + **Neon PostgreSQL** (serverless)
- **Auth.js v5** (email/password, JWT, rôles)
- **next-intl** (i18n : français, anglais, chinois)
- **Zustand** (état client)
- **Zod** (validation)

## Fonctionnalités

- Catalogue de donghua/animé avec filtres, recherche, pagination
- Lecteur vidéo via embeds Odysee (légal, iframe)
- Authentification email/mot de passe
- Bibliothèque utilisateur : favoris, historique, reprise de lecture
- Panel admin : CRUD contenus, gestion épisodes, gestion utilisateurs, bannissement
- Multilingue (FR/EN/ZH) avec sélecteur de langue
- Design sombre, moderne, responsive
- Pages légales (mentions, CGU, confidentialité, contact)

## Prérequis

- Node.js 18+
- Un compte [Neon](https://neon.tech) (gratuit) pour PostgreSQL

## Installation

```bash
# Cloner le projet
cd donghua-stream

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env
```

## Configuration

Éditer le fichier `.env` :

```env
# Neon PostgreSQL - obtenir l'URL depuis https://console.neon.tech
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/donghua?sslmode=require"

# Auth.js - générer avec : npx auth secret
AUTH_SECRET="votre-secret-de-32-caracteres-minimum"

# URL du site
AUTH_URL="http://localhost:3000"
```

### Configurer Neon PostgreSQL

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet (nom : "donghua")
3. Copier la connection string dans `DATABASE_URL`

## Base de données

```bash
# Pousser le schéma vers Neon
npx prisma db push

# Générer le client Prisma
npx prisma generate

# Peupler avec les données d'exemple (6 donghua + utilisateurs)
npx tsx prisma/seed.ts

# Visualiser la base (optionnel)
npx prisma studio
```

### Comptes par défaut (seed)

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@donghua-stream.com | admin123 | ADMIN |
| demo@donghua-stream.com | user123 | USER |

## Développement

```bash
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000) (redirigé vers `/fr`).

## Build production

```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── app/
│   ├── [locale]/          # Pages avec i18n
│   │   ├── page.tsx       # Accueil
│   │   ├── catalogue/     # Catalogue avec filtres
│   │   ├── content/[slug] # Détail contenu
│   │   ├── watch/[id]     # Lecteur vidéo
│   │   ├── auth/          # Login / Register
│   │   ├── library/       # Bibliothèque (connecté)
│   │   ├── profile/       # Profil utilisateur
│   │   ├── admin/         # Panel admin (ADMIN only)
│   │   ├── legal/         # Pages légales
│   │   └── search/        # Recherche
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Design system
│   ├── layout/            # Header, Footer
│   ├── content/           # Cartes, grilles, filtres
│   ├── player/            # Lecteur Odysee
│   └── auth/              # Formulaires auth
├── lib/                   # Prisma, auth, utilitaires
├── stores/                # Zustand stores
├── i18n/                  # Configuration i18n
└── types/                 # Types TypeScript
```

## Déploiement Vercel

1. Pousser le code sur GitHub
2. Importer le projet sur [vercel.com](https://vercel.com)
3. Ajouter les variables d'environnement :
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` (URL de production)
4. Déployer

Le `postinstall` script génère automatiquement le client Prisma.

## Mentions légales

Cette plateforme ne diffuse que des contenus légalement intégrables via Odysee.
Aucun fichier vidéo n'est stocké sur les serveurs de DonghuaStream.

## Licence

Projet personnel - Tous droits réservés.
