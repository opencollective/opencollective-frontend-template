/* eslint-disable no-process-env */

const nextTranspileModules = require('next-transpile-modules');

const config = {
  eslint: { ignoreDuringBuilds: true },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          // This header controls DNS prefetching, allowing browsers to proactively perform domain name resolution on external links, images, CSS, JavaScript, and more. This prefetching is performed in the background, so the DNS is more likely to be resolved by the time the referenced items are needed. This reduces latency when the user clicks a link.
          // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // This header stops pages from loading when they detect reflected cross-site scripting (XSS) attacks. Although this protection is not necessary when sites implement a strong Content-Security-Policy disabling the use of inline JavaScript ('unsafe-inline'), it can still provide protection for older web browsers that don't support CSP.
          // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // This header indicates whether the site should be allowed to be displayed within an iframe. This can prevent against clickjacking attacks. This header has been superseded by CSP's frame-ancestors option, which has better support in modern browsers.
          // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // This header helps prevent cross-site scripting (XSS), clickjacking and other code injection attacks. Content Security Policy (CSP) can specify allowed origins for content including scripts, stylesheets, images, fonts, objects, media (audio, video), iframes, and more.
          // See https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
          {
            key: 'Content-Security-Policy',
            value: (process.env.NODE_ENV === 'development'
              ? `
                block-all-mixed-content;
                default-src 'self';
                img-src 'self' opencollective-production.s3.us-west-1.amazonaws.com opencollective-production.s3-us-west-1.amazonaws.com opencollective.com images.opencollective.com images-staging.opencollective.com blog.opencollective.com i.ytimg.com;
                worker-src 'none';
                style-src 'self' 'unsafe-inline';
                connect-src 'self' localhost:3060 opencollective.com api.opencollective.com api-staging.opencollective.com;
                script-src 'self' 'unsafe-eval' 'unsafe-inline';
                frame-src youtube-nocookie.com www.youtube-nocookie.com drive.google.com;
              `
              : `
                block-all-mixed-content;
                default-src 'self';
                img-src 'self' opencollective-production.s3.us-west-1.amazonaws.com opencollective-production.s3-us-west-1.amazonaws.com opencollective.com images.opencollective.com images-staging.opencollective.com blog.opencollective.com i.ytimg.com;
                worker-src 'none';
                style-src 'self' 'unsafe-inline';
                connect-src 'self' opencollective.com api.opencollective.com api-staging.opencollective.com;
                script-src 'self';
                frame-src youtube-nocookie.com www.youtube-nocookie.com drive.google.com;
              `
            )
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
    ];
  },
};

const withTm = nextTranspileModules(['@opencollective/frontend-components']);
module.exports = withTm(config);
