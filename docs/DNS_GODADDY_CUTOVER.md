# DNS cutover — GoDaddy → Oracle VM

Domain: **vokim.ca**, registered at GoDaddy, currently pointing at Heroku.

---

## Why this needs a small plan

Heroku gives you a **CNAME target** (`something.herokudns.com`), not an IP.
Your Oracle VM gives you a **fixed public IP**.

That matters because DNS does not allow a CNAME at the zone apex (`vokim.ca` with no
subdomain). So the apex is probably either an A record pointing at a Heroku IP, or it's
using GoDaddy's forwarding. Either way, after the move the apex becomes a plain A record
pointing at your VM — which is simpler than what you have now.

---

## Step 1 — Lower the TTL first (do this 24h before cutover)

This is the step people skip and then regret. It's what makes rollback fast.

GoDaddy → My Products → Domains → **vokim.ca** → DNS → Manage Zones.

For **every** record you're about to change, edit the TTL to **600 seconds (10 minutes)**.
GoDaddy's default is 1 hour; the dropdown has a "Custom" option for 600.

Then wait a full previous-TTL period (1 hour) before step 3, so resolvers have picked up
the shorter TTL.

---

## Step 2 — Note what's there now

Before you change anything, write down the current values. Screenshot the zone page.

```bash
dig +short vokim.ca A
dig +short www.vokim.ca CNAME
dig +short vokim.ca MX
dig +short vokim.ca TXT
```

**Do not touch MX or TXT records.** Your email (`info@vokim.ca` on Microsoft 365) depends
on the MX records and the SPF/DKIM/DMARC TXT records. Changing web hosting has nothing to
do with them. Breaking these breaks all mail.

---

## Step 3 — Point at the VM

In the GoDaddy DNS manager:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `<VM_PUBLIC_IP>` | 600 |
| A | `www` | `<VM_PUBLIC_IP>` | 600 |

- **Delete** the old `www` CNAME that points to `*.herokudns.com` — a name can't have both
  a CNAME and an A record.
- **Delete** any GoDaddy domain *Forwarding* rule on the apex (Domain Settings → Forwarding).
  Forwarding silently overrides your A record and will make the site appear not to update.
- Leave `_domainconnect`, MX, TXT and any `_dmarc` / `selector*._domainkey` records alone.

Both `@` and `www` are served directly by Caddy — the Caddyfile lists both hostnames, so
each gets its own certificate and neither redirects to the other. Old links to either form
keep working.

---

## Step 4 — Watch it propagate

```bash
# should return your VM IP
dig +short vokim.ca @1.1.1.1
dig +short www.vokim.ca @8.8.8.8

# certificate check once DNS resolves
curl -sI https://vokim.ca | head -3
echo | openssl s_client -connect vokim.ca:443 -servername vokim.ca 2>/dev/null \
  | openssl x509 -noout -issuer -dates
```

Caddy requests the certificate automatically on the first HTTPS request after DNS resolves.
Expect it within a minute or two. Follow along with:

```bash
ssh ubuntu@<VM_IP> 'cd /opt/vokim && docker compose -f docker-compose.prod.yml logs -f caddy'
```

Look for `certificate obtained successfully`.

---

## Step 5 — Remove the domain from Heroku

Only after HTTPS works on the VM:

```bash
heroku domains:remove vokim.ca --app <app>
heroku domains:remove www.vokim.ca --app <app>
```

Leave the Heroku app itself running for ~48h as a rollback target.

---

## Step 6 — Raise the TTL back

Once you're happy, set the two A records back to 1 hour (3600). Lower TTLs mean more
lookups; there's no reason to keep 600 permanently.

---

## Troubleshooting

**Certificate never issues.** Port 80 must be reachable from the public internet — Let's
Encrypt validates over HTTP. Check *both* Oracle layers (Security List **and** iptables on
the VM, see `ORACLE_VM_SETUP.md` §1). Test with `curl -I http://<VM_IP>` from your laptop.

**Site loads on `www` but not the apex (or vice versa).** One of the two A records is
missing, or a GoDaddy Forwarding rule is intercepting the apex.

**Old site still showing.** Browser and OS DNS caches. Try `curl -I https://vokim.ca` from a
terminal, or a phone on cellular data. Flush with `ipconfig /flushdns` (Windows) or
`sudo dscacheutil -flushcache` (macOS).

**Email stops working.** You changed an MX or TXT record. Restore it from the screenshot
you took in step 2. This is why step 2 exists.

**`ERR_TOO_MANY_REDIRECTS`.** Django and Caddy are both redirecting to HTTPS. Confirm
`DJANGO_SECURE_SSL_REDIRECT=False` in `/opt/vokim/.env` — Caddy already handles it.
