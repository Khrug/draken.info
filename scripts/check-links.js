#!/usr/bin/env node
/**
 * scripts/check-links.js — verify every internal link in the build output resolves.
 * Run after a build: npm run check-links
 * Checks href/src values starting with "/" (and #anchors within the same page) across
 * dist/**\/*.html. /_redirects sources count as resolved. Exits 1 if anything is broken.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(DIST)) { console.error('dist/ not found — run node build.js first'); process.exit(1); }

const redirects = new Set();
const rf = path.join(DIST, '_redirects');
if (fs.existsSync(rf)) for (const l of fs.readFileSync(rf, 'utf-8').split('\n')) {
  const src = l.trim().split(/\s+/)[0];
  if (src && !src.startsWith('#')) redirects.add(src.replace(/\/$/, ''));
}

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function resolves(url) {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (redirects.has(clean.replace(/\/$/, ''))) return true;
  const p = path.join(DIST, clean);
  if (clean.endsWith('/')) return fs.existsSync(path.join(p, 'index.html'));
  return fs.existsSync(p) || fs.existsSync(path.join(p, 'index.html'));
}

const broken = [];
let checked = 0;
for (const file of walk(DIST)) {
  // slask/ holds user-uploaded files; its saved HTML pages are not part of the site build
  if (path.relative(DIST, file).split(path.sep)[0] === 'slask' && path.basename(file) !== 'index.html') continue;
  const html = fs.readFileSync(file, 'utf-8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const rel = '/' + path.relative(DIST, file).split(path.sep).join('/');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    // Absolute links to our own domain in post bodies are internal links too (canonical/og URLs excluded)
    const u = m[1].replace(/^https?:\/\/(www\.)?draken\.info(?=\/)/, '');
    if (u.startsWith('#')) { checked++; if (u.length > 1 && !ids.has(u.slice(1))) broken.push(`${rel}: missing anchor ${u}`); continue; }
    if (u.startsWith('file:')) { broken.push(`${rel}: file:// link ${u}`); continue; }
    if (!u.startsWith('/') || u.startsWith('//')) continue;
    checked++;
    if (!resolves(u)) broken.push(`${rel}: ${u}`);
  }
}
for (const b of [...new Set(broken)]) console.log('  ✗ ' + b);
console.log(`  check-links: ${checked} internal links checked, ${new Set(broken).size} broken`);
process.exit(broken.length ? 1 : 0);
