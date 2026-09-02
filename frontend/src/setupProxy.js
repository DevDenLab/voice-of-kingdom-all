/**
 * Dev-only proxy (used by `npm start`).
 *
 * Replaces the plain `"proxy"` string in package.json because that one forces
 * `changeOrigin: true`, which rewrites the browser's `Origin` header to
 * `http://localhost:8000`. Django's CSRF check then rejects the login POST
 * ("Origin checking failed ... does not match any trusted origins").
 *
 * With `changeOrigin: false` the real `http://localhost:3000` Origin is
 * forwarded, which is already in CSRF_TRUSTED_ORIGINS. In production there is
 * no proxy (Caddy serves the SPA and the API on the same origin), so this file
 * is irrelevant there.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKEND = process.env.REACT_APP_BACKEND_ORIGIN || 'http://localhost:8000';

module.exports = function (app) {
  app.use(
    ['/api', '/csrf', '/admin', '/django-static', '/media', '/healthz'],
    createProxyMiddleware({
      target: BACKEND,
      changeOrigin: false,
      xfwd: true,
    })
  );
};
