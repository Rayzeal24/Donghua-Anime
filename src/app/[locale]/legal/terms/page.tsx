import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("terms")}</h1>
      <p className="mb-10 text-sm text-muted-foreground/60">
        Dernière mise à jour : 15 mars 2026
      </p>
      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptation des conditions</h2>
          <p>
            L&apos;accès et l&apos;utilisation du site <strong className="text-foreground">DonghuaStream</strong> impliquent
            l&apos;acceptation pleine et entière des présentes conditions d&apos;utilisation. Si vous
            n&apos;acceptez pas ces conditions, vous êtes invité à ne pas utiliser le service.
          </p>
          <p>
            L&apos;éditeur se réserve le droit de modifier ces conditions à tout moment. Les
            utilisateurs seront informés des modifications par la mise à jour de la date en
            haut de cette page. La poursuite de l&apos;utilisation du site après modification
            vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Description du service</h2>
          <p>
            DonghuaStream est une plateforme gratuite de référencement et de visionnage de
            donghua via des lecteurs vidéo intégrés (embed) provenant de sources tierces,
            notamment <strong className="text-foreground">Odysee</strong>.
          </p>
          <p>Le service permet notamment :</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>La consultation d&apos;un catalogue de donghua</li>
            <li>Le visionnage d&apos;épisodes via des lecteurs embarqués</li>
            <li>La création d&apos;un compte pour sauvegarder sa progression</li>
            <li>La gestion de favoris et d&apos;un historique de lecture</li>
          </ul>
          <p className="mt-3">
            Le service est fourni « en l&apos;état » et peut être interrompu, modifié ou
            arrêté à tout moment sans préavis ni obligation de la part de l&apos;éditeur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Accès au service</h2>
          <p>
            L&apos;accès au site est gratuit et ouvert à tous. Aucune inscription n&apos;est requise
            pour consulter le catalogue et visionner les contenus. Un compte utilisateur est
            nécessaire uniquement pour accéder aux fonctionnalités de personnalisation (favoris,
            historique, reprise de lecture).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Compte utilisateur</h2>
          <p>
            La création d&apos;un compte est optionnelle et gratuite. En créant un compte, vous
            vous engagez à :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Fournir des informations exactes lors de l&apos;inscription</li>
            <li>Préserver la confidentialité de vos identifiants de connexion</li>
            <li>Ne pas partager votre compte avec des tiers</li>
            <li>Signaler immédiatement toute utilisation non autorisée de votre compte</li>
          </ul>
          <p className="mt-3">
            L&apos;éditeur se réserve le droit de suspendre ou supprimer tout compte en cas
            de violation des présentes conditions, de comportement abusif ou d&apos;utilisation
            frauduleuse du service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Contenu et propriété intellectuelle</h2>
          <p>
            Les vidéos référencées sur DonghuaStream sont hébergées par des plateformes tierces.
            DonghuaStream <strong className="text-foreground">ne stocke, n&apos;héberge ni ne redistribue
            aucun fichier vidéo</strong> sur ses serveurs.
          </p>
          <p>
            Les donghua et contenus vidéo restent la propriété exclusive de leurs auteurs, studios
            de production et ayants droit respectifs. L&apos;interface, le design et le code source de
            DonghuaStream sont la propriété de l&apos;éditeur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Comportement des utilisateurs</h2>
          <p>En utilisant DonghuaStream, vous vous engagez à ne pas :</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Tenter de perturber le fonctionnement du site (attaques, surcharge, etc.)</li>
            <li>Contourner les mesures de sécurité mises en place</li>
            <li>Utiliser le site à des fins illégales ou contraires aux bonnes mœurs</li>
            <li>Collecter des données personnelles d&apos;autres utilisateurs</li>
            <li>Usurper l&apos;identité d&apos;un tiers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Limitation de responsabilité</h2>
          <p>
            L&apos;éditeur ne saurait être tenu responsable :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Du contenu des vidéos hébergées par des plateformes tierces</li>
            <li>De l&apos;indisponibilité temporaire ou permanente du service</li>
            <li>Des dommages directs ou indirects résultant de l&apos;utilisation du site</li>
            <li>De la perte de données liée à un dysfonctionnement technique</li>
          </ul>
          <p className="mt-3">
            En cas de problème avec un contenu spécifique, veuillez nous contacter via la{" "}
            <a href="contact" className="text-primary underline underline-offset-4 hover:text-primary/80">page de contact</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Liens externes</h2>
          <p>
            DonghuaStream peut contenir des liens vers des sites tiers (notamment Odysee).
            L&apos;éditeur n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité
            quant à leur contenu, leurs pratiques de confidentialité ou leur disponibilité.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit français. En cas de litige,
            et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
