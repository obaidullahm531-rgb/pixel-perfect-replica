import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { isDirectVideo, youtubeId } from "@/lib/content-rules";

export function Overlay({ onClose, children, label }: { onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="overlay-x" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <button type="button" className="round-close" aria-label="Close" onClick={onClose}>
        <X className="h-5 w-5" />
      </button>
      <div onClick={(e) => e.stopPropagation()} className="contents">
        {children}
      </div>
    </div>,
    document.body,
  );
}

export type LightboxItem = { imageUrl?: string | null; videoUrl?: string | null; caption?: string | null };

export function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const yt = youtubeId(item.videoUrl);
  return (
    <Overlay onClose={onClose} label={item.caption || "Media viewer"}>
      <figure className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-media">
          {yt ? (
            <iframe
              src={`https://www.youtube.com/embed/${yt}?autoplay=1&rel=0`}
              title={item.caption || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : item.videoUrl && isDirectVideo(item.videoUrl) ? (
            <video src={item.videoUrl} poster={item.imageUrl ?? undefined} controls autoPlay playsInline />
          ) : item.videoUrl ? (
            <div className="p-8 text-center">
              <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Open video
              </a>
            </div>
          ) : item.imageUrl ? (
            <img src={item.imageUrl} alt={item.caption || "Gallery image"} />
          ) : null}
        </div>
        {item.caption ? <figcaption className="text-muted-x">{item.caption}</figcaption> : null}
      </figure>
    </Overlay>
  );
}

export function DetailModal({ onClose, label, children }: { onClose: () => void; label: string; children: ReactNode }) {
  return (
    <Overlay onClose={onClose} label={label}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </Overlay>
  );
}
