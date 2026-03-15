import { PrismaClient, ContentType, ContentStatus, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const genres = await Promise.all(
    [
      { name: "Action", slug: "action" },
      { name: "Aventure", slug: "aventure" },
      { name: "Fantasy", slug: "fantasy" },
      { name: "Romance", slug: "romance" },
      { name: "Comédie", slug: "comedie" },
      { name: "Drame", slug: "drame" },
      { name: "Sci-Fi", slug: "sci-fi" },
      { name: "Martial Arts", slug: "martial-arts" },
      { name: "Cultivation", slug: "cultivation" },
      { name: "Isekai", slug: "isekai" },
      { name: "Mystère", slug: "mystere" },
      { name: "Horreur", slug: "horreur" },
    ].map((g) =>
      prisma.genre.upsert({ where: { slug: g.slug }, update: {}, create: g })
    )
  );

  const genreMap = Object.fromEntries(genres.map((g) => [g.slug, g.id]));

  const adminPassword = await hash("Admin@2026", 12);
  await prisma.user.upsert({
    where: { email: "admin@donghua-stream.com" },
    update: { hashedPassword: adminPassword, role: Role.ADMIN },
    create: {
      email: "admin@donghua-stream.com",
      name: "Admin",
      hashedPassword: adminPassword,
      role: Role.ADMIN,
      locale: "fr",
    },
  });

  const userPassword = await hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "demo@donghua-stream.com" },
    update: {},
    create: {
      email: "demo@donghua-stream.com",
      name: "DemoUser",
      hashedPassword: userPassword,
      role: Role.USER,
      locale: "fr",
    },
  });

  const contents = [
    {
      slug: "soul-land",
      title: "Soul Land (Douluo Dalu)",
      titleAlt: "斗罗大陆",
      description:
        "Tang San, un maître d'arts martiaux, se réincarne dans le monde de Soul Land où il cherche à devenir le plus puissant Spirit Master. Une aventure épique mêlant cultivation et combats stratégiques.",
      coverImage: "https://cdn.myanimelist.net/images/anime/1223/117818l.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/124026-KEQK5MMAbu4M.jpg",
      type: ContentType.DONGHUA,
      status: ContentStatus.ONGOING,
      year: 2018,
      totalEpisodes: 260,
      featured: true,
      genres: ["action", "aventure", "fantasy", "cultivation"],
      episodes: [
        { number: 1, title: "Le début du voyage", odyseeUrl: "https://odysee.com/@DonghuaFR:a/soul-land-ep1:b", duration: 1200 },
        { number: 2, title: "Le village de la forge", odyseeUrl: "https://odysee.com/@DonghuaFR:a/soul-land-ep2:c", duration: 1200 },
        { number: 3, title: "L'éveil du marteau", odyseeUrl: "https://odysee.com/@DonghuaFR:a/soul-land-ep3:d", duration: 1200 },
      ],
    },
    {
      slug: "battle-through-the-heavens",
      title: "Battle Through the Heavens",
      titleAlt: "斗破苍穹",
      description:
        "Xiao Yan, un jeune prodige déchu, cherche à retrouver sa puissance perdue et à venger sa famille. Un voyage épique à travers un monde de cultivation et de flammes mystiques.",
      coverImage: "https://cdn.myanimelist.net/images/anime/7/86807l.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/98149-fRMVETD3cJfg.jpg",
      type: ContentType.DONGHUA,
      status: ContentStatus.ONGOING,
      year: 2017,
      totalEpisodes: 156,
      featured: true,
      genres: ["action", "fantasy", "cultivation", "aventure"],
      episodes: [
        { number: 1, title: "Le génie déchu", odyseeUrl: "https://odysee.com/@DonghuaFR:a/btth-ep1:a", duration: 1320 },
        { number: 2, title: "La rencontre", odyseeUrl: "https://odysee.com/@DonghuaFR:a/btth-ep2:b", duration: 1320 },
        { number: 3, title: "Le serment", odyseeUrl: "https://odysee.com/@DonghuaFR:a/btth-ep3:c", duration: 1320 },
      ],
    },
    {
      slug: "stellar-transformations",
      title: "Stellar Transformations",
      titleAlt: "星辰变",
      description:
        "Qin Yu, incapable de pratiquer la cultivation interne, forge son corps et découvre un météore mystérieux qui change son destin.",
      coverImage: "https://cdn.myanimelist.net/images/anime/1396/111498l.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/108774-uWmD0dRrgHkk.jpg",
      type: ContentType.DONGHUA,
      status: ContentStatus.ONGOING,
      year: 2021,
      totalEpisodes: 52,
      featured: false,
      genres: ["action", "fantasy", "cultivation", "sci-fi"],
      episodes: [
        { number: 1, title: "L'enfant des étoiles", odyseeUrl: "https://odysee.com/@DonghuaFR:a/stellar-ep1:a", duration: 1380 },
        { number: 2, title: "Le météore", odyseeUrl: "https://odysee.com/@DonghuaFR:a/stellar-ep2:b", duration: 1380 },
      ],
    },
    {
      slug: "the-daily-life-of-the-immortal-king",
      title: "The Daily Life of the Immortal King",
      titleAlt: "仙王的日常生活",
      description:
        "Wang Ling est un lycéen en apparence ordinaire, mais c'est en réalité un cultivateur surpuissant qui essaie de vivre une vie normale.",
      coverImage: "https://cdn.myanimelist.net/images/anime/1070/111858l.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/114121-XTFZZ3xmbKlT.jpg",
      type: ContentType.DONGHUA,
      status: ContentStatus.COMPLETED,
      year: 2020,
      totalEpisodes: 45,
      featured: true,
      genres: ["comedie", "action", "fantasy"],
      episodes: [
        { number: 1, title: "Le roi immortel au lycée", odyseeUrl: "https://odysee.com/@DonghuaFR:a/immortal-king-ep1:a", duration: 1200 },
        { number: 2, title: "La rivale", odyseeUrl: "https://odysee.com/@DonghuaFR:a/immortal-king-ep2:b", duration: 1200 },
        { number: 3, title: "Le secret révélé", odyseeUrl: "https://odysee.com/@DonghuaFR:a/immortal-king-ep3:c", duration: 1200 },
      ],
    },
    {
      slug: "perfect-world",
      title: "Perfect World",
      titleAlt: "完美世界",
      description:
        "Dans un monde où les êtres puissants peuvent détruire des montagnes, un jeune garçon nommé Shi Hao grandit dans un village reculé avec un destin extraordinaire.",
      coverImage: "https://cdn.myanimelist.net/images/anime/1832/121925l.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/132Mo46s4VZ2H.jpg",
      type: ContentType.DONGHUA,
      status: ContentStatus.ONGOING,
      year: 2021,
      totalEpisodes: 104,
      featured: true,
      genres: ["action", "aventure", "fantasy", "martial-arts"],
      episodes: [
        { number: 1, title: "Le village du désert", odyseeUrl: "https://odysee.com/@DonghuaFR:a/perfect-world-ep1:a", duration: 1260 },
        { number: 2, title: "Le jeune prodige", odyseeUrl: "https://odysee.com/@DonghuaFR:a/perfect-world-ep2:b", duration: 1260 },
      ],
    },
    {
      slug: "a-record-of-a-mortals-journey",
      title: "A Record of a Mortal's Journey to Immortality",
      titleAlt: "凡人修仙传",
      description:
        "Han Li, un mortel ordinaire, entre dans le monde de la cultivation par hasard. Sans talent particulier, il doit compter sur son intelligence et sa persévérance pour survivre.",
      coverImage: "https://cdn.myanimelist.net/images/anime/1539/116605l.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/136120-3sBbvJjVy9Ej.jpg",
      type: ContentType.DONGHUA,
      status: ContentStatus.ONGOING,
      year: 2020,
      totalEpisodes: 60,
      featured: true,
      genres: ["action", "cultivation", "drame", "aventure"],
      episodes: [
        { number: 1, title: "Le mortel", odyseeUrl: "https://odysee.com/@DonghuaFR:a/mortal-ep1:a", duration: 1440 },
        { number: 2, title: "Le chemin de la secte", odyseeUrl: "https://odysee.com/@DonghuaFR:a/mortal-ep2:b", duration: 1440 },
        { number: 3, title: "Le premier combat", odyseeUrl: "https://odysee.com/@DonghuaFR:a/mortal-ep3:c", duration: 1440 },
      ],
    },
  ];

  for (const c of contents) {
    const { genres: genreSlugs, episodes, ...contentData } = c;

    const content = await prisma.content.upsert({
      where: { slug: contentData.slug },
      update: {
        coverImage: contentData.coverImage,
        bannerImage: contentData.bannerImage,
      },
      create: contentData,
    });

    for (const slug of genreSlugs) {
      if (genreMap[slug]) {
        await prisma.contentGenre.upsert({
          where: { contentId_genreId: { contentId: content.id, genreId: genreMap[slug] } },
          update: {},
          create: { contentId: content.id, genreId: genreMap[slug] },
        });
      }
    }

    for (const ep of episodes) {
      await prisma.episode.upsert({
        where: { contentId_number: { contentId: content.id, number: ep.number } },
        update: {},
        create: { ...ep, contentId: content.id },
      });
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
