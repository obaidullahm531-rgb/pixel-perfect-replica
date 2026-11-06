import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHead } from "@/components/site/ui-x";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — INCINERATE ESPORTS" },
      { name: "description", content: "Terms for using the INCINERATE ESPORTS website and its content." },
      { property: "og:title", content: "Terms & Conditions — INCINERATE ESPORTS" },
      { property: "og:description", content: "Terms for using the INCINERATE ESPORTS website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHead crumb="Terms & Conditions" eyebrow="Legal" icon={FileText} title="Terms &" accent="Conditions" />
      <section className="section-x">
        <div className="container-x article-body max-w-[860px]">
          <p>By using the INCINERATE ESPORTS website you agree to these terms.</p>
          <h2 className="mt-6 text-xl uppercase">Content</h2>
          <p>
            Team names, logos, photos, videos and written content on this site belong to INCINERATE ESPORTS or their
            respective owners and may not be reused without permission. Garena Free Fire is a trademark of Garena.
          </p>
          <h2 className="mt-6 text-xl uppercase">Submissions</h2>
          <p>
            Information you send through our forms must be accurate and your own. Submitting an application does not
            guarantee a place on the roster.
          </p>
          <h2 className="mt-6 text-xl uppercase">Changes</h2>
          <p>We may update these terms at any time. Continued use of the site means you accept the latest version.</p>
        </div>
      </section>
    </>
  );
}
