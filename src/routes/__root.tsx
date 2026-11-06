import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, socialQuery } from "@/lib/queries";

function NotFoundComponent() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="max-w-md">
        <h1 className="hero-title fire-text">404</h1>
        <h2 className="mt-4 text-xl uppercase">Page not found</h2>
        <p className="mt-2 text-muted-x">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary mt-6">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="max-w-md">
        <h1 className="text-xl uppercase">This page didn't load</h1>
        <p className="mt-2 text-muted-x">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn btn-ghost">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context: { queryClient } }) => {
    // Shared by header, footer and social buttons on every page.
    await Promise.all([
      queryClient.ensureQueryData(settingsQuery).catch(() => null),
      queryClient.ensureQueryData(socialQuery).catch(() => null),
    ]);
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#05070d" },
      { title: "INCINERATE ESPORTS — Garena Free Fire Team from Bangladesh" },
      {
        name: "description",
        content: "INCINERATE ESPORTS is a competitive Garena Free Fire organization from Bangladesh. Burn everything. Win always.",
      },
      { name: "author", content: "INCINERATE ESPORTS" },
      { property: "og:site_name", content: "INCINERATE ESPORTS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const isAdmin = useRouterState({ select: (r) => r.location.pathname.startsWith("/admin") });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <div className="site-backdrop flex min-h-screen flex-col">
          <Header />
          <main className="relative z-[1] flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
