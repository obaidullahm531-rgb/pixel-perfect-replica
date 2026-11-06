import { useState, type FormEvent, type ReactNode } from "react";
import { Handshake, Loader2, Send, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EMAIL_RE, PARTNERSHIP_TYPES, PLAYER_ROLES } from "@/lib/content-rules";

type Status = { kind: "idle" | "ok" | "err"; msg?: string };

function useForm<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  const bind = (k: keyof T) => ({
    value: values[k],
    onChange: (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    },
    className: `form-input ${errors[k] ? "has-error" : ""}`,
    "aria-invalid": errors[k] ? true : undefined,
  });
  return { values, setValues, errors, setErrors, status, setStatus, busy, setBusy, bind, reset: () => setValues(initial) };
}

function Field({ label, required, error, children }: { label: string; required?: boolean | undefined; error?: string | undefined; children: ReactNode }) {
  return (
    <label className="block">
      <span className="form-label">
        {label} {required ? "*" : null}
      </span>
      {children}
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}

function StatusBox({ status }: { status: Status }) {
  if (status.kind === "idle") return null;
  return (
    <div className={`alert-x ${status.kind === "ok" ? "alert-ok" : "alert-err"} mt-4`} role="status">
      {status.msg}
    </div>
  );
}

const req = (v: string) => v.trim().length > 0;
const clean = (v: string) => (v.trim() ? v.trim() : null);

export function ContactForm() {
  const f = useForm({ full_name: "", email: "", subject: "", message: "" });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof f.errors = {};
    if (!req(f.values.full_name)) er.full_name = "Please enter your name.";
    if (!EMAIL_RE.test(f.values.email.trim())) er.email = "Please enter a valid email.";
    if (!req(f.values.message)) er.message = "Please write a message.";
    if (f.values.message.length > 5000) er.message = "Message is too long (max 5000 characters).";
    f.setErrors(er);
    if (Object.keys(er).length) return;
    f.setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      full_name: f.values.full_name.trim().slice(0, 120),
      email: f.values.email.trim().slice(0, 255),
      subject: clean(f.values.subject)?.slice(0, 200) ?? null,
      message: f.values.message.trim(),
    });
    f.setBusy(false);
    if (error) f.setStatus({ kind: "err", msg: "Sorry, your message could not be sent. Please try again." });
    else {
      f.reset();
      f.setStatus({ kind: "ok", msg: "Thanks! Your message has been sent. Our team will get back to you soon." });
    }
  };
  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" required error={f.errors.full_name}>
          <input {...f.bind("full_name")} placeholder="Your full name" maxLength={120} autoComplete="name" />
        </Field>
        <Field label="Email" required error={f.errors.email}>
          <input {...f.bind("email")} type="email" placeholder="you@email.com" maxLength={255} autoComplete="email" />
        </Field>
      </div>
      <Field label="Subject">
        <input {...f.bind("subject")} placeholder="How can we help?" maxLength={200} />
      </Field>
      <Field label="Message" required error={f.errors.message}>
        <textarea {...f.bind("message")} rows={6} placeholder="Write your message here." maxLength={5000} />
      </Field>
      <button type="submit" className="btn btn-primary btn-block mt-2" disabled={f.busy}>
        {f.busy ? <Loader2 className="animate-spin" /> : <Send />} Send Message
      </button>
      <StatusBox status={f.status} />
    </form>
  );
}

export function SponsorshipForm({ withType = false }: { withType?: boolean }) {
  const f = useForm({ company: "", contact_person: "", email: "", phone: "", partnership_type: "", details: "" });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof f.errors = {};
    if (!req(f.values.company)) er.company = "Please enter your company or brand.";
    if (!req(f.values.contact_person)) er.contact_person = "Please enter a contact person.";
    if (!EMAIL_RE.test(f.values.email.trim())) er.email = "Please enter a valid email.";
    if (f.values.phone && !/^[+\d\s()-]{6,40}$/.test(f.values.phone.trim())) er.phone = "Please enter a valid phone number.";
    if (!req(f.values.details)) er.details = "Please tell us about your proposal.";
    f.setErrors(er);
    if (Object.keys(er).length) return;
    f.setBusy(true);
    const { error } = await supabase.from("sponsorship_enquiries").insert({
      company: f.values.company.trim().slice(0, 160),
      contact_person: f.values.contact_person.trim().slice(0, 120),
      email: f.values.email.trim().slice(0, 255),
      phone: clean(f.values.phone),
      partnership_type: clean(f.values.partnership_type),
      details: f.values.details.trim(),
    });
    f.setBusy(false);
    if (error) f.setStatus({ kind: "err", msg: "Sorry, your enquiry could not be sent. Please try again." });
    else {
      f.reset();
      f.setStatus({ kind: "ok", msg: "Thank you! Your sponsorship enquiry has been received." });
    }
  };
  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company / Brand" required error={f.errors.company}>
          <input {...f.bind("company")} placeholder="Your company name" maxLength={160} />
        </Field>
        <Field label="Contact Person" required error={f.errors.contact_person}>
          <input {...f.bind("contact_person")} placeholder="Full name" maxLength={120} />
        </Field>
        <Field label="Email" required error={f.errors.email}>
          <input {...f.bind("email")} type="email" placeholder="you@company.com" maxLength={255} />
        </Field>
        <Field label="Phone" error={f.errors.phone}>
          <input {...f.bind("phone")} type="tel" placeholder="+880 1XXX XXXXXX" maxLength={40} />
        </Field>
      </div>
      {withType ? (
        <Field label="Partnership Type">
          <select {...f.bind("partnership_type")}>
            <option value="">Select a type</option>
            {PARTNERSHIP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      ) : null}
      <Field label="Proposal Details" required error={f.errors.details}>
        <textarea
          {...f.bind("details")}
          rows={6}
          placeholder="Tell us about your goals and what you would like to discuss."
          maxLength={5000}
        />
      </Field>
      <button type="submit" className="btn btn-fire btn-block mt-2" disabled={f.busy}>
        {f.busy ? <Loader2 className="animate-spin" /> : <Handshake />} Send Enquiry
      </button>
      <StatusBox status={f.status} />
    </form>
  );
}

export function JoinForm() {
  const f = useForm({
    full_name: "",
    ign: "",
    ff_uid: "",
    age: "",
    country: "Bangladesh",
    preferred_role: "",
    secondary_role: "",
    facebook: "",
    video_link: "",
    experience: "",
    email: "",
    phone: "",
  });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = f.values;
    const er: typeof f.errors = {};
    if (!req(v.full_name)) er.full_name = "Please enter your full name.";
    if (!req(v.ign)) er.ign = "Please enter your in-game name.";
    if (v.age && (!/^\d+$/.test(v.age) || +v.age < 8 || +v.age > 80)) er.age = "Please enter a valid age.";
    if (!v.preferred_role) er.preferred_role = "Please choose your preferred role.";
    if (!req(v.experience)) er.experience = "Please describe your esports experience.";
    if (!EMAIL_RE.test(v.email.trim())) er.email = "Please enter a valid email.";
    f.setErrors(er);
    if (Object.keys(er).length) return;
    f.setBusy(true);
    const { error } = await supabase.from("join_applications").insert({
      full_name: v.full_name.trim().slice(0, 120),
      ign: v.ign.trim().slice(0, 60),
      ff_uid: clean(v.ff_uid),
      age: v.age ? Number(v.age) : null,
      country: clean(v.country),
      preferred_role: v.preferred_role,
      secondary_role: clean(v.secondary_role),
      facebook: clean(v.facebook),
      video_link: clean(v.video_link),
      experience: v.experience.trim().slice(0, 3000),
      email: v.email.trim(),
      phone: clean(v.phone),
    });
    f.setBusy(false);
    if (error) f.setStatus({ kind: "err", msg: "Sorry, your application could not be submitted. Please try again." });
    else {
      f.reset();
      f.setStatus({ kind: "ok", msg: "Application received! Our management team will review it and contact shortlisted players." });
    }
  };
  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" required error={f.errors.full_name}>
          <input {...f.bind("full_name")} placeholder="Your full name" maxLength={120} />
        </Field>
        <Field label="In-Game Name" required error={f.errors.ign}>
          <input {...f.bind("ign")} placeholder="Your IGN" maxLength={60} />
        </Field>
        <Field label="Free Fire UID">
          <input {...f.bind("ff_uid")} placeholder="e.g. 1234567890" maxLength={40} />
        </Field>
        <Field label="Age" error={f.errors.age}>
          <input {...f.bind("age")} inputMode="numeric" placeholder="18" maxLength={2} />
        </Field>
        <Field label="Country">
          <input {...f.bind("country")} placeholder="Bangladesh" maxLength={80} />
        </Field>
        <Field label="Preferred Role" required error={f.errors.preferred_role}>
          <select {...f.bind("preferred_role")}>
            <option value="">Select a role</option>
            {PLAYER_ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Secondary Role">
          <select {...f.bind("secondary_role")}>
            <option value="">None</option>
            {PLAYER_ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Facebook Profile">
          <input {...f.bind("facebook")} placeholder="https://facebook.com/..." maxLength={300} />
        </Field>
      </div>
      <Field label="Gameplay Video Link">
        <input {...f.bind("video_link")} placeholder="YouTube / Facebook / TikTok link" maxLength={300} />
      </Field>
      <Field label="Esports Experience" required error={f.errors.experience}>
        <textarea
          {...f.bind("experience")}
          rows={5}
          placeholder="Tournaments played, teams, achievements, scrim experience…"
          maxLength={3000}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" required error={f.errors.email}>
          <input {...f.bind("email")} type="email" placeholder="you@email.com" maxLength={255} />
        </Field>
        <Field label="Phone / WhatsApp">
          <input {...f.bind("phone")} type="tel" placeholder="+880 1XXX XXXXXX" maxLength={40} />
        </Field>
      </div>
      <button type="submit" className="btn btn-fire btn-block mt-2" disabled={f.busy}>
        {f.busy ? <Loader2 className="animate-spin" /> : <UserPlus />} Submit Application
      </button>
      <StatusBox status={f.status} />
    </form>
  );
}
