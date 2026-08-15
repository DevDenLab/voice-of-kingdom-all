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

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

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
