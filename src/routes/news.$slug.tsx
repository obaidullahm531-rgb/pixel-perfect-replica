import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";
import { newsBySlugQuery } from "@/lib/queries";
import { formatDate } from "@/lib/content-rules";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context: { queryClient }, params }) => {
    const n = await queryClient.ensureQueryData(newsBySlugQuery(params.slug));
    if (!n) throw notFound();
    return { title: n.title, excerpt: n.excerpt, image: n.image_url };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article — INCINERATE ESPORTS" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.title} | INCINERATE ESPORTS`;
    const description = loaderData.excerpt || "News from INCINERATE ESPORTS.";
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.image && /^https:\/\//.test(loaderData.image)) {
      meta.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    }
    return { meta };
  },
  notFoundComponent: () => (
    <div className="container-x py-24 text-center">
      <h1 className="section-title">Article not found</h1>
      <Link to="/news" className="btn btn-primary mt-6">
        <ArrowLeft /> All News
      </Link>
    </div>
  ),
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data: n } = useSuspenseQuery(newsBySlugQuery(slug));
  if (!n) return null;
  return (
    <>
      <section className="page-head">
        <div className="container-x max-w-[900px]">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/news">News</Link>
            <span>/</span>
            <span className="line-clamp-1">{n.title}</span>
          </nav>
          <span className="chip">{n.category}</span>
          <h1 className="mt-3 !text-[clamp(1.6rem,4vw,2.6rem)]">{n.title}</h1>
          <p className="flex items-center gap-2 !mt-3">
            <Calendar className="h-4 w-4 text-primary" /> {formatDate(n.published_at)}
          </p>
        </div>
      </section>
      <section className="section-x">
        <article className="container-x max-w-[900px]">
          {n.image_url ? <img src={n.image_url} alt={n.title} className="article-img" /> : null}
          <div className="article-body">
            {(n.content || n.excerpt || "")
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
          </div>
          <Link to="/news" className="btn btn-ghost mt-8">
            <ArrowLeft /> All News
          </Link>
        </article>
      </section>
    </>
  );
}
