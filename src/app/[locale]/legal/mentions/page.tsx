import { getTranslations } from "next-intl/server";

export default async function MentionsPage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("mentions")}</h1>
      <p className="mb-10 text-sm text-muted-foreground/60">
        Dernière mise à jour : 15 mars 2026
      </p>
      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Éditeur du site</h2>
          <p>
            Le site <strong className="text-foreground">DonghuaStream</strong> est un projet personnel
            à but non lucratif, édité par un particulier. Il ne constitue pas une activité commerciale
            et ne génère aucun revenu publicitaire ou de quelque nature que ce soit.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Nom du site : DonghuaStream</li>
            <li>Statut : projet personnel, non commercial</li>
            <li>Contact : via la <a href="contact" className="text-primary underline underline-offset-4 hover:text-primary/80">page de contact</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Raison sociale : Vercel Inc.</li>
            <li>Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">vercel.com</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Nature du contenu</h2>
          <p>
            Les vidéos affichées sur cette plateforme sont intégrées via des lecteurs embarqués (embed)
            depuis <strong className="text-foreground">Odysee</strong>, une plateforme de partage vidéo
            décentralisée basée sur le protocole LBRY.
          </p>
          <p>
            DonghuaStream <strong className="text-foreground">ne stocke, n&apos;héberge ni ne redistribue
            aucun fichier vidéo</strong> sur ses propres serveurs. Le site agit uniquement comme un
            catalogue de référencement de contenus publiquement disponibles et légalement intégrables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Propriété intellectuelle</h2>
          <p>
            L&apos;interface, le design, le code source et les éléments graphiques propres à DonghuaStream
            sont la propriété de l&apos;éditeur du site. Toute reproduction, même partielle, est interdite
            sans autorisation préalable.
          </p>
          <p>
            Les donghua et contenus vidéo référencés restent la propriété exclusive de leurs auteurs,
            studios de production et ayants droit respectifs. DonghuaStream ne revendique aucun droit
            sur ces œuvres.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Demande de retrait</h2>
          <p>
            Si vous êtes titulaire de droits sur un contenu référencé et souhaitez son retrait,
            veuillez nous contacter via la{" "}
            <a href="contact" className="text-primary underline underline-offset-4 hover:text-primary/80">page de contact</a>{" "}
            en fournissant :
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Votre identité et qualité (auteur, ayant droit, représentant légal)</li>
            <li>L&apos;identification précise du contenu concerné (titre, URL)</li>
            <li>La justification de votre demande</li>
          </ul>
          <p className="mt-3">
            Nous nous engageons à traiter toute demande légitime dans un délai de <strong className="text-foreground">48 heures</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Limitation de responsabilité</h2>
          <p>
            L&apos;éditeur ne saurait être tenu responsable des contenus hébergés sur des plateformes
            tierces (Odysee) et simplement référencés sur DonghuaStream. L&apos;éditeur s&apos;efforce de
            ne référencer que des contenus légalement accessibles, mais ne peut garantir en permanence
            la conformité de l&apos;ensemble des contenus listés.
          </p>
          <p>
            L&apos;utilisation du site se fait aux risques et périls de l&apos;utilisateur. DonghuaStream
            est fourni « en l&apos;état », sans garantie d&apos;aucune sorte.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige,
            et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
