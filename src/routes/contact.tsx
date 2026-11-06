import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Mail, MapPin, Share2 } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { PageHead, SocialButtons } from "@/components/site/ui-x";
import { ContactForm, SponsorshipForm } from "@/components/site/Forms";

export const Route = createFileRoute("/contact")({
  loader: async ({ context: { queryClient } }) => {
    const s = await queryClient.ensureQueryData(settingsQuery);
    return { seo: s.seo.contact };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "contact") }),
  component: Contact,
});

function Contact() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <>
      <PageHead
        crumb="Contact Us"
        eyebrow="Get in Touch"
        icon={Mail}
        title="Contact"
        accent="Us"
        sub="Questions, partnership proposals or player enquiries — reach the INCINERATE ESPORTS management team."
      />
      <section className="section-x">
        <div className="container-x grid-cards cols-3">
          <div className="card-x hoverable">
            <div className="card-pad">
              <Mail className="feature-icon" />
              <h2 className="card-title mt-1">Business Email</h2>
              <p className="text-sm text-muted-x">For sponsorships and official matters.</p>
              <a href={`mailto:${s.contactEmail}`} className="card-cta break-all">
                {s.contactEmail} <ArrowRight />
              </a>
            </div>
          </div>
          <div className="card-x hoverable">
            <div className="card-pad">
              <MapPin className="feature-icon" />
              <h2 className="card-title mt-1">Location</h2>
              <p className="text-sm text-muted-x">{s.locationLong}</p>
            </div>
          </div>
          <div className="card-x hoverable">
            <div className="card-pad">
              <Share2 className="feature-icon" />
              <h2 className="card-title mt-1">Social Channels</h2>
              <SocialButtons className="mt-1" />
            </div>
          </div>
        </div>
      </section>
      <section className="section-x !pt-0">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div className="card-x">
            <div className="card-pad">
              <h2 className="text-xl uppercase">Send us a Message</h2>
              <p className="mb-3 text-sm text-muted-x">Questions, feedback or general enquiries.</p>
              <ContactForm />
            </div>
          </div>
          <div className="card-x">
            <div className="card-pad">
              <h2 className="text-xl uppercase">Sponsorship Enquiry</h2>
              <p className="mb-3 text-sm text-muted-x">Partner with INCINERATE ESPORTS.</p>
              <SponsorshipForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
