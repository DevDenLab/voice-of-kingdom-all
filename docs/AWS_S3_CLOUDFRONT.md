# Images on AWS: S3 + CloudFront

Goal: images that load as fast as Cloudinary did, for ~100 concurrent visitors.

## Why plain S3 isn't enough — and what is

Cloudinary felt fast for three reasons: a global **CDN**, **pre-sized** images (you never download a
5 MB original for an 800 px tile), and **WebP/AVIF** by default. S3 alone gives you none of those — it is
just storage in one region. The fast AWS setup is:

```
browser ──► CloudFront (edge cache, HTTPS, HTTP/2+3, gzip/brotli)
                │  cache miss only
                ▼
            S3 bucket  (private; CloudFront reads it through an Origin Access Control)
```

and the backend, **at upload time**, writes a few small WebP copies of every image
(`backend/voice_of_kingdom/variants.py`):

| preset    | size            | used for                          |
|-----------|-----------------|-----------------------------------|
| `gallery` | 800×800 crop    | gallery grid tiles                |
| `thumb`   | 400×300 crop    | home "Event Highlights"           |
| `preview` | 800 px wide     | gallery preload                   |
| `full`    | 1600 px wide    | Experience poster                 |
| `team`    | 480×600 crop    | Meet the Team portraits           |

Original `gallery/2025/choir-ab12.jpg` → served as `https://media.vokim.ca/_v/gallery/gallery/2025/choir-ab12.webp`
(immutable, cached for a year at the edge). No server does any work per image view, so 100 users cost nothing extra.

Typical size: ~40–90 KB per gallery tile instead of 2–5 MB originals.

Cost at this scale: CloudFront's free tier (1 TB out / 10 M requests per month) covers it; S3 storage is cents.

> Considered and not chosen: **S3 + CloudFront + Serverless Image Handler** (Lambda resizes on demand, closest to
> Cloudinary's URL API). It works, but the first view of each size is slow (cold Lambda) and it adds a CloudFormation
> stack to maintain. Pre-sizing at upload is faster for readers and simpler to run. Easy to add later if you ever need
> arbitrary sizes.

## One-time AWS setup (≈ 20 min, AWS console)

1. **S3 bucket** — region `ca-central-1` (Montréal, closest to Edmonton). Name e.g. `vokim-media-prod`.
   Leave **Block all public access ON** (CloudFront will read it privately).
2. **ACM certificate** — in **us-east-1** (CloudFront requirement) for `media.vokim.ca`. Validate via the CNAME
   record it shows (add it in GoDaddy DNS).
3. **CloudFront distribution**
   - Origin: the S3 bucket → *Origin access: Origin Access Control (OAC)* → *Create control setting* →
     let the console update the bucket policy.
   - Viewer protocol: **Redirect HTTP to HTTPS**. Compress objects: **Yes**. HTTP/2 + HTTP/3 on.
   - Cache policy: **CachingOptimized**.
   - Alternate domain name: `media.vokim.ca`, certificate from step 2.
   - Price class: *Use only North America and Europe* is plenty.
4. **DNS (GoDaddy)** — `CNAME media → dxxxxxxxxxxxx.cloudfront.net`.
5. **IAM user for the backend** (programmatic access) with this inline policy — nothing else:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::vokim-media-prod" },
       { "Effect": "Allow", "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::vokim-media-prod/*" }
     ]
   }
   ```
   Keep the access key/secret out of git — they go only in `/opt/vokim/.env` on the VM.

## Cut-over (do in this order)

1. **Copy existing media into S3** (from a machine that can reach MinIO; `mc` is already used in `MIGRATION.md`):
   ```bash
   mc alias set vokim https://vokim.ca/minio <MINIO_ROOT_USER> <MINIO_ROOT_PASSWORD>
   mc mirror vokim/vokim-media ./media-export
   aws s3 sync ./media-export s3://vokim-media-prod --cache-control "public, max-age=31536000"
   ```
2. **Point the backend at AWS** — edit `/opt/vokim/.env` on the VM:
   ```
   S3_ENDPOINT_URL=
   S3_BUCKET=vokim-media-prod
   S3_ACCESS_KEY=<iam key>
   S3_SECRET_KEY=<iam secret>
   S3_REGION=ca-central-1
   S3_ADDRESSING_STYLE=virtual
   ```
   then `docker compose --env-file .env -f docker-compose.prod.yml up -d backend`.
   (The compose file keeps MinIO as the default when `S3_ENDPOINT_URL` is unset, so this is reversible.)
3. **Create the resized copies for everything already in the bucket:**
   ```bash
   docker compose -f docker-compose.prod.yml exec backend python manage.py backfill_variants
   ```
   Safe to re-run; it skips images that already have all sizes. **Do this before step 4**, otherwise old
   images 404 on the CDN.
4. **Switch the site to the CDN** — in the GitHub repo → Settings → Secrets and variables → Actions →
   *Variables*, add:
   - `CDN_BASE` = `https://media.vokim.ca`

   (This is baked into the React bundle at build time — `REACT_APP_CDN_BASE`.) Then push to `prod`.
5. **PDFs / newsletters** use `REACT_APP_MEDIA_BASE` (default `/media`, proxied by Caddy to MinIO). After the
   move, change that build arg in `.github/workflows/deploy.yml` to `${{ vars.CDN_BASE }}` as well — object
   keys are identical, so the paths still resolve.
6. Check: open the site → DevTools → Network → an image URL should be `media.vokim.ca/_v/...webp`, response
   header `x-cache: Hit from cloudfront` on the second load.

## Rollback

Unset the `CDN_BASE` variable and redeploy: the frontend falls back to imgproxy/MinIO automatically. To move the
backend back, restore the previous `S3_*` values in `.env` (MinIO keeps its data until you delete the volume).

## Adding images afterwards

Nothing changes for editors: upload in the dashboard (`/gallery/manage`) and the backend writes the original
plus all five sizes to S3. Deleting an image deletes its sizes too.
