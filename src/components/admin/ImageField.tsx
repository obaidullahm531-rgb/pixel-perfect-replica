import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { deleteMediaByUrl, uploadMedia } from "@/lib/admin";

export function ImageField({
  value,
  onChange,
  folder,
  accept = "image/*",
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(value);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File is too large (max 20 MB).");
      return;
    }
    setBusy(true);
    try {
      const { url } = await uploadMedia(file, folder);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const remove = async () => {
    const old = value;
    onChange("");
    await deleteMediaByUrl(old).catch(() => undefined);
  };

  return (
    <div>
      <span className="form-label">{label}</span>
      <div className="flex flex-wrap items-start gap-3">
        <div className="grid h-28 w-28 flex-none place-items-center overflow-hidden rounded-[10px] border bg-surface">
          {value ? (
            isVideo ? (
              <video src={value} className="h-full w-full object-cover" muted />
            ) : (
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
            )
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={ref}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />} {value ? "Replace" : "Upload"}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowUrl((s) => !s)}>
            <Link2 /> Paste link
          </button>
          {value ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={remove}>
              <Trash2 /> Remove
            </button>
          ) : null}
        </div>
      </div>
      {showUrl ? (
        <input
          className="form-input mt-2"
          placeholder="https://…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}
