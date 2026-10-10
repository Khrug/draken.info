// ═══ SA2 REVIEW ═══ fact-checking support and scientific-paper review.
// Fact-check: ranks check-worthy sentences (features in the spirit of ClaimBuster, Hassan et al. 2017,
// KDD; here a transparent hand-set score, not a trained model), says what kind of evidence would settle
// each, links searches, and attaches the engine's own findings (contradictions, arithmetic).
// Paper review: reporting checklist (design, sample sizes, effect sizes, CIs, power, preregistration,
// data/code, ethics, COI, funding, limitations), statcheck/GRIM/p-profile from engine-stats, causal
// language in non-experimental designs, overclaiming vocabulary, reference-list age, optional Crossref
// lookup of DOIs (resolves? title matches the citing text? retraction or correction notices?).
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : (typeof require !== 'undefined' ? require('./engine-math.js') : {});
(function (S) {
  var W = function (s) { return (s.match(/[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*/g) || []); };
  var STOP = new Set('the a an it this that these those there here and or but of in on at to for with as is are was were be been being has have had do does did not no by from into than then so such its their his her our your we they he she i you which who whom what when where why how also more most less very can could may might will would should must about over under after before during between'.split(' '));
  var SUPER = /\b(?:largest|biggest|highest|lowest|smallest|most|least|first|last|only|record|best|worst|fastest|slowest|oldest|youngest|greatest|unprecedented|never before|more than|less than|fewer than|majority|minority|twice|half of|doubled|tripled)\b/i;
  var CAUSE = /\b(?:caus(?:e[sd]?|ing)|leads? to|led to|results? in|resulted in|due to|because of|effect of|impact of|drives?|drove|prevents?|prevented|reduces?|reduced|increases?|increased|improves?|improved|triggers?|triggered|responsible for|contributes? to|linked to|associated with)\b/i;
  var OPINION = /\b(?:i think|i believe|in my view|in my opinion|we believe|should|ought to|must be (?:stopped|done)|it is time|let us|beautiful|ugly|wonderful|terrible)\b/i;
  var STAT = /\b(?:per ?cent|percent|%|rate|average|median|mean|ratio|share|proportion|majority|statistic|survey|poll|million|billion|thousand)\b/i;
  var VAGUE = /\b(?:experts? (?:say|agree|warn|believe)|scientists (?:say|agree)|studies (?:show|suggest|prove)|research (?:shows|suggests|proves)|sources (?:say|said)|some (?:say|people|argue)|many (?:say|people|believe)|it is (?:said|believed|claimed|reported)|according to (?:reports|sources|experts)|officials (?:say|said)|critics say)\b/i;

  function keyQuery(text, ents) {
    var named = ents.filter(function (e) { return text.indexOf(e) >= 0; }).slice(0, 3);
    var nums = (text.match(/\b\d[\d.,]*\s?(?:%|percent|million|billion)?/g) || []).slice(0, 2);
    var content = W(text).map(function (w) { return w.toLowerCase(); }).filter(function (w) { return !STOP.has(w) && w.length > 3; });
    var q = named.concat(nums.map(function (n) { return n.trim(); })); content.forEach(function (w) { if (q.length < 9 && q.join(' ').toLowerCase().indexOf(w) < 0) q.push(w); });
    return q.join(' ').replace(/\s+/g, ' ').trim();
  }
  S.searchLinks = function (q) {
    var e = encodeURIComponent(q);
    return [
      { name: 'Fact Check Explorer', url: 'https://toolbox.google.com/factcheck/explorer/search/' + e + ';hl=en' },
      { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=' + e },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/w/index.php?search=' + e },
      { name: 'Web', url: 'https://duckduckgo.com/?q=' + e }
    ];
  };

  // ── fact-check ──
  S.factcheck = function (text, R, I, arith) {
    var ents = (I.entities || []).map(function (e) { return e.name; });
    var entUnits = {}; (I.entities || []).forEach(function (e) { (e.units || []).forEach(function (u) { (entUnits[u] = entUnits[u] || []).push(e.name); }); });
    var obsUnits = {}; (R.obstructions || []).forEach(function (o, k) { (o.claims || []).forEach(function (cid) { var c = R.claims.find(function (x) { return x.id === cid; }); if (c) (obsUnits[c.unit] = obsUnits[c.unit] || []).push({ k: k, cls: o.class, witness: o.witness }); }); });
    var claimsByUnit = {}; R.claims.forEach(function (c) { (claimsByUnit[c.unit] = claimsByUnit[c.unit] || []).push(c); });
    var items = [];
    R.units.forEach(function (u) {
      if (u.heading || u.refs || u.boilerplate || W(u.text).length < 5 || /\?\s*$/.test(u.text)) return;
      var t = u.cleanText || u.text, cs = claimsByUnit[u.id] || [], f = [], sc = 0;
      var hasNum = cs.some(function (c) { return c.type === 'numeric'; }) || /\b\d[\d,.]*\s?(?:%|percent|per cent|million|billion|thousand)\b/i.test(t);
      var hasDate = cs.some(function (c) { return c.type === 'date'; }) || /\b(?:1[89]|20)\d\d\b/.test(t);
      var rep = cs.find(function (c) { return c.modality && c.modality.kind === 'reported'; });
      if (hasNum) { sc += 2; f.push('quantity'); } if (hasDate) { sc += 1; f.push('date'); }
      if (entUnits[u.id]) { sc += 1; f.push('named entity'); }
      if (SUPER.test(t)) { sc += 1.5; f.push('superlative/comparison'); }
      if (CAUSE.test(t)) { sc += 1; f.push('causal'); }
      if (STAT.test(t) && !hasNum) { sc += 0.5; f.push('statistic word'); }
      if (rep) { sc += 1; f.push('attributed'); }
      var vague = VAGUE.test(t); if (vague) { sc += 2; f.push('vague attribution'); }
      if (/["“][^"”]{12,}["”]/.test(t)) { sc += 0.5; f.push('quotation'); }
      if (OPINION.test(t)) sc -= 1.5;
      if (cs.some(function (c) { return c.modality && (c.modality.kind === 'hypothesized' || c.modality.kind === 'question'); })) sc -= 1;
      var ar = (arith || []).filter(function (a) { return t.indexOf(a.text.split(' … ')[0].split(' / ').pop().slice(0, 18)) >= 0; });
      if (obsUnits[u.id]) { sc += 2; f.push('internal conflict'); }
      if (ar.some(function (a) { return a.status === 'mismatch'; })) { sc += 2; f.push('arithmetic mismatch'); }
      if (sc < 2.5) return;
      var settle = [];
      if (hasNum) settle.push('the primary dataset or official statistic for the same population, unit and period (check base, denominator, rounding)');
      if (hasDate) settle.push('a contemporaneous primary record of the date (archive, official chronology)');
      if (rep) settle.push('the original statement by ' + (rep.modality.source || 'the cited source') + ', in full context');
      if (vague) settle.push('the identity of the unnamed experts or studies; until then the claim cannot be checked');
      if (/superlative/.test(f.join())) settle.push('the full comparison set and time frame behind the superlative');
      if (/causal/.test(f.join())) settle.push('evidence from a design able to show causation (randomised or quasi-experimental); an association alone does not settle a causal claim');
      if (!settle.length) settle.push('an independent primary source for the named facts');
      var q = keyQuery(t, ents);
      items.push({ unit: u.id, text: t, score: Math.round(sc * 10) / 10, features: f, settle: settle, query: q, links: S.searchLinks(q),
        conflicts: obsUnits[u.id] || [], arithmetic: ar, source: rep ? rep.modality.source : null, vague: vague });
    });
    items.sort(function (a, b) { return b.score - a.score; });
    return { method: 'Check-worthiness: hand-set feature score (quantities, dates, entities, comparisons, causal and attributed claims; minus opinion and hypotheses). Engine findings (contradictions, arithmetic) raise priority.',
      items: items.slice(0, 40), total: items.length, arithmetic: arith || [] };
  };

  // ── paper review ──
  var SECTIONS = [
    ['abstract', /^(?:#+\s*)?abstract\b/im], ['introduction', /^(?:#+\s*)?(?:\d+\.?\s*)?introduction\b/im], ['methods', /^(?:#+\s*)?(?:\d+\.?\s*)?(?:methods?|materials and methods|methodology|study design|experimental (?:setup|design))\b/im],
    ['results', /^(?:#+\s*)?(?:\d+\.?\s*)?results?\b/im], ['discussion', /^(?:#+\s*)?(?:\d+\.?\s*)?discussion\b/im], ['conclusion', /^(?:#+\s*)?(?:\d+\.?\s*)?conclusions?\b/im],
    ['limitations', /^(?:#+\s*)?(?:\d+\.?\s*)?(?:limitations?|strengths and limitations)\b|\b(?:a |one |main |key |several )?limitations? of (?:this|the|our) (?:study|work|analysis)\b|\bthis study has (?:several |some )?limitations\b/im],
    ['references', /^(?:#+\s*)?(?:references|bibliography|works cited|literature cited|källor|referenser)\b/im]
  ];
  var STATEMENTS = [
    ['preregistration', /\b(?:pre-?regist(?:ered|ration)|registered report|aspredicted|osf\.io\/\w+|clinicaltrials\.gov|NCT\d{8}|PROSPERO|CRD\d{8,}|ISRCTN\d+|trial registration)\b/i],
    ['data availability', /\b(?:data (?:are|is) (?:openly |publicly |freely )?available|data availability|available (?:up)?on (?:reasonable )?request|datasets? (?:generated|analy[sz]ed)[^.]{0,80}available|zenodo|dryad|figshare|osf\.io|openneuro|dataverse)\b/i],
    ['code availability', /\b(?:code (?:is|are) (?:openly |publicly |freely )?available|code availability|github\.com|gitlab\.com|bitbucket\.org|software availability|analysis scripts?)\b/i],
    ['ethics approval', /\b(?:ethic(?:s|al) (?:committee|approval|review board)|institutional review board|IRB|informed consent|helsinki|etikprövning|ethics (?:statement|declaration))\b/i],
    ['conflicts of interest', /\b(?:conflicts? of interest|competing interests?|declaration of interests?|disclosures?)\b/i],
    ['funding', /\b(?:funding|funded by|grant (?:no\.?|number)|supported by (?:a |the )?(?:grant|national|foundation|council)|financial support)\b/i],
    ['power analysis', /\b(?:power analysis|a priori power|statistical power|g\*power|sample size (?:calculation|justification|was determined))\b/i],
    ['effect sizes', /\b(?:cohen'?s d|hedges'? g|\bd\s*=\s*-?\d|\bg\s*=\s*-?\d|η2|η²|eta[- ]squared|partial η|ω2|ω²|omega[- ]squared|R2\s*=|R²\s*=|odds ratio|\bOR\s*=|hazard ratio|\bHR\s*=|relative risk|\bRR\s*=|cram[eé]r'?s v|effect size)\b/i],
    ['confidence intervals', /\b(?:\d{2}\s?%\s?CI|confidence intervals?|credible intervals?|\bCI\s*[=:\[]|\[\s*-?\d+\.?\d*\s*,\s*-?\d+\.?\d*\s*\])/i],
    ['blinding', /\b(?:double-?blind|single-?blind|blinded|masked (?:assessors?|outcome))\b/i]
  ];
  var DESIGNS = [
    ['randomised controlled trial', /\b(?:randomi[sz]ed (?:controlled )?(?:trial|experiment)|RCT|randomly assigned|random assignment|randomi[sz]ation)\b/i, 'experimental'],
    ['experiment', /\b(?:experiment(?:al)? (?:condition|group|manipulation)|between-subjects|within-subjects|we manipulated|control condition)\b/i, 'experimental'],
    ['quasi-experiment / natural experiment', /\b(?:quasi-experiment(?:al)?|natural experiment|difference-in-differences|regression discontinuity|instrumental variables?|synthetic control)\b/i, 'quasi'],
    ['cohort / longitudinal', /\b(?:cohort study|prospective|longitudinal|follow-up of|panel data)\b/i, 'observational'],
    ['case-control', /\bcase-control\b/i, 'observational'],
    ['cross-sectional / survey', /\b(?:cross-sectional|survey|questionnaire|poll(?:ed)?)\b/i, 'observational'],
    ['correlational / observational', /\b(?:correlational|observational (?:study|data)|we observed an? (?:association|correlation)|association between)\b/i, 'observational'],
    ['meta-analysis / systematic review', /\b(?:meta-analys[ie]s|systematic review|PRISMA)\b/i, 'synthesis'],
    ['qualitative', /\b(?:qualitative|semi-structured interviews?|thematic analysis|grounded theory|focus groups?)\b/i, 'qualitative'],
    ['simulation / modelling', /\b(?:simulations?|agent-based|monte carlo|computational model|we model(?:led|ed)?)\b/i, 'model'],
    ['case report', /\b(?:case report|case study|case series)\b/i, 'observational'],
    ['preprint (not peer reviewed)', /\b(?:preprint|not (?:yet )?peer[- ]reviewed|arxiv|biorxiv|medrxiv|psyarxiv|ssrn)\b/i, 'status']
  ];
  var OVER = /\b(?:prove[sn]?|proof that|conclusively|definitive(?:ly)?|breakthrough|paradigm[- ]shift|for the first time|first (?:ever )?(?:study|evidence|demonstration)|unprecedented|revolutionary|game[- ]changer|clearly (?:demonstrates?|shows?|establish(?:es)?)|undeniabl[ey]|beyond (?:any )?doubt|settles? the (?:debate|question)|cures?)\b/gi;
  var CAUSAL_STRONG = /\b(?:caus(?:es|ed|ing)|causes|leads? to|led to|results? in|resulted in|(?:the )?(?:causal )?effect of|impact of|drives|prevents|protects? against|improves|reduces|increases|boosts|makes (?:people|participants|patients))\b/i;

  function refsBlock(text) {
    var m = text.match(/^(?:#+\s*)?(?:references|bibliography|works cited|literature cited|källor|referenser)\b.*$/im); if (!m) return null;
    var rest = text.slice(m.index + m[0].length), end = rest.search(/^#+\s|\n(?:appendix|supplementary|acknowledg)/im);
    var block = end > 0 ? rest.slice(0, end) : rest;
    var lines = block.split(/\n+/).map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 25; });
    return lines;
  }
  S.paperReview = function (text, R, I) {
    var units = R.units.filter(function (u) { return !u.heading && !u.refs; });
    var sec = {}; SECTIONS.forEach(function (s) { sec[s[0]] = s[1].test(text); });
    var st = {}; STATEMENTS.forEach(function (s) { var m = text.match(s[1]); st[s[0]] = m ? m[0] : null; });
    var designs = DESIGNS.filter(function (d) { return d[1].test(text); }).map(function (d) { return { name: d[0], cls: d[2] }; });
    var exp = designs.some(function (d) { return d.cls === 'experimental' || d.cls === 'quasi'; }), obs = designs.some(function (d) { return d.cls === 'observational'; });
    var nsz = []; (text.match(/\b[nN]\s*=\s*\d{1,3}(?:,\d{3})*\b|\b\d{1,3}(?:,\d{3})* (?:participants|subjects|patients|respondents|children|adults|students|mice|rats|animals|cases|controls)\b/g) || []).forEach(function (s) { var v = +s.replace(/[^\d]/g, ''); if (v > 0) nsz.push({ text: s, n: v }); });
    var causal = [];
    if (obs && !exp) units.forEach(function (u) { var t = u.cleanText || u.text; if (CAUSAL_STRONG.test(t) && !/\b(?:may|might|could|possibly|associated|association|correlat)/i.test(t)) causal.push({ unit: u.id, text: t, cue: t.match(CAUSAL_STRONG)[0] }); });
    var over = []; units.forEach(function (u) { var t = u.cleanText || u.text, m = t.match(OVER); if (m) over.push({ unit: u.id, text: t, cues: Array.from(new Set(m.map(function (x) { return x.toLowerCase(); }))) }); });
    var limits = units.filter(function (u) { return /\blimitations?\b|\bcaveats?\b|\bshould be interpreted with caution\b/i.test(u.text); }).map(function (u) { return u.id; });
    var refs = refsBlock(text), refInfo = null;
    if (refs && refs.length) {
      var yrs = refs.map(function (l) { var m = l.match(/\b(?:19|20)\d\d\b/g); return m ? Math.max.apply(null, m.map(Number).filter(function (y) { return y <= new Date().getFullYear() + 1; })) : null; }).filter(function (y) { return y && isFinite(y); }).sort();
      var now = new Date().getFullYear(), med = yrs.length ? yrs[Math.floor(yrs.length / 2)] : null;
      refInfo = { n: refs.length, withYear: yrs.length, median: med, newest: yrs.length ? yrs[yrs.length - 1] : null, oldest: yrs[0] || null,
        olderThan10: yrs.filter(function (y) { return now - y > 10; }).length, withDoi: refs.filter(function (l) { return /\b10\.\d{4,9}\//.test(l); }).length };
    }
    var sc = S.statcheck ? S.statcheck(text) : [], grim = S.grim ? S.grim(text) : [], pp = S.pProfile ? S.pProfile(text) : null;
    var paperness = ['abstract', 'methods', 'results', 'discussion', 'references'].filter(function (k) { return sec[k]; }).length + (sc.length ? 1 : 0) + (pp && pp.n ? 1 : 0);
    var flags = [];
    var bad = sc.filter(function (s) { return /inconsistent|decision/.test(s.status); });
    if (bad.length) flags.push({ sev: bad.some(function (s) { return s.status === 'decision error'; }) ? 'high' : 'medium', text: bad.length + ' of ' + sc.length + ' reported test results do not match their recomputed p-values' });
    var gi = grim.filter(function (g) { return g.status === 'inconsistent'; }); if (gi.length) flags.push({ sev: 'medium', text: gi.length + ' mean(s) fail the GRIM test (if the data are single integer items)' });
    if (pp) pp.flags.forEach(function (f) { flags.push({ sev: 'low', text: f }); });
    if (causal.length && paperness >= 3) flags.push({ sev: 'medium', text: causal.length + ' sentence(s) use causal language in a non-experimental design' });
    if (over.length && paperness >= 3) flags.push({ sev: 'low', text: over.length + ' sentence(s) use overclaiming vocabulary' });
    if (paperness >= 3) {
      if (!st['effect sizes'] && pp && pp.n) flags.push({ sev: 'medium', text: 'p-values are reported but no effect sizes were found' });
      if (!st['confidence intervals'] && pp && pp.n) flags.push({ sev: 'low', text: 'no confidence or credible intervals were found' });
      if (!sec.limitations && !limits.length) flags.push({ sev: 'low', text: 'no limitations section or limitations statement was found' });
      if (!st['data availability']) flags.push({ sev: 'low', text: 'no data-availability statement was found' });
      if (!st['conflicts of interest']) flags.push({ sev: 'low', text: 'no conflict-of-interest statement was found' });
      if (exp && !st.preregistration) flags.push({ sev: 'low', text: 'experimental design without a preregistration or trial-registration reference' });
      var small = nsz.filter(function (x) { return x.n < 30; }); if (small.length && !st['power analysis']) flags.push({ sev: 'low', text: 'small samples (' + small.map(function (x) { return x.text; }).slice(0, 3).join('; ') + ') without a power analysis' });
    }
    if (designs.some(function (d) { return d.cls === 'status'; })) flags.push({ sev: 'info', text: 'the text identifies itself as, or cites, preprint material' });
    return { method: 'Reporting checklist and numerical re-checks. Absence of a statement means it was not found in the pasted text, which may be incomplete.',
      paperness: paperness, sections: sec, statements: st, designs: designs, sampleSizes: nsz.slice(0, 30), causal: causal.slice(0, 20), overclaim: over.slice(0, 20), limitationUnits: limits,
      refs: refInfo, statcheck: sc, grim: grim, pProfile: pp, flags: flags };
  };

  // ── Crossref (browser, optional) ──
  // Returns {doi, ok, title, container, year, type, notices:[...], titleMatch} per DOI; nearbyText = text around the DOI.
  S.crossrefCheck = function (dois, text, fetchFn) {
    fetchFn = fetchFn || (typeof fetch !== 'undefined' ? fetch : null); if (!fetchFn) return Promise.resolve([]);
    var near = function (doi) { var i = text.toLowerCase().indexOf(doi.toLowerCase()); return i < 0 ? '' : text.slice(Math.max(0, i - 400), i + 50); };
    var cw = function (s) { return new Set(W(s).map(function (w) { return w.toLowerCase(); }).filter(function (w) { return !STOP.has(w) && w.length > 3; })); };
    return Promise.all(dois.slice(0, 25).map(function (doi) {
      return fetchFn('https://api.crossref.org/works/' + encodeURIComponent(doi)).then(function (r) { if (!r.ok) return { doi: doi, ok: false, status: r.status }; return r.json().then(function (j) {
        var m = j.message || {}, title = (m.title || [])[0] || '', notices = [];
        ['update-to', 'updated-by'].forEach(function (k) { (m[k] || []).forEach(function (u) { notices.push({ rel: k, type: u.type || u.label || 'update', doi: u.DOI || '' }); }); });
        if (m.relation) Object.keys(m.relation).forEach(function (k) { if (/retract|correct|concern|withdraw/i.test(k)) (m.relation[k] || []).forEach(function (x) { notices.push({ rel: 'relation', type: k, doi: x.id || '' }); }); });
        var tw = cw(title), nw = cw(near(doi)), hit = 0; tw.forEach(function (w) { if (nw.has(w)) hit++; });
        var y = ((m.issued || {})['date-parts'] || [[null]])[0][0];
        return { doi: doi, ok: true, title: title, container: (m['container-title'] || [])[0] || '', year: y, type: m.type || '', cited: m['is-referenced-by-count'], notices: notices,
          titleMatch: tw.size ? Math.round(100 * hit / tw.size) : null, nearbyChecked: !!near(doi) };
      }); }).catch(function (e) { return { doi: doi, ok: false, status: 'network' }; });
    }));
  };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
(function (S) {
  // One call for the UI: rhetoric + fact-check + paper review.
  S.discourse = function (text, R, I) {
    var rh = S.rhetoric(text, R, I), ar = S.arithmetic(text);
    return { rhetoric: rh, factcheck: S.factcheck(text, R, I, ar), paper: S.paperReview(text, R, I), arguments: S.argumentMaps ? S.argumentMaps(R, I, rh) : null };
  };
})(SA2);
