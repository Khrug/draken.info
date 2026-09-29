#!/usr/bin/env node
/**
 * scripts/validate-posts.js — pre-build validator for posts/*.md
 *
 * Run: npm run validate   (also runs at the start of build.js; errors abort the build)
 *
 * Errors (fail): malformed drk / layers / coherence, missing required fields, date not
 * matching the filename, multi-line excerpt, bad filename/slug, duplicate slug, BOM, CRLF,
 * C1 control characters, mojibake.
 * Warnings: duplicate DRK numbers, missing description, internal /posts/<slug>/ links that do
 * not resolve, drafts (listed but not built).
 *
 * scripts/validate-known-issues.json lists content gaps waiting on an editorial decision
 * (file -> rule ids). Those are reported as warnings instead of errors so they cannot block a
 * deploy; an entry that no longer matches anything is reported so the list stays honest.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const KNOWN_FILE = path.join(__dirname, 'validate-known-issues.json');
const REQUIRED = ['title', 'date', 'excerpt', 'status', 'author', 'license'];
const STATUSES = ['published', 'draft'];
const LAYER_RE = /^L(0[1-9]|1[0-8])$/;
const MOJIBAKE_RE = /\u00c3|\u00e2\u20ac|\u00c2[\u00a0-\u00bf]|\u00f0\u0178/;
const C1_RE = /[\u0080-\u009f]/;
const FILE_RE = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

function isoDate(d) {
  if (d instanceof Date && !isNaN(d)) return d.toISOString().slice(0, 10);
  const m = String(d || '').match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function validate({ postsDir = POSTS_DIR, knownFile = KNOWN_FILE, verbose = false } = {}) {
  const errors = [], warnings = [], drafts = [], noDescription = [];
  let known = {};
  if (knownFile && fs.existsSync(knownFile)) known = JSON.parse(fs.readFileSync(knownFile, 'utf-8')).issues || {};
  const usedKnown = new Set();
  // A problem is an error unless it is listed for that file in known-issues
  const problem = (file, rule, msg) => {
    if ((known[file] || []).includes(rule)) { usedKnown.add(`${file}#${rule}`); warnings.push(`${file}: ${msg} [known: ${rule}]`); }
    else errors.push(`${file}: ${msg}`);
  };

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort();
  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const fm = FILE_RE.exec(file);
    if (!fm) { errors.push(`${file}: filename must be YYYY-MM-DD-<lowercase-kebab-slug>.md`); continue; }
    if (raw.charCodeAt(0) === 0xFEFF) errors.push(`${file}: starts with a UTF-8 BOM`);
    if (raw.includes('\r')) errors.push(`${file}: CRLF/CR line endings (use LF)`);
    if (C1_RE.test(raw)) errors.push(`${file}: contains C1 control characters (U+0080–U+009F)`);
    if (MOJIBAKE_RE.test(raw)) errors.push(`${file}: contains mojibake (e.g. "\u00c3", "\u00e2\u20ac") — re-save as UTF-8`);

    let data;
    try { data = matter(raw.replace(/^﻿/, '')).data; }
    catch (e) { errors.push(`${file}: frontmatter does not parse: ${e.message.split('\n')[0]}`); continue; }

    const slug = fm[2];
    const draft = data.status === 'draft';
    if (draft) drafts.push(file);
    posts.push({ file, slug, data, raw, draft });

    if (data.status !== undefined && !STATUSES.includes(data.status)) errors.push(`${file}: status must be one of ${STATUSES.join('/')} (got "${data.status}")`);
    if (data.slug !== undefined && data.slug !== slug) errors.push(`${file}: frontmatter slug "${data.slug}" differs from filename slug "${slug}"`);
    if (typeof data.drk !== 'string' || !/^DRK-\d{3}$/.test(data.drk)) errors.push(`${file}: drk must match DRK-NNN (got ${JSON.stringify(data.drk)})`);
    const d = isoDate(data.date);
    if (data.date !== undefined && d !== fm[1]) errors.push(`${file}: date ${d || JSON.stringify(data.date)} does not match filename date ${fm[1]}`);
    if (/^excerpt:\s*[|>]/m.test(raw.split(/\n---\s*\n/)[0]) || (typeof data.excerpt === 'string' && data.excerpt.includes('\n')))
      errors.push(`${file}: excerpt must be a single line (block scalars are not allowed)`);

    if (draft) continue; // content checks below apply to published posts only

    for (const k of REQUIRED) if (data[k] === undefined || data[k] === '') problem(file, `missing-${k}`, `missing required field "${k}"`);
    if (data.layers === undefined) problem(file, 'missing-layers', 'missing "layers"');
    else if (!Array.isArray(data.layers) || !data.layers.length || !data.layers.every(l => LAYER_RE.test(String(l))))
      errors.push(`${file}: layers must be a non-empty list of L01–L18 (got ${JSON.stringify(data.layers)})`);
    if (data.coherence === undefined) problem(file, 'missing-coherence', 'missing "coherence"');
    else if (typeof data.coherence !== 'number' || !(data.coherence > 0 && data.coherence <= 1))
      problem(file, 'coherence-range', `coherence must be a number in (0, 1] (got ${JSON.stringify(data.coherence)})`);
    if (!data.description) noDescription.push(file);
  }

  // Cross-post checks
  const bySlug = new Map(), byDrk = new Map();
  for (const p of posts) {
    if (bySlug.has(p.slug)) errors.push(`${p.file}: slug "${p.slug}" also used by ${bySlug.get(p.slug)}`);
    bySlug.set(p.slug, p.file);
    if (typeof p.data.drk === 'string') byDrk.set(p.data.drk, [...(byDrk.get(p.data.drk) || []), p.file]);
  }
  for (const [drk, fs_] of byDrk) if (fs_.length > 1) warnings.push(`duplicate ${drk}: ${fs_.join(', ')}`);

  const published = new Set(posts.filter(p => !p.draft).map(p => p.slug));
  const archived = fs.existsSync(path.join(postsDir, 'v1'))
    ? new Set(fs.readdirSync(path.join(postsDir, 'v1')).map(f => (FILE_RE.exec(f) || [])[2]).filter(Boolean).map(s => `v1/${s}`))
    : new Set();
  const linkRe = /\]\((?:https?:\/\/(?:www\.)?draken\.info)?\/posts\/([a-z0-9/-]+?)\/?(?:#[^)]*)?\)/g;
  // Links to our own domain outside the known top-level routes (e.g. draken.info/<slug> without /posts/)
  const ROUTES = ['posts', 'thesis', 'sheaf-analyzer', 'digest', 'map', 'slask', 'drakonomikon', 'data', 'images', 'orakel'];
  const siteRe = /\]\((?:https?:\/\/(?:www\.)?draken\.info)?\/([a-z0-9-]+)[^)\s]*\)/g;
  for (const p of posts) {
    let m;
    while ((m = linkRe.exec(p.raw))) {
      const target = m[1].replace(/\/$/, '');
      if (!published.has(target) && !archived.has(target)) warnings.push(`${p.file}: link /posts/${target}/ does not resolve to a post`);
    }
    while ((m = siteRe.exec(p.raw))) {
      if (!ROUTES.includes(m[1])) warnings.push(`${p.file}: link /${m[1]} is not a site route (missing /posts/?)`);
    }
  }

  for (const [file, rules] of Object.entries(known))
    for (const r of rules) if (!usedKnown.has(`${file}#${r}`)) warnings.push(`known-issues entry ${file}#${r} no longer applies — remove it`);
  if (noDescription.length) warnings.push(verbose
    ? `no "description" (meta description falls back to excerpt): ${noDescription.join(', ')}`
    : `${noDescription.length} posts have no "description" (meta description falls back to excerpt; --verbose lists them)`);
  for (const f of drafts) warnings.push(`${f}: status draft — listed here, not built`);

  return { errors, warnings, count: files.length };
}

function report(res, { quiet = false } = {}) {
  if (!quiet || res.errors.length) {
    for (const w of res.warnings) console.warn(`  ⚠ ${w}`);
    for (const e of res.errors) console.error(`  ✗ ${e}`);
  }
  console.log(`  validate-posts: ${res.count} posts, ${res.errors.length} error(s), ${res.warnings.length} warning(s)`);
  return res.errors.length === 0;
}

module.exports = { validate, report };

if (require.main === module) {
  const args = process.argv.slice(2);
  const dirArg = args.find(a => !a.startsWith('--'));
  const opts = { verbose: args.includes('--verbose') };
  if (dirArg) Object.assign(opts, { postsDir: path.resolve(dirArg), knownFile: args.includes('--no-known') ? null : KNOWN_FILE });
  const res = validate(opts);
  process.exit(report(res) ? 0 : 1);
}
