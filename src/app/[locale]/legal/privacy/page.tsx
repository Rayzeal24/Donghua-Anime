import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("privacy")}</h1>
      <p className="mb-10 text-sm text-muted-foreground/60">
        Dernière mise à jour : 15 mars 2026
      </p>
      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
          <p>
            La protection de vos données personnelles est une priorité pour{" "}
            <strong className="text-foreground">DonghuaStream</strong>. Cette politique de
            confidentialité décrit les données que nous collectons, comment nous les utilisons
            et les mesures mises en place pour les protéger.
          </p>
          <p>
            En utilisant le site, vous acceptez les pratiques décrites dans cette politique.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Données collectées</h2>
          <p>
            Nous collectons un minimum de données, uniquement lorsque cela est nécessaire au
            fonctionnement du service.
          </p>

          <h3 className="mt-4 text-lg font-medium text-foreground">Données fournies lors de l&apos;inscription</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Adresse email</li>
            <li>Nom d&apos;utilisateur</li>
            <li>Mot de passe (stocké sous forme hashée, jamais en clair)</li>
          </ul>

          <h3 className="mt-4 text-lg font-medium text-foreground">Données générées par l&apos;utilisation</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Liste de favoris</li>
            <li>Historique de visionnage</li>
            <li>Progression de lecture des épisodes</li>
          </ul>

          <h3 className="mt-4 text-lg font-medium text-foreground">Données non collectées</h3>
          <p>
            Nous ne collectons <strong className="text-foreground">aucune</strong> donnée de
            géolocalisation, adresse IP à des fins de profilage, données de navigation sur
            d&apos;autres sites, ni information de paiement (le service est entièrement gratuit).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>L&apos;authentification et la gestion de votre compte</li>
            <li>La sauvegarde de vos favoris et de votre historique</li>
            <li>La reprise de lecture là où vous vous êtes arrêté</li>
            <li>L&apos;amélioration du service (statistiques anonymes d&apos;utilisation)</li>
          </ul>
          <p className="mt-3">
            Vos données ne sont <strong className="text-foreground">jamais vendues, louées ou
            partagées</strong> avec des tiers à des fins commerciales ou publicitaires.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Stockage et sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Les mots de passe sont hashés avec l&apos;algorithme <strong className="text-foreground">bcrypt</strong></li>
            <li>Les sessions utilisent des tokens JWT sécurisés avec expiration</li>
            <li>Les communications sont chiffrées via HTTPS (TLS)</li>
            <li>Aucune donnée sensible n&apos;est stockée en clair</li>
          </ul>
          <p className="mt-3">
            Les données sont hébergées sur les serveurs de <strong className="text-foreground">Vercel</strong> (États-Unis)
            et la base de données est gérée via des services sécurisés avec accès restreint.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
          <p>
            DonghuaStream utilise uniquement des <strong className="text-foreground">cookies essentiels</strong> au
            fonctionnement du site :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong className="text-foreground">Cookie de session</strong> : maintient votre connexion active</li>
            <li><strong className="text-foreground">Cookie de préférences</strong> : sauvegarde vos réglages (thème, langue)</li>
          </ul>
          <p className="mt-3">
            Aucun cookie de tracking, publicitaire ou analytique tiers n&apos;est utilisé.
            Aucun outil de type Google Analytics, Facebook Pixel ou similaire n&apos;est intégré.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Services tiers</h2>
          <p>
            Les vidéos sont intégrées via des lecteurs embarqués provenant d&apos;
            <strong className="text-foreground">Odysee</strong>. Lorsque vous visionnez une vidéo,
            votre navigateur communique directement avec les serveurs d&apos;Odysee, qui peuvent
            collecter leurs propres données selon leur politique de confidentialité.
          </p>
          <p>
            DonghuaStream n&apos;a aucun contrôle sur les données collectées par ces services tiers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Vos droits</h2>
          <p>
            Conformément à la réglementation applicable, vous disposez des droits suivants
            sur vos données personnelles :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong className="text-foreground">Droit d&apos;accès</strong> : consulter les données que nous détenons sur vous</li>
            <li><strong className="text-foreground">Droit de rectification</strong> : modifier vos informations personnelles</li>
            <li><strong className="text-foreground">Droit de suppression</strong> : demander l&apos;effacement complet de votre compte et données</li>
            <li><strong className="text-foreground">Droit de portabilité</strong> : obtenir une copie de vos données dans un format lisible</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez-nous via la{" "}
            <a href="contact" className="text-primary underline underline-offset-4 hover:text-primary/80">page de contact</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Suppression des données</h2>
          <p>
            Vous pouvez à tout moment demander la suppression de votre compte et de l&apos;ensemble
            de vos données associées (favoris, historique, progression). Cette suppression est
            définitive et irréversible.
          </p>
          <p>
            La demande peut être effectuée depuis votre profil ou en nous contactant directement.
            La suppression sera effective dans un délai de <strong className="text-foreground">72 heures</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Mineurs</h2>
          <p>
            DonghuaStream ne collecte pas sciemment de données personnelles de mineurs de
            moins de 13 ans. Si vous êtes parent ou tuteur et pensez que votre enfant nous a
            fourni des données personnelles, veuillez nous contacter afin que nous puissions
            les supprimer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">10. Modifications de cette politique</h2>
          <p>
            Cette politique de confidentialité peut être mise à jour à tout moment. En cas de
            modification substantielle, la date de mise à jour en haut de cette page sera actualisée.
            Nous vous encourageons à consulter régulièrement cette page.
          </p>
        </section>
      </div>
    </div>
  );
}
