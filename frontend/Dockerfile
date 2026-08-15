# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Build-time config baked into the CRA bundle
ARG REACT_APP_API_URL=""
ARG REACT_APP_IMG_BASE="/img"
ARG REACT_APP_MEDIA_BASE="/media"
ENV REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_IMG_BASE=$REACT_APP_IMG_BASE \
    REACT_APP_MEDIA_BASE=$REACT_APP_MEDIA_BASE \
    GENERATE_SOURCEMAP=false \
    CI=false

# `npm ci` demands the lockfile match the exact platform's optional
# dependencies. This image is built for linux/arm64 (the Oracle VM is
# Ampere A1) but the runner is x86_64, so the build runs under QEMU
# emulation -- and package-lock.json was generated on x86_64. `npm ci`
# under emulated arm64 rejects that as a mismatch even though the lockfile
# is otherwise correct. `npm install` reconciles instead of hard-failing,
# while still using the committed lockfile as its resolution baseline.
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ---------- runtime ----------
FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
