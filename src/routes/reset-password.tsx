import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password — INCINERATE ESPORTS" },
      { name: "description", content: "Set a new password for your INCINERATE ESPORTS admin account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Reset Password — INCINERATE ESPORTS" },
      { property: "og:description", content: "Set a new admin password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setMsg({ kind: "err", text: "Password must be at least 8 characters." });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: error.message });
    setMsg({ kind: "ok", text: "Password updated. Taking you to the dashboard…" });
    setTimeout(() => navigate({ to: "/admin" }), 1200);
  };

  return (
    <section className="section-x">
      <div className="container-x grid place-items-center">
        <div className="card-x w-full max-w-md">
          <form onSubmit={submit} className="card-pad gap-4" noValidate>
            <KeyRound className="feature-icon" />
            <h1 className="text-xl uppercase">Set a new password</h1>
            <label>
              <span className="form-label">New password</span>
              <input
                className="form-input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : null} Update Password
            </button>
            {msg ? <div className={`alert-x ${msg.kind === "ok" ? "alert-ok" : "alert-err"}`}>{msg.text}</div> : null}
            <Link to="/admin" className="text-sm text-muted-x hover:text-primary">
              Back to admin sign in
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
