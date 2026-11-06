import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageHead } from "@/components/site/ui-x";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — INCINERATE ESPORTS" },
      { name: "description", content: "How INCINERATE ESPORTS collects, uses and protects the information you share with us." },
      { property: "og:title", content: "Privacy Policy — INCINERATE ESPORTS" },
      { property: "og:description", content: "How INCINERATE ESPORTS handles your information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHead crumb="Privacy Policy" eyebrow="Legal" icon={ShieldCheck} title="Privacy" accent="Policy" tone="blue" />
      <section className="section-x">
        <div className="container-x article-body max-w-[860px]">
          <p>
            INCINERATE ESPORTS respects your privacy. This policy explains what information we collect through this
            website and how we use it.
          </p>
          <h2 className="mt-6 text-xl uppercase">Information you send us</h2>
          <p>
            When you use our contact form, sponsorship enquiry form or player application, we store the details you
            enter (such as your name, email, phone number and message) so our management team can respond.
          </p>
          <h2 className="mt-6 text-xl uppercase">How we use it</h2>
          <p>
            We use this information only to reply to you, review applications and manage partnerships. We do not sell
            your information. Player details are only published with the player's permission.
          </p>
          <h2 className="mt-6 text-xl uppercase">Contact</h2>
          <p>To ask about or remove your information, contact us through the Contact Us page.</p>
        </div>
      </section>
    </>
  );
}
