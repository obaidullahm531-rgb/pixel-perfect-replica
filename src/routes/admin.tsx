import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Award,
  Clapperboard,
  ExternalLink,
  Handshake,
  Images,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Share2,
  ShieldAlert,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/lib/admin";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — INCINERATE ESPORTS" },
      { name: "description", content: "Manage the INCINERATE ESPORTS website content." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard — INCINERATE ESPORTS" },
      { property: "og:description", content: "Manage the INCINERATE ESPORTS website content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/players", label: "Players", icon: Users },
  { to: "/admin/managers", label: "Managers", icon: User },
  { to: "/admin/tournaments", label: "Tournaments", icon: Trophy },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/sponsors", label: "Sponsors", icon: Handshake },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/videos", label: "Videos", icon: Clapperboard },
  { to: "/admin/social", label: "Social Links", icon: Share2 },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
] as const;

function AdminLayout() {
  const state = useAdminSession();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  if (state.status === "loading") {
    return (
      <div className="admin-shell grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (state.status === "signed_out") return <AdminLogin />;
  if (state.status === "not_admin") {
    return (
      <div className="admin-shell site-backdrop grid place-items-center px-4">
        <div className="admin-panel relative z-[1] max-w-md text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-fire" />
          <h1 className="mt-3 text-xl uppercase">No admin access</h1>
          <p className="mt-2 text-muted-foreground">
            You're signed in as {state.user.email}, but this account isn't an administrator.
          </p>
          <button type="button" className="btn btn-ghost mt-5" onClick={() => supabase.auth.signOut()}>
            <LogOut /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to || pathname === `${to}/` : pathname.startsWith(to));

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => (
        <Link key={n.to} to={n.to} className={`admin-nav-link ${isActive(n.to, "exact" in n) ? "is-active" : ""}`}>
          <n.icon /> {n.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="admin-shell lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden border-r bg-sidebar p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <AdminBrand />
        <div className="mt-6 flex-1 overflow-y-auto">{nav}</div>
        <AdminFooter email={state.user.email ?? ""} />
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-sidebar px-4 py-3 lg:hidden">
          <AdminBrand />
          <button type="button" className="nav-toggle" aria-label="Open admin menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>
        {open ? (
          <div className="border-b bg-sidebar p-4 lg:hidden">
            {nav}
            <AdminFooter email={state.user.email ?? ""} />
          </div>
        ) : null}
        <main className="mx-auto max-w-6xl p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminBrand() {
  return (
    <Link to="/admin" className="brand">
      <img src={logoAsset.url} alt="INCINERATE ESPORTS logo" className="brand-logo !h-10" />
      <span className="brand-words">
        <span className="brand-name">INCINERATE</span>
        <span className="brand-sub">ADMIN</span>
      </span>
    </Link>
  );
}

function AdminFooter({ email }: { email: string }) {
  return (
    <div className="mt-4 flex flex-col gap-2 border-t pt-4">
      <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
        <ExternalLink /> View website
      </a>
      <p className="truncate px-3 text-xs text-muted-foreground">{email}</p>
      <button type="button" className="admin-nav-link" onClick={() => supabase.auth.signOut()}>
        <LogOut /> Sign out
      </button>
    </div>
  );
}

function AdminLogin() {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [canCreate, setCanCreate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase.rpc("admin_exists").then(({ data }) => setCanCreate(data === false));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!email.trim()) return setMsg({ kind: "err", text: "Please enter your email." });
    if (mode !== "reset" && password.length < 8) return setMsg({ kind: "err", text: "Password must be at least 8 characters." });
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (!data.session) setMsg({ kind: "ok", text: "Account created. Check your email to confirm it, then sign in here." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "If that email has an account, a password reset link is on its way." });
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : "Something went wrong";
      setMsg({ kind: "err", text });
      toast.error(text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-shell site-backdrop grid place-items-center px-4 py-10">
      <div className="admin-panel relative z-[1] w-full max-w-md !p-7">
        <div className="mb-6 flex justify-center">
          <AdminBrand />
        </div>
        <h1 className="text-center text-xl uppercase">
          {mode === "signin" ? "Admin Sign In" : mode === "signup" ? "Create Admin Account" : "Reset Password"}
        </h1>
        {mode === "signup" ? (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            No administrator exists yet. The first account created becomes the site admin.
          </p>
        ) : null}
        <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
          <label>
            <span className="form-label">Email</span>
            <input className="form-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {mode !== "reset" ? (
            <label>
              <span className="form-label">Password</span>
              <input
                className="form-input"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          ) : null}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : null}
            {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
          {msg ? <div className={`alert-x ${msg.kind === "ok" ? "alert-ok" : "alert-err"}`}>{msg.text}</div> : null}
        </form>
        <div className="mt-5 flex flex-col items-center gap-2 text-sm">
          {mode !== "signin" ? (
            <button type="button" className="text-primary hover:underline" onClick={() => setMode("signin")}>
              Back to sign in
            </button>
          ) : (
            <button type="button" className="text-muted-foreground hover:text-primary" onClick={() => setMode("reset")}>
              Forgot password?
            </button>
          )}
          {canCreate && mode === "signin" ? (
            <button type="button" className="text-primary hover:underline" onClick={() => setMode("signup")}>
              First time? Create the admin account
            </button>
          ) : null}
          <Link to="/" className="text-muted-foreground hover:text-primary">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
