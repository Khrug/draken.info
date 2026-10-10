// ═══ SA2 RHETORIC ═══ discourse-level descriptors of a text: sentiment (VADER), loaded language,
// political framing vocabulary, sources and links, stance/disposition (after Hyland 2005), fallacy and
// rhetorical-device candidates, logos/ethos/pathos marker rates, and an Ishikawa (fishbone) map of the
// reasoning around a thesis.
// Status of each tool: VADER is a published, validated method (Hutto & Gilbert 2014) and the port is
// checked for parity against the reference package. Everything else is transparent cue matching on
// curated lists written for this tool; outputs are candidates with their evidence, not verdicts, and
// the lists are not validated against annotated data. English only.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : (typeof require !== 'undefined' ? require('./engine-math.js') : {});
(function (S) {
  var W = function (s) { return (s.match(/[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*/g) || []); };
  var rx = function (list) { return new RegExp('\\b(?:' + list.join('|') + ')\\b', 'gi'); };
  function hitsIn(text, re) { re.lastIndex = 0; var out = [], m; while ((m = re.exec(text))) { out.push({ m: m[0], at: m.index }); if (m.index === re.lastIndex) re.lastIndex++; } return out; }
  var per1k = function (n, words) { return words ? Math.round(10000 * n / words) / 10 : 0; };

  // ── curated lists (documented in README; edit here) ──
  var LOADED = ['regime', 'junta', 'cabal', 'puppets?', 'elites?', 'globalists?', 'thugs?', 'mob', 'hordes?', 'invasion', 'infest(?:ed|ation)?', 'plague', 'swarm(?:ing)?',
    'so-called', 'propaganda', 'brainwash(?:ed|ing)?', 'sheeple', 'cover-?up', 'hoax', 'scam', 'fake news', 'lies', 'liars?', 'traitors?', 'treason(?:ous)?', 'evil',
    'radicals?', 'extremists?', 'fanatics?', 'zealots?', 'woke', 'snowflakes?', 'groomers?', 'fascists?', 'nazis?', 'commies', 'libtards?',
    'shocking', 'outrageous', 'disgraceful', 'disgusting', 'bombshell', 'explosive', 'slams?', 'blasts?', 'destroys?', 'obliterates?', 'eviscerates?',
    'slaughter(?:ed)?', 'massacre(?:d)?', 'catastroph(?:e|ic)', 'apocalyptic', 'unprecedented', 'skyrocket(?:ing|ed|s)?', 'plummet(?:ing|ed|s)?', 'crisis', 'chaos', 'agenda', 'scheme', 'conspiracy'];
  var ABSOLUTES = ['always', 'never', 'everyone', 'everybody', 'nobody', 'no one', 'nothing', 'everything', 'completely', 'totally', 'entirely', 'undeniably', 'unquestionably', 'obviously', 'of course', 'without exception', 'all of them', 'none of them'];
  // Framing vocabulary conventionally associated with partisan usage in (mainly US/UK) English discourse.
  // Method family: phrase-frequency slant (Gentzkow & Shapiro 2010, Econometrica 78(1)); this list is curated, not theirs.
  var FRAME_R = ['illegal aliens?', 'illegals', 'death tax', 'pro-life', 'partial-birth abortion', 'unborn (?:child|children|baby|babies)', 'gun rights', 'second amendment rights', 'job creators',
    'government takeover', 'tax relief', 'big government', 'nanny state', 'socialized medicine', 'climate alarmis[mt]s?', 'globalists?', 'open borders', 'religious (?:liberty|freedom)', 'law and order',
    'mass immigration', 'welfare (?:queens?|dependency)', 'virtue signal(?:l?ing)?', 'cancel culture', 'radical left', 'far-left', 'deep state', 'mainstream media', 'legacy media', 'woke', 'gender ideology', 'traditional values', 'family values', 'border crisis', 'election integrity'];
  var FRAME_L = ['undocumented (?:immigrants?|migrants?|workers?)', 'estate tax', 'pro-choice', 'reproductive (?:rights|health|freedom)', 'gun violence', 'gun safety', 'common-sense gun', 'tax breaks for the (?:rich|wealthy)',
    'the (?:1|one) ?(?:%|percent)', 'corporate greed', 'climate (?:crisis|emergency|justice)', 'social justice', 'systemic racism', 'structural racism', 'marginali[sz]ed (?:groups?|communities)', 'income inequality',
    'living wage', 'far-right', 'white supremac(?:y|ist)', 'voter suppression', 'trickle-down', 'billionaire class', 'late-stage capitalism', "workers'? rights", 'climate deniers?', 'gender-affirming', 'equity', 'decoloni[sz](?:e|ing|ation)', 'anti-racist', 'people of colou?r'];
  var VAGUE = ['experts? (?:say|says|agree|believe|warn|claim)', 'scientists (?:say|agree|believe|warn)', 'studies (?:show|have shown|suggest|prove)', 'research (?:shows|has shown|suggests|proves)',
    'sources (?:say|said|claim)', 'some (?:people|say|argue|believe|claim)', 'many (?:people|say|believe|argue|claim)', 'critics (?:say|argue|claim)', 'it is (?:said|believed|widely believed|known|claimed|reported)',
    'it has been (?:said|suggested|reported|claimed)', 'according to (?:reports|sources|experts|some)', 'people are saying', 'they say', 'officials (?:say|said)', 'observers (?:say|note)'];
  // Metadiscourse after Hyland (2005), Metadiscourse: Exploring Interaction in Writing. Lists curated here.
  var HEDGES = ['may', 'might', 'could', 'perhaps', 'possibly', 'possible', 'likely', 'unlikely', 'probably', 'probable', 'suggests?', 'suggested', 'appears?', 'appeared', 'seems?', 'seemed', 'apparently',
    'approximately', 'roughly', 'relatively', 'somewhat', 'tends? to', 'in general', 'generally', 'arguably', 'presumably', 'unclear', 'uncertain', 'i think', 'i believe', 'we believe', 'to some extent', 'in part', 'largely', 'often', 'sometimes', 'plausibly', 'tentatively'];
  var BOOSTERS = ['clearly', 'obviously', 'certainly', 'definitely', 'undoubtedly', 'of course', 'indeed', 'in fact', 'always', 'never', 'proves?', 'proven', 'demonstrates?', 'demonstrated', 'shows? that',
    'it is evident', 'evidently', 'without (?:a )?doubt', 'undeniably', 'surely', 'beyond doubt', 'must be', 'certain', 'conclusively', 'establishe[sd] that', 'no doubt', 'truly', 'really', 'absolutely'];
  var ATTITUDE = ['unfortunately', 'fortunately', 'surprisingly', 'remarkably', 'importantly', 'interestingly', 'hopefully', 'admittedly', 'sadly', 'shockingly', 'strikingly', 'regrettably', 'disappointingly', 'curiously', 'ironically', 'tragically', 'alarmingly', 'crucially', 'notably'];
  var DEONTIC = ['must', 'should', 'ought to', 'need to', 'needs to', 'have to', 'has to', 'it is (?:essential|necessary|imperative|vital) (?:that|to)'];
  var IMPERATIVE_START = /^(?:consider|note|imagine|remember|look|think|ask|stop|join|act|read|see|compare|let(?:'s| us)?|take|don't|do not|never|try|watch|listen|wake up|share|vote|demand|refuse|resist)\b/i;
  // inferential connectives only; words such as "evidence" or "proves" are claims about support, not support, and count as boosters
  var CAUSAL = ['because', 'therefore', 'thus', 'hence', 'consequently', 'as a result', 'so that', 'implies', 'it follows', 'due to', 'caused by', 'given that', 'whereas', 'in contrast', 'on the other hand', 'for example', 'for instance', 'compared with', 'compared to'];
  var MEASURE = ['measured', 'sample(?:d|s)?', 'experiment(?:s|al)?', 'survey(?:ed)?', 'dataset', 'statistic(?:s|al(?:ly)?)?', 'estimate[sd]?', 'per ?cent', 'percent', 'median', 'average', 'standard deviation', 'confidence interval', 'regression', 'controlled', 'randomi[sz]ed'];
  var CRED = ['dr\\.?', 'prof\\.?', 'professor', 'ph\\.?d', 'phd', 'researchers?', 'expert', 'institute', 'university', 'peer-reviewed', 'years of experience', 'as an? (?:doctor|scientist|engineer|researcher|physician|lawyer|economist|historian)',
    'i have (?:worked|studied|spent|researched)', 'honest(?:ly|y)?', 'trust(?:worthy)?', 'credible', 'reliable', 'integrity', 'transparen(?:t|cy)', 'in my experience', 'qualified', 'certified', 'official'];
  var EMOTION = { fear: ['fear', 'afraid', 'terrif(?:ied|ying)', 'threat(?:s|ens|ened)?', 'danger(?:ous)?', 'terror', 'panic', 'scared', 'frightening', 'alarming', 'nightmare', 'deadly', 'lethal', 'menace'],
    anger: ['outrage(?:d|ous)?', 'furious', 'anger', 'angry', 'rage', 'disgrace(?:ful)?', 'betray(?:al|ed)?', 'unacceptable', 'infuriating', 'scandal(?:ous)?', 'shameful', 'disgust(?:ing)?'],
    hope: ['hope', 'hopeful', 'dream', 'together', 'future', 'proud', 'pride', 'inspire[sd]?', 'inspiring', 'courage', 'freedom', 'heal(?:ing)?'],
    sadness: ['grief', 'grieve', 'tragic', 'tragedy', 'heartbreaking', 'mourn(?:ing)?', 'suffer(?:ing|ed)?', 'loss', 'devastat(?:ed|ing)', 'despair'] };
  var SCARE = /^(?:experts?|science|scientists?|facts?|news|journalists?|journalism|democracy|freedom|evidence|research|researchers|truth|elections?|justice|peace|reforms?|studies|study|data|education|progress|tolerance|diversity|equality|liberals?|conservatives?|leaders?|victims?|refugees?|journalism|independent|neutral|objective|consensus|analysis|analysts?|fact-checkers?|safety|security|help|care|protection|mistakes?|errors?)$/i;
  var VAGUE_SRC = /^(?:(?:some|many|most|several|other|unnamed|anonymous|independent|leading|top|the)\s+)?(?:experts?|scientists?|sources?|critics?|officials?|observers?|analysts?|studies|research(?:ers)?|reports?|people|they|some|many|insiders?|doctors?|commentators?)$/i;
  var STOPF = new Set('the a an it this that these those there here and or but of in on at to for with as is are was were be been i we you he she they his her its our their my your not no'.split(' '));

  var FALLACIES = [
    { id: 'ad-hominem', name: 'Ad hominem', def: 'Attacks the person instead of the argument.', re: /\b(?:(?:he|she|they|you)(?:'re| are| is)? (?:just |simply |nothing but )?(?:an? )?(?:idiot|moron|liar|clown|fool|hypocrite|imbecile|shill|grifter|crook)s?|(?:idiots?|morons?|clowns?|imbeciles?|shills?|grifters?) (?:like|who)|who cares what (?:he|she|they) (?:says?|thinks?))\b/gi },
    { id: 'tu-quoque', name: 'Whataboutism / tu quoque', def: 'Deflects criticism by pointing to the other side’s conduct.', re: /\b(?:what about (?:the|their|his|her|when)|(?:they|you|he|she) (?:did|do|does) (?:it|that|the same) too|you(?:'re| are) one to talk|look who(?:'s| is) talking)\b/gi },
    { id: 'bandwagon', name: 'Bandwagon', def: 'Treats popularity as evidence.', re: /\b(?:(?:everyone|everybody) (?:knows|agrees|is (?:saying|talking))|millions of (?:people|americans|swedes|voters) (?:can't|cannot) be wrong|most people (?:agree|believe|know)|it is common knowledge|join the (?:millions|movement)|the whole world (?:knows|agrees))\b/gi },
    { id: 'vague-authority', name: 'Unnamed authority', def: 'Appeals to experts or studies without saying which.', re: rx(['experts? (?:say|says|agree|confirm|warn)', 'scientists (?:say|agree|confirm)', 'studies (?:show|prove|have shown|confirm)', 'research (?:shows|proves|confirms)', 'doctors (?:say|agree|warn)']), needsNoSource: true },
    { id: 'false-dilemma', name: 'False dilemma', def: 'Presents two options as the only ones.', re: /\b(?:you(?:'re| are) (?:either )?with us or (?:against|with) |(?:only|just) two (?:options|choices|ways|possibilities)|there (?:is|are) no (?:other|third|middle) (?:option|way|choice|ground)|either (?:we|you) [^.,;]{3,60} or (?:we|you|they) )/gi },
    { id: 'slippery-slope', name: 'Slippery slope', def: 'Claims a first step will inevitably lead to an extreme outcome.', re: /\b(?:(?:will|would) (?:inevitably|eventually|ultimately|soon) (?:lead|result) (?:to|in)|(?:next|before long|soon enough),? (?:they|we|you)(?:'ll| will)|where (?:does|will) it (?:end|stop)|open(?:s|ing)? the (?:flood ?)?gates?|thin end of the wedge)\b/gi },
    { id: 'generalization', name: 'Sweeping generalisation', def: 'Ascribes a trait to a whole group.', re: /\b(?:all|every|no) (?:\w+ )?(?:men|women|immigrants|migrants|muslims|christians|jews|politicians|scientists|journalists|liberals|conservatives|leftists|rightists|americans|swedes|russians|refugees|people from \w+)\b (?:are|is|always|never|want|hate)\b/gi },
    { id: 'post-hoc', name: 'Post hoc', def: 'Infers causation from sequence alone.', re: /\b(?:ever since|right after|shortly after|since)\b[^.;]{3,80}\b(?:(?:has|have) (?:increased|risen|fallen|decreased|doubled|tripled|skyrocketed|exploded|plummeted|gone (?:up|down))|(?:began|started) to (?:rise|fall|increase|decline))\b/gi },
    { id: 'fear', name: 'Appeal to fear', def: 'Uses threatened consequences instead of evidence.', re: /\b(?:before it(?:'s| is) too late|(?:destroy|end) (?:our|the) (?:country|nation|way of life|civilisation|civilization|children|future)|your (?:children|family|kids) (?:are|is|will be) (?:at risk|in danger|next)|(?:if|unless) we (?:don't|do not)? ?(?:act|stop)[^.]{0,40} (?:we|you) (?:will|could) (?:die|lose everything|be destroyed|perish))\b/gi },
    { id: 'nature', name: 'Appeal to nature', def: 'Treats “natural” as good or “unnatural” as bad.', re: /\b(?:because it(?:'s| is) (?:natural|unnatural)|(?:natural|unnatural)(?:,| and)? (?:therefore|so|thus|hence) |it(?:'s| is) (?:simply |just )?(?:not )?natural,? (?:so|therefore))/gi },
    { id: 'tradition', name: 'Appeal to tradition', def: 'Treats age or custom as justification.', re: /\b(?:(?:has|have) always been (?:done )?(?:this|that) way|the way (?:it|things) (?:has|have) always been|for (?:centuries|generations|thousands of years)[^.]{0,40}\b(?:so|therefore|thus|should|must))\b/gi },
    { id: 'ignorance', name: 'Appeal to ignorance', def: 'Treats absence of disproof as proof.', re: /\b(?:(?:no one|nobody) (?:has|can|could) (?:ever )?(?:prove[dn]?|disprove[dn]?|show[n]?)(?: that)?(?: it| this)? ?(?:is |isn't |was )?(?:wrong|false|true|otherwise)?|(?:can(?:not|'t)|could(?:n't| not)) be (?:disproven|disproved|ruled out)[^.]{0,40}\b(?:so|therefore|thus|must))/gi },
    { id: 'loaded-question', name: 'Loaded question', def: 'A question that presupposes a contested claim.', re: /(?:^|[.!?]\s+)(?:why|when) (?:did|do|does|will|has|have) (?:you|he|she|they|the \w+) (?:stop|start|keep|continue|still|finally)\b[^?]*\?/gi },
    { id: 'straw-man', name: 'Straw man (cue)', def: 'Restates an opponent’s position in an extreme form.', re: /\b(?:so (?:you're|you are|they're|they are|he's|she's) (?:saying|telling us)|(?:they|critics|opponents|the left|the right|liberals|conservatives) (?:just )?wants? (?:to )?(?:destroy|abolish|ban|take away|eliminate|control) (?:all|every|our|your|everything))\b/gi },
    { id: 'anecdotal', name: 'Anecdotal evidence', def: 'Generalises from a personal story.', re: /\b(?:i know (?:someone|a (?:guy|man|woman|person|family))|my (?:friend|neighbou?r|cousin|uncle|aunt|brother|sister|mother|father|colleague)(?:'s \w+)? (?:who|got|had|took|was|said))\b/gi }
  ];

  // ── domains ──
  var DOM = [
    ['scholarly', /(^|\.)(doi\.org|arxiv\.org|ncbi\.nlm\.nih\.gov|pubmed\.ncbi\.nlm\.nih\.gov|jstor\.org|springer\.com|nature\.com|science\.org|sciencedirect\.com|wiley\.com|tandfonline\.com|sagepub\.com|plos\.org|frontiersin\.org|mdpi\.com|ieee\.org|acm\.org|ssrn\.com|zenodo\.org|osf\.io|biorxiv\.org|medrxiv\.org|semanticscholar\.org|cambridge\.org|oup\.com|academic\.oup\.com|cell\.com|thelancet\.com|bmj\.com|nejm\.org|pnas\.org|aps\.org|iop\.org|researchgate\.net|philpapers\.org|scholar\.google\.com|orcid\.org)$|\.edu$|\.ac\.[a-z]{2}$|(^|\.)uni-[a-z-]+\.de$/],
    ['government', /\.gov(\.[a-z]{2})?$|\.gouv\.fr$|\.gc\.ca$|\.mil$|(^|\.)(europa\.eu|un\.org|who\.int|oecd\.org|worldbank\.org|imf\.org|nato\.int|riksdagen\.se|regeringen\.se|government\.se|scb\.se|folkhalsomyndigheten\.se|polisen\.se|valmyndigheten\.se|stat\.fi|eduskunta\.fi|valtioneuvosto\.fi|bundestag\.de|parliament\.uk|legislation\.gov\.uk)$/],
    ['reference', /(^|\.)(wikipedia\.org|wikidata\.org|wikimedia\.org|britannica\.com|plato\.stanford\.edu|merriam-webster\.com|oed\.com|ne\.se|saob\.se)$/],
    ['news', /(^|\.)(reuters\.com|apnews\.com|bbc\.co\.uk|bbc\.com|nytimes\.com|washingtonpost\.com|theguardian\.com|ft\.com|economist\.com|bloomberg\.com|wsj\.com|npr\.org|cnn\.com|foxnews\.com|aljazeera\.com|politico\.com|politico\.eu|axios\.com|lemonde\.fr|spiegel\.de|zeit\.de|svt\.se|sverigesradio\.se|sr\.se|dn\.se|svd\.se|gp\.se|aftonbladet\.se|expressen\.se|yle\.fi|hs\.fi|nrk\.no|dr\.dk|afp\.com|dw\.com|france24\.com|abc\.net\.au|cbc\.ca|time\.com|newsweek\.com|theatlantic\.com|newyorker\.com|vox\.com|nbcnews\.com|cbsnews\.com|abcnews\.go\.com|usatoday\.com|latimes\.com|independent\.co\.uk|telegraph\.co\.uk|thetimes\.co\.uk|dailymail\.co\.uk|nypost\.com|breitbart\.com|rt\.com|sputniknews\.com)$/],
    ['social / video', /(^|\.)(twitter\.com|x\.com|facebook\.com|fb\.com|instagram\.com|tiktok\.com|youtube\.com|youtu\.be|reddit\.com|t\.me|telegram\.org|telegram\.me|rumble\.com|bitchute\.com|gab\.com|truthsocial\.com|vk\.com|threads\.net|linkedin\.com|bsky\.app|mastodon\.social|odysee\.com|4chan\.org|discord\.(gg|com))$/],
    ['blog / self-published', /(^|\.)(substack\.com|medium\.com|wordpress\.com|blogspot\.com|tumblr\.com|ghost\.io|wixsite\.com|weebly\.com|blogger\.com|github\.io|notion\.site|hashnode\.dev|livejournal\.com)$/],
    ['archive', /(^|\.)(archive\.org|web\.archive\.org|archive\.today|archive\.ph|archive\.is|archive\.li|perma\.cc|ghostarchive\.org)$/],
    ['link shortener', /(^|\.)(bit\.ly|t\.co|tinyurl\.com|goo\.gl|ow\.ly|buff\.ly|is\.gd|rb\.gy|shorturl\.at|cutt\.ly|lnkd\.in|dlvr\.it)$/]
  ];
  function domainClass(host) { for (var i = 0; i < DOM.length; i++) if (DOM[i][1].test(host)) return DOM[i][0]; return 'other'; }

  function sourcesOf(text) {
    var urls = [], seen = {};
    var re = /\bhttps?:\/\/[^\s<>()\[\]"'`]+[^\s<>()\[\]"'`.,;:!?]/gi, m;
    while ((m = re.exec(text))) { var u = m[0]; if (seen[u]) { seen[u].n++; continue; } var host = ''; try { host = new URL(u).hostname.toLowerCase().replace(/^www\./, ''); } catch (e) { continue; }
      seen[u] = { url: u, host: host, cls: domainClass(host), https: /^https:/i.test(u), at: m.index, n: 1 }; urls.push(seen[u]); }
    var dois = Array.from(new Set((text.match(/\b10\.\d{4,9}\/[^\s"<>]+[^\s"<>.,;:)\]]/g) || []).map(function (d) { return d.toLowerCase(); })));
    var arxiv = Array.from(new Set(text.match(/\barXiv:\s?\d{4}\.\d{4,5}(?:v\d+)?\b/gi) || []));
    var isbn = Array.from(new Set(text.match(/\bISBN(?:-1[03])?:?\s?[\d-]{10,17}[\dX]\b/gi) || []));
    var cites = (text.match(/\([A-Z][A-Za-zÀ-ÿ'’-]+(?: (?:et al\.|and|&) [A-Z][A-Za-zÀ-ÿ'’-]+)?,? (?:19|20)\d\d[a-z]?(?:[,;][^)]{0,60})?\)/g) || []).length
      + (text.match(/\[\d+(?:[,–-]\s?\d+)*\]/g) || []).length;
    return { urls: urls, dois: dois, arxiv: arxiv, isbn: isbn, inTextCitations: cites };
  }

  S.rhetoric = function (text, R, I) {
    // Prose units: claim-bearing sentences plus citation-bearing prose (which the consistency layer sets aside),
    // excluding headings, reference sections, repeated boilerplate, markup, tables and math.
    var units = R.units.filter(function (u) { return !u.heading && !u.refs && !u.boilerplate && W(u.text).length >= 3 && !/^\s*[<|\\]|\$\$|\\(?:frac|sum|int|begin|mathbb)\b/.test(u.text); });
    var unitById = {}; R.units.forEach(function (u) { unitById[u.id] = u; });
    var words = 0, wordsByUnit = {};
    units.forEach(function (u) { var n = W(u.text).length; wordsByUnit[u.id] = n; words += n; });
    var out = { words: words, sentences: units.length };

    // ── sentiment ──
    if (S.vader && S.vader.ready()) {
      var arc = [], wsum = 0, pos = 0, neg = 0, neu = 0, ws = {};
      units.forEach(function (u) { var v = S.vader.score(u.text); arc.push({ unit: u.id, c: v.compound, pos: v.pos, neg: v.neg });
        wsum += v.compound; if (v.compound >= 0.05) pos++; else if (v.compound <= -0.05) neg++; else neu++;
        v.words.forEach(function (h) { var k = h.w.toLowerCase().replace(/[^a-z'-]/g, ''); if (!k) return; (ws[k] = ws[k] || { w: k, n: 0, v: 0, units: [] }); ws[k].n++; ws[k].v += h.v; if (ws[k].units.indexOf(u.id) < 0) ws[k].units.push(u.id); }); });
      var sorted = arc.slice().sort(function (a, b) { return a.c - b.c; });
      var wl = Object.keys(ws).map(function (k) { var o = ws[k]; o.v = o.v / o.n; return o; });
      var ent = (I.entities || []).concat(I.concepts || []).slice(0, 60).map(function (e) {
        var cs = arc.filter(function (a) { return (e.units || []).indexOf(a.unit) >= 0; }); if (cs.length < 2) return null;
        var m = cs.reduce(function (s, a) { return s + a.c; }, 0) / cs.length; return { name: e.name, kind: e.kind, mean: Math.round(m * 1000) / 1000, n: cs.length, units: cs.map(function (a) { return a.unit; }) };
      }).filter(Boolean).sort(function (a, b) { return Math.abs(b.mean) - Math.abs(a.mean); });
      out.sentiment = { method: 'VADER 3.3.2 (Hutto & Gilbert 2014), per sentence; thresholds ±0.05', mean: arc.length ? Math.round(1000 * wsum / arc.length) / 1000 : 0,
        share: { pos: pos, neg: neg, neu: neu }, arc: arc, mostNegative: sorted.slice(0, 5).filter(function (a) { return a.c < -0.05; }), mostPositive: sorted.slice(-5).reverse().filter(function (a) { return a.c > 0.05; }),
        topNegWords: wl.filter(function (o) { return o.v < 0; }).sort(function (a, b) { return a.v * a.n - b.v * b.n; }).slice(0, 15),
        topPosWords: wl.filter(function (o) { return o.v > 0; }).sort(function (a, b) { return b.v * b.n - a.v * a.n; }).slice(0, 15), byEntity: ent.slice(0, 20) };
    } else out.sentiment = null;

    // ── per-unit cue scan ──
    var reLoaded = rx(LOADED), reAbs = rx(ABSOLUTES), reR = rx(FRAME_R), reL = rx(FRAME_L), reVague = rx(VAGUE), reH = rx(HEDGES), reB = rx(BOOSTERS), reA = rx(ATTITUDE), reD = rx(DEONTIC),
      reC = rx(CAUSAL), reM = rx(MEASURE), reCred = rx(CRED), reEmo = {}; Object.keys(EMOTION).forEach(function (k) { reEmo[k] = rx(EMOTION[k]); });
    var bag = function () { return { n: 0, terms: {}, units: [] }; };
    var add = function (b, u, hs) { if (!hs.length) return; b.n += hs.length; hs.forEach(function (h) { var k = h.m.toLowerCase(); (b.terms[k] = b.terms[k] || { term: k, n: 0, units: [] }); b.terms[k].n++; if (b.terms[k].units.indexOf(u.id) < 0) b.terms[k].units.push(u.id); }); if (b.units.indexOf(u.id) < 0) b.units.push(u.id); };
    var L = { loaded: bag(), strong: bag(), absolutes: bag(), right: bag(), left: bag(), vague: bag(), hedge: bag(), boost: bag(), attitude: bag(), deontic: bag(), causal: bag(), measure: bag(), cred: bag(),
      fear: bag(), anger: bag(), hope: bag(), sadness: bag() };
    var counts = { we: 0, they: 0, i: 0, you: 0, excl: 0, quest: 0, imperative: 0, future: 0, past: 0, reported: 0, named: 0 };
    var reportedUnits = {}; R.claims.forEach(function (c) { if (c.modality && c.modality.kind === 'reported') { reportedUnits[c.unit] = c.modality.source || true; } });
    var perUnit = {};
    units.forEach(function (u) {
      var t = u.cleanText || u.text, low = t.toLowerCase(), ws = W(t).map(function (w) { return w.toLowerCase(); });
      add(L.loaded, u, hitsIn(t, reLoaded)); add(L.absolutes, u, hitsIn(t, reAbs)); add(L.right, u, hitsIn(t, reR)); add(L.left, u, hitsIn(t, reL));
      var vg = hitsIn(t, reVague); add(L.vague, u, vg);
      add(L.hedge, u, hitsIn(t, reH)); add(L.boost, u, hitsIn(t, reB)); add(L.attitude, u, hitsIn(t, reA)); add(L.deontic, u, hitsIn(t, reD));
      add(L.causal, u, hitsIn(t, reC)); add(L.measure, u, hitsIn(t, reM)); add(L.cred, u, hitsIn(t, reCred)); Object.keys(EMOTION).forEach(function (k) { add(L[k], u, hitsIn(t, reEmo[k])); });
      if (S.vader && S.vader.ready()) { var sh = []; ws.forEach(function (w) { var v = S.vader.lexValue(w); if (v !== null && Math.abs(v) >= 2.5) sh.push({ m: w }); }); add(L.strong, u, sh); }
      ws.forEach(function (w) { if (w === 'we' || w === 'us' || w === 'our' || w === 'ours') counts.we++; else if (w === 'they' || w === 'them' || w === 'their' || w === 'theirs') counts.they++; else if (w === 'i' || w === 'me' || w === 'my' || w === 'mine') counts.i++; else if (w === 'you' || w === 'your' || w === 'yours') counts.you++;
        if (w === 'will' || w === 'shall' || w === "won't" || w === "'ll") counts.future++; if (w === 'was' || w === 'were' || w === 'had' || w === 'did') counts.past++; });
      counts.excl += (t.match(/!/g) || []).length; if (/\?\s*$/.test(t)) counts.quest++;
      if (IMPERATIVE_START.test(t.replace(/^[\s"“'‘(*_-]+/, '')) && !/\?\s*$/.test(t)) counts.imperative++;
      if (reportedUnits[u.id]) { counts.reported++; if (reportedUnits[u.id] !== true && !VAGUE_SRC.test(reportedUnits[u.id]) && !/\d/.test(reportedUnits[u.id])) counts.named++; }
      perUnit[u.id] = { t: t };
    });
    var terms = function (b) { return Object.keys(b.terms).map(function (k) { return b.terms[k]; }).sort(function (a, b2) { return b2.n - a.n; }); };

    // ── loaded language ──
    out.loaded = { method: 'Curated loaded/pejorative terms, absolutes, and VADER words with |valence| ≥ 2.5', per1k: per1k(L.loaded.n + L.strong.n, words),
      loaded: terms(L.loaded), strong: terms(L.strong), absolutes: terms(L.absolutes), absolutesPer1k: per1k(L.absolutes.n, words), unitShare: units.length ? Math.round(100 * new Set(L.loaded.units.concat(L.strong.units)).size / units.length) : 0 };

    // ── political framing vocabulary ──
    var nr = L.right.n, nl = L.left.n;
    out.framing = { method: 'Curated framing-vocabulary lists (English, mainly US/UK usage); phrase-frequency approach after Gentzkow & Shapiro (2010). Quoting or criticising a term counts the same.',
      right: terms(L.right), left: terms(L.left), nRight: nr, nLeft: nl, index: (nr + nl) >= 3 ? Math.round(100 * (nr - nl) / (nr + nl)) / 100 : null, enough: (nr + nl) >= 3,
      reportedShare: (L.right.units.concat(L.left.units)).filter(function (id) { return reportedUnits[id] || /["“”]/.test(unitById[id].text); }).length };

    // ── sources & links ──
    var src = sourcesOf(text), cls = {}; src.urls.forEach(function (u) { cls[u.cls] = (cls[u.cls] || 0) + 1; });
    var persistent = src.dois.length + src.arxiv.length + src.isbn.length + (cls.scholarly || 0) + (cls.archive || 0);
    var named = counts.named, vague = L.vague.n;
    out.sources = { method: 'URL domains by category (no outlet ratings), persistent identifiers, in-text citations, attribution: named source vs vague attribution cue.',
      urls: src.urls, byClass: cls, dois: src.dois, arxiv: src.arxiv, isbn: src.isbn, inTextCitations: src.inTextCitations,
      perKWords: per1k(src.urls.length + src.dois.length + src.arxiv.length + src.inTextCitations, words), persistent: persistent,
      httpsShare: src.urls.length ? Math.round(100 * src.urls.filter(function (u) { return u.https; }).length / src.urls.length) : null,
      opaque: src.urls.filter(function (u) { return u.cls === 'link shortener'; }).length,
      attribution: { reported: counts.reported, named: named, vague: vague, vagueTerms: terms(L.vague), transparency: (named + vague) ? Math.round(100 * named / (named + vague)) : null } };

    // ── disposition / stance ──
    var h = L.hedge.n, b = L.boost.n;
    out.disposition = { method: 'Stance and engagement markers after Hyland (2005); rates per 1,000 words.',
      hedges: per1k(h, words), boosters: per1k(b, words), attitude: per1k(L.attitude.n, words), deontic: per1k(L.deontic.n, words),
      certainty: (h + b) ? Math.round(100 * (b - h) / (h + b)) / 100 : null,
      selfMention: per1k(counts.i, words), inGroup: per1k(counts.we, words), outGroup: per1k(counts.they, words), reader: per1k(counts.you, words),
      usThem: (counts.we + counts.they) ? Math.round(100 * (counts.we - counts.they) / (counts.we + counts.they)) / 100 : null,
      imperatives: counts.imperative, questions: counts.quest, future: per1k(counts.future, words), past: per1k(counts.past, words),
      terms: { hedges: terms(L.hedge).slice(0, 12), boosters: terms(L.boost).slice(0, 12), attitude: terms(L.attitude).slice(0, 10), deontic: terms(L.deontic).slice(0, 10) } };

    // ── fallacy candidates ──
    var fall = [];
    units.forEach(function (u) {
      var t = u.cleanText || u.text;
      FALLACIES.forEach(function (f) { var hs = hitsIn(t, f.re); if (!hs.length) return;
        if (f.needsNoSource && (reportedUnits[u.id] && reportedUnits[u.id] !== true && !VAGUE_SRC.test(reportedUnits[u.id]) || /\(\s*[A-Z][^)]*\d{4}\)|https?:\/\/|\[\d+\]|\b(?:19|20)\d\d\b/.test(t))) return;
        fall.push({ id: f.id, name: f.name, def: f.def, unit: u.id, cue: hs[0].m, text: t, basis: 'cue phrase' }); });
    });
    (R.psi.circ.witnesses || []).forEach(function (w) { var ids = Array.isArray(w) ? w : [w]; fall.push({ id: 'circular', name: 'Circular reasoning', def: 'Premises and conclusion support each other in a loop with no outside ground.', unit: ids[0], units: ids, cue: 'support cycle', text: ids.map(function (id) { return unitById[id] ? unitById[id].text : id; }).join(' → '), basis: 'support graph (Ψ circ)' }); });
    (R.psi.seal.witnesses || []).forEach(function (id) { if (!unitById[id] || !/\b(?:proves?|confirms?|(?:is|are) (?:itself |themselves )?(?:the )?(?:evidence|proof)|evidence (?:of|for)|only shows)\b/i.test(unitById[id].text)) return; fall.push({ id: 'self-sealing', name: 'Self-sealing (appeal to ignorance)', def: 'Treats absence of evidence, or counter-evidence, as confirmation.', unit: id, cue: 'evidence verb + absence', text: unitById[id].text, basis: 'engine (Ψ seal)' }); });
    out.fallacies = { method: 'Cue-phrase candidates per sentence plus two structural detectors from the claim graph (circular support, self-sealing). Candidates need human judgement.', items: fall,
      byType: fall.reduce(function (a, f) { a[f.name] = (a[f.name] || 0) + 1; return a; }, {}) };

    // ── rhetorical devices ──
    var dev = [], push = function (id, name, uid, cue, extra) { dev.push(Object.assign({ id: id, name: name, unit: uid, cue: cue, text: unitById[uid] ? (unitById[uid].cleanText || unitById[uid].text) : '' }, extra || {})); };
    var first = function (t, k) { return W(t).slice(0, k).map(function (w) { return w.toLowerCase(); }).join(' '); };
    var last = function (t, k) { var w = W(t); return w.slice(Math.max(0, w.length - k)).map(function (x) { return x.toLowerCase(); }).join(' '); };
    var pendingAna = [];
    for (var i = 0; i < units.length; i++) {
      var u = units[i], t = u.cleanText || u.text, nx = units[i + 1], pv = units[i - 1];
      // rhetorical question / hypophora
      if (/\?\s*$/.test(t)) {
        if (nx && nx.para === u.para && !/\?\s*$/.test(nx.text) && W(nx.text).length <= 25) push('hypophora', 'Hypophora (question answered by the speaker)', u.id, t.slice(0, 60), { units: [u.id, nx.id] });
        else if (/\b(?:isn't it|aren't they|don't you|doesn't it|wouldn't you|who (?:would|could|can)|how (?:can|could) (?:anyone|we|you)|why (?:would|should) (?:anyone|we)|what (?:kind|sort) of)\b/i.test(t)) push('rhetorical-question', 'Rhetorical question', u.id, t.slice(0, 60));
      }
      // anaphora: same opening in ≥2 consecutive sentences
      if (pv && pv.para === u.para) { var f2 = first(t, 2), p2 = first(pv.cleanText || pv.text, 2), f1 = first(t, 1);
        if ((f2 && f2 === p2 && f2.split(' ').some(function (w) { return !STOPF.has(w); })) || (f1 && f1 === first(pv.cleanText || pv.text, 1) && !STOPF.has(f1) && f1.length > 2)) {
          var prev = pendingAna.length && pendingAna[pendingAna.length - 1]; if (prev && prev.id === 'anaphora' && prev.units[prev.units.length - 1] === pv.id) { prev.units.push(u.id); prev.n++; } else pendingAna.push({ id: 'anaphora', name: 'Anaphora (repeated opening)', unit: pv.id, cue: f2 && f2 === p2 ? f2 : f1, units: [pv.id, u.id], n: 2, three: first(t, 3) === first(pv.cleanText || pv.text, 3), text: pv.cleanText || pv.text }); }
        var e1 = last(t, 1), pe1 = last(pv.cleanText || pv.text, 1);
        if (e1 && e1 === pe1 && last(t, 2) === last(pv.cleanText || pv.text, 2) && !STOPF.has(e1) && e1.length > 3) push('epistrophe', 'Epistrophe (repeated ending)', pv.id, e1, { units: [pv.id, u.id] }); }
      // antithesis
      var an = t.match(/\bnot (?!only\b|just\b|merely\b|simply\b)(?:\w+ ){0,4}\w+,? but (?!also\b)(?:\w+ ?){1,5}|\b(?:less|fewer) \w+,? more \w+|\bit is not (?:\w+ ){0,3}\w+[,;:—–-]+ it is (?:\w+ ?){1,4}/i);
      if (an) push('antithesis', 'Antithesis (contrast in parallel form)', u.id, an[0]);
      // tricolon: three parallel clauses / items with same opening word
      var tc = t.match(/\b(\w+)\b [^,;.]{2,40}[,;] \1\b [^,;.]{2,40}[,;] (?:and )?\1\b/i);
      if (tc && !STOPF.has(tc[1].toLowerCase()) || (tc && /^(we|i|you|they)$/i.test(tc[1]))) push('tricolon', 'Parallel tricolon', u.id, tc[0].slice(0, 80));
      // epizeuxis
      var ep = t.match(/\b([A-Za-z]{3,})(?:[,!]?\s+\1\b){1,}/i); if (ep && !/^(?:that|had|very|is|the)$/i.test(ep[1])) push('epizeuxis', 'Epizeuxis (immediate repetition)', u.id, ep[0]);
      // chiasmus: A … B in one clause, B … A in the next (content words)
      var cl = t.split(/[,;:—–]\s*|\s-\s/).map(function (c) { return W(c).map(function (w) { return w.toLowerCase(); }).filter(function (w) { return !STOPF.has(w) && w.length > 2; }); });
      chi: for (var q = 0; q + 1 < cl.length; q++) { var c1 = cl[q], c2 = cl[q + 1]; if (c1.length > 12 || c2.length > 12) continue;
        for (var a = 0; a < c1.length; a++) for (var b2 = a + 1; b2 < c1.length; b2++) { if (c1[a] === c1[b2]) continue; var pb = c2.indexOf(c1[b2]), pa = c2.lastIndexOf(c1[a]);
          if (pb >= 0 && pa > pb) { push('chiasmus', 'Chiasmus (A B … B A)', u.id, c1[a] + ' ' + c1[b2] + ' … ' + c1[b2] + ' ' + c1[a]); break chi; } } }
      // alliteration: ≥3 consecutive content words with the same initial consonant
      var aw = t.split(/\s+/).map(function (w) { return w.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ''); }); for (var k = 0; k + 2 < aw.length; k++) { var x = (aw[k][0] || '').toLowerCase(); if (!/[bcdfghjklmnpqrstvwxz]/.test(x)) continue;
        if ([aw[k], aw[k + 1], aw[k + 2]].every(function (w) { return w.length >= 4 && w[0].toLowerCase() === x && !STOPF.has(w.toLowerCase()); })) { push('alliteration', 'Alliteration', u.id, aw.slice(k, k + 3).join(' ')); break; } }
      // hyperbole
      var hy = t.match(/\b(?:a (?:million|billion|thousand) times|never in (?:history|human history|my life)|(?:greatest|worst|biggest|largest) [\w\s]{0,30}(?:ever|in (?:human )?history|of all time)|literally (?:dying|exploding|millions|everyone|the worst)|more than ever before)\b/i);
      if (hy) push('hyperbole', 'Hyperbole', u.id, hy[0]);
      // scare quotes: 1–2 word quoted phrase, not a reported quotation
      var sq = t.match(/\b(?:so-called|their|these|those|his|her|our|your)\s+["“']([A-Za-z-]+(?: [A-Za-z-]+)?)["”'](?![\w])/i);
      if (sq && (/so-called/i.test(sq[0]) || SCARE.test(sq[1]))) push('scare-quotes', 'Scare quotes', u.id, sq[0]);
    }
    pendingAna.forEach(function (a) { if (a.units.length >= 3 || a.three) dev.push(a); });
    out.devices = { method: 'Pattern detectors on sentence form (repetition, parallelism, question structure, contrast). Candidates, not judgements.', items: dev,
      byType: dev.reduce(function (a, d) { a[d.name] = (a[d.name] || 0) + 1; return a; }, {}), exclamations: counts.excl };

    // ── appeals: logos / ethos / pathos marker rates ──
    var nums = (R.claims || []).filter(function (c) { return c.type === 'numeric' || c.type === 'date'; }).length;
    var weak = {}; (I.ungrounded || []).forEach(function (g) { weak[g.unit] = 1; }); (R.psi.seal.witnesses || []).forEach(function (id) { weak[id] = 1; });
    var grounded = (R.supportEdges || []).filter(function (e) { return e[0] !== e[1] && !weak[e[1]] && !weak[e[0]]; }).length;
    var logos = 0.5 * L.causal.n + L.measure.n + nums + grounded + src.urls.length + src.dois.length + src.inTextCitations;
    var ethos = L.cred.n + counts.named + Math.round(L.hedge.n / 2);
    var pathos = L.loaded.n + L.strong.n + L.fear.n + L.anger.n + L.hope.n + L.sadness.n + counts.excl + Math.round(counts.you / 2);
    var tot = logos + ethos + pathos;
    out.appeals = { method: 'Marker counts per 1,000 words. Logos: quantities and dates, measurement terms, citations, grounded support edges (not ending in an ungrounded or self-sealing sentence), half-weight inferential connectives. Ethos: credentials and trust terms, named attribution, half-weight hedges (epistemic care). Pathos: loaded and strongly valenced words, fear/anger/hope/sadness terms, exclamations, half-weight second-person address. A proxy, not a validated measure.',
      logos: per1k(logos, words), ethos: per1k(ethos, words), pathos: per1k(pathos, words),
      share: tot ? { logos: Math.round(100 * logos / tot), ethos: Math.round(100 * ethos / tot), pathos: Math.round(100 * pathos / tot) } : null,
      emotions: { fear: terms(L.fear), anger: terms(L.anger), hope: terms(L.hope), sadness: terms(L.sadness) },
      parts: { connectives: L.causal.n, 'measurement terms': L.measure.n, quantities: nums, 'grounded support': grounded, citations: src.urls.length + src.dois.length + src.inTextCitations,
        credentials: L.cred.n, named: counts.named, hedges: L.hedge.n, loaded: L.loaded.n, strong: L.strong.n, emotion: L.fear.n + L.anger.n + L.hope.n + L.sadness.n, exclamations: counts.excl, you: counts.you } };

    // per-unit pathos/logos tags for the fishbone
    var unitPathos = {}; [L.loaded, L.strong, L.fear, L.anger].forEach(function (bg) { bg.units.forEach(function (id) { unitPathos[id] = (unitPathos[id] || 0) + 1; }); });
    out.fishbone = S.fishbone(R, I, out, units, unitById, unitPathos);
    return out;
  };

  // ── Ishikawa (fishbone) map of reasoning around a thesis ──
  var CONCL = /\b(?:in conclusion|to conclude|to sum up|in sum|in short|overall|therefore|thus|hence|consequently|the point is|this means that|it follows that|we (?:argue|conclude|propose|show)|i (?:argue|conclude|propose)|this (?:paper|post|article|essay|study) (?:argues|shows|claims|proposes|demonstrates))\b/i;
  var FINDING = /\b(?:we (?:found|find|show|demonstrate|conclude|argue)|our (?:results|findings|data|analysis) (?:show|suggest|indicate|prove|demonstrate|reveal)|(?:the )?results (?:show|suggest|indicate|prove|demonstrate|reveal)|this (?:shows|suggests|means|proves)|the (?:main|key|central) (?:finding|claim|argument) is)\b/i;
  var CLAIMV = /\b(?:causes?|leads? to|results? in|improves?|reduces?|increases?|prevents?|is (?:the|a) (?:cause|key|main)|are (?:responsible|the cause))\b/i;
  var METHODV = /^(?:we|the authors|participants|this study) (?:surveyed|recruited|collected|measured|sampled|interviewed|used|analy[sz]ed|conducted|administered)\b/i;
  function cset(t) { return new Set(W(t).map(function (w) { return w.toLowerCase(); }).filter(function (w) { return !STOPF.has(w) && w.length > 3; })); }
  function jac(a, b) { var n = 0; a.forEach(function (x) { if (b.has(x)) n++; }); return n / ((a.size + b.size - n) || 1); }
  S.thesisCandidates = function (R, units) {
    var indeg = {}; (R.supportEdges || []).forEach(function (e) { if (e[0] !== e[1]) indeg[e[1]] = (indeg[e[1]] || 0) + 1; });
    var c = [];
    units.forEach(function (u, i) { var s = 0, why = [];
      if (indeg[u.id]) { s += 3 * indeg[u.id]; why.push(indeg[u.id] + ' supporting premise' + (indeg[u.id] > 1 ? 's' : '')); }
      if (CONCL.test(u.text)) { s += 2.5; why.push('conclusion marker'); }
      if (FINDING.test(u.text)) { s += 2; why.push('finding statement'); }
      if (CLAIMV.test(u.text) && !/\b(?:may|might|could)\b/i.test(u.text)) { s += 1; why.push('causal or general claim'); }
      if (METHODV.test(u.text)) s -= 1.5;
      if (i === 0) { s += 1; why.push('lead sentence'); }
      if (i === units.length - 1) { s += 0.5; why.push('closing sentence'); }
      if (/\?\s*$/.test(u.text)) s -= 2;
      if (s > 0) c.push({ unit: u.id, score: s, why: why.join(', '), text: u.cleanText || u.text }); });
    return c.sort(function (a, b) { return b.score - a.score; }).slice(0, 6);
  };
  S.fishbone = function (R, I, RH, units, unitById, unitPathos, headId) {
    var cands = S.thesisCandidates(R, units); if (!units.length) return null;
    var head = headId ? unitById[headId] : (cands[0] ? unitById[cands[0].unit] : units[0]); if (!head) return null;
    var hs = cset(head.text), inUnits = {}; units.forEach(function (u) { inUnits[u.id] = 1; });
    var rel = function (id) { var u = unitById[id]; return u ? jac(hs, cset(u.text)) : 0; };
    var item = function (id, label, extra) { var u = unitById[id]; return Object.assign({ unit: id, label: label || (u ? (u.cleanText || u.text) : id), rel: rel(id) }, extra || {}); };
    var rank = function (arr, n) { var seen = {}; return arr.filter(function (x) { if (!x.unit || x.unit === head.id || seen[x.unit]) return false; seen[x.unit] = 1; return true; }).sort(function (a, b) { return (b.w || 0) - (a.w || 0) || b.rel - a.rel; }).slice(0, n || 5); };
    // Reasoning: premises that reach the head through support edges (chain depth), then causal sentences
    var back = {}; (R.supportEdges || []).forEach(function (e) { if (e[0] !== e[1]) (back[e[1]] = back[e[1]] || []).push(e[0]); });
    var reasoning = [], seen = {}, q = [[head.id, 0]];
    while (q.length) { var cur = q.shift(); (back[cur[0]] || []).forEach(function (p) { if (seen[p]) return; seen[p] = 1; reasoning.push(item(p, null, { w: 10 - cur[1], depth: cur[1] + 1, via: cur[0] })); q.push([p, cur[1] + 1]); }); }
    units.forEach(function (u) { if (/\b(?:because|since|due to|as a result|therefore|thus|hence|consequently|it follows)\b/i.test(u.text)) reasoning.push(item(u.id, null, { w: 0.5 })); });
    units.forEach(function (u) { if ((CLAIMV.test(u.text) || FINDING.test(u.text)) && rel(u.id) >= 0.08) reasoning.push(item(u.id, null, { w: 0.2, tag: 'related claim' })); });
    var claimsBy = function (pred) { var o = []; R.claims.forEach(function (c) { if (pred(c) && inUnits[c.unit]) o.push(c.unit); }); return o; };
    var evidence = claimsBy(function (c) { return (c.type === 'numeric' || c.type === 'date') && (!c.modality || c.modality.kind === 'asserted' || c.modality.kind === 'reported'); }).map(function (id) { return item(id); });
    var srcI = claimsBy(function (c) { return c.modality && c.modality.kind === 'reported' && c.modality.source && !VAGUE_SRC.test(c.modality.source) && !/\d/.test(c.modality.source); }).map(function (id) { var c = R.claims.find(function (x) { return x.unit === id && x.modality && x.modality.source; }); return item(id, null, { tag: c ? c.modality.source : '' }); });
    units.forEach(function (u) { if (/https?:\/\/|\b10\.\d{4,9}\/|\([A-Z][A-Za-z'’-]+(?: et al\.)?,? (?:19|20)\d\d\)|\[\d+\]/.test(u.text)) srcI.push(item(u.id, null, { tag: 'citation' })); });
    var assume = (I.hedged || []).map(function (h) { var c = R.claims.find(function (x) { return x.id === h.claim; }); return c ? item(c.unit, null, { tag: 'hedged' }) : null; }).filter(Boolean)
      .concat((I.ungrounded || []).map(function (g) { return item(g.unit, null, { tag: 'ungrounded', w: 1 }); }))
      .concat(claimsBy(function (c) { return c.modality && c.modality.kind === 'hypothesized'; }).map(function (id) { return item(id, null, { tag: 'hypothesis' }); }));
    var counter = [];
    (R.obstructions || []).forEach(function (o) { (o.claims || []).forEach(function (cid) { var c = R.claims.find(function (x) { return x.id === cid; }); if (c) counter.push(item(c.unit, null, { tag: o.class, w: 3 })); }); });
    units.forEach(function (u) { if (/^(?:however|but|yet|nevertheless|nonetheless|on the other hand|critics|opponents|admittedly|although|though)\b/i.test((u.cleanText || u.text).trim())) counter.push(item(u.id, null, { tag: 'contrast' })); });
    var rhet = (RH.fallacies ? RH.fallacies.items : []).map(function (f) { return item(f.unit, null, { tag: f.name, w: 2 }); })
      .concat(Object.keys(unitPathos).map(function (id) { return item(id, null, { tag: 'emotive', w: unitPathos[id] / 2 }); }));
    var bones = [
      { key: 'reasoning', name: 'Reasoning', hint: 'premises with support edges into the thesis, then causal sentences', items: rank(reasoning) },
      { key: 'evidence', name: 'Evidence', hint: 'quantities and dates', items: rank(evidence) },
      { key: 'sources', name: 'Sources', hint: 'named attribution and citations', items: rank(srcI) },
      { key: 'assumptions', name: 'Assumptions', hint: 'hedged, hypothesised or ungrounded claims', items: rank(assume) },
      { key: 'counter', name: 'Counterpoints', hint: 'obstructions and contrastive sentences', items: rank(counter) },
      { key: 'rhetoric', name: 'Rhetoric', hint: 'fallacy candidates and emotive sentences', items: rank(rhet) }
    ];
    return { head: { unit: head.id, text: head.cleanText || head.text }, candidates: cands, bones: bones,
      method: 'Head: the sentence with most incoming support edges, else a conclusion marker, else the lead. Items are ranked by structural role, then by word overlap with the head.' };
  };
  S.rhetoricLists = { LOADED: LOADED, ABSOLUTES: ABSOLUTES, FRAME_R: FRAME_R, FRAME_L: FRAME_L, VAGUE: VAGUE, HEDGES: HEDGES, BOOSTERS: BOOSTERS, ATTITUDE: ATTITUDE, DEONTIC: DEONTIC, CAUSAL: CAUSAL, CRED: CRED, EMOTION: EMOTION, FALLACIES: FALLACIES.map(function (f) { return { id: f.id, name: f.name, def: f.def }; }) };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
