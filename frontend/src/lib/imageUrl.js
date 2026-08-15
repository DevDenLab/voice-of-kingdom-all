/**
 * Cloudinary replacement.
 *
 * Images live in MinIO (S3-compatible) and are resized on the fly by imgproxy,
 * which is exposed behind the reverse proxy at REACT_APP_IMG_BASE (default "/img").
 *
 * imgproxy URL shape:
 *   {base}/insecure/{processing-options}/{base64url(source)}.{ext}
 *
 * imgproxy runs in "insecure" (unsigned) mode but is locked down with
 * IMGPROXY_ALLOWED_SOURCES=s3://<bucket>/ so it can only ever read our own
 * bucket -- no SSRF surface. See infra/docker-compose.prod.yml.
 */

const IMG_BASE = process.env.REACT_APP_IMG_BASE || "/img";
const BUCKET = process.env.REACT_APP_MEDIA_BUCKET || "vokim-media";

/** base64url encode, browser-safe, handles unicode keys */
function b64url(input) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Build an imgproxy URL for an object key stored in the media bucket.
 *
 * @param {string} key      object key, e.g. "gallery/choir-2025.jpg"
 * @param {object} opts
 * @param {number} opts.width
 * @param {number} opts.height
 * @param {"fill"|"fit"|"force"} opts.resize
 * @param {number} opts.quality
 * @param {string} opts.format  "webp" | "jpg" | "png" | "avif"
 * @param {string} opts.gravity
 */
export function imageUrl(key, opts = {}) {
  if (!key) return "";

  // already an absolute URL (external image) -- pass through untouched
  if (/^https?:\/\//i.test(key)) return key;

  const {
    width,
    height,
    resize = "fill",
    quality = 80,
    format = "webp",
    gravity = "sm", // smart gravity: keeps the subject in frame
  } = opts;

  const parts = [];
  if (width || height) {
    parts.push(`rs:${resize}:${width || 0}:${height || 0}:0`);
    parts.push(`g:${gravity}`);
  }
  parts.push(`q:${quality}`);

  const cleanKey = key.replace(/^\/+/, "");
  const source = b64url(`s3://${BUCKET}/${cleanKey}`);

  return `${IMG_BASE}/insecure/${parts.join("/")}/${source}.${format}`;
}

/** Square gallery thumbnail (was: c_fill,w_800,h_800,q_auto:good,f_auto) */
export const galleryUrl = (key) =>
  imageUrl(key, { width: 800, height: 800, resize: "fill", quality: 80 });

/** Width-constrained preload (was: c_scale,w_800,q_auto:good) */
export const previewUrl = (key) =>
  imageUrl(key, { width: 800, resize: "fit", quality: 80 });

/** Direct, untransformed object URL -- for PDFs and other non-images */
export function mediaUrl(key) {
  if (!key) return "";
  if (/^https?:\/\//i.test(key)) return key;
  const base = process.env.REACT_APP_MEDIA_BASE || "/media";
  return `${base}/${key.replace(/^\/+/, "")}`;
}

export default imageUrl;
