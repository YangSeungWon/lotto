#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://lotto.ysw.kr';

const pages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/results/', priority: '0.9', changefreq: 'weekly' },
  { loc: '/generator/', priority: '0.8', changefreq: 'monthly' },
  { loc: '/statistics/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/education/', priority: '0.7', changefreq: 'monthly' },
];

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${DOMAIN}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);
console.log(`Sitemap generated: ${outputPath}`);
console.log(`Last modified: ${today}`);
