// ═══ SA2 TOPIC LAYERS ═══ descriptive keyword tagging onto the 18 Draken layers (v1 lexicon). Not part of the consistency mathematics.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : require('./engine-math.js');
(function (S) {
  S.LAYERS = [
  {id:'L01', name:'Quantum Field',     color:'#6ea8fe', kw:['quantum','field','photon','electron','particle','wave','spin','gauge','amplitude','vacuum','heisenberg','schrodinger','superposition','entanglement','boson','fermion']},
  {id:'L02', name:'Chem. Thermo.',     color:'#8ab4ff', kw:['entropy','thermodynamic','chemical','reaction','catalyst','enzyme','heat','temperature','gradient','bond','molecule','molecular','covalent','ionic','dissipation']},
  {id:'L03', name:'Molecular Asm.',    color:'#6ee7b7', kw:['protein','dna','rna','gene','genome','ribosome','assembly','membrane','mitochondria','folding','cell','cellular','cytoskeleton','organelle','receptor']},
  {id:'L04', name:'Bioelectric',       color:'#2dd4bf', kw:['bioelectric','voltage','ion','channel','synapse','action potential','neuron','neural','axon','dendrite','membrane potential','cortex','levin','gap junction']},
  {id:'L05', name:'Neural Integ.',     color:'#22d3ee', kw:['brain','perception','sensory','predictive','attention','memory','consciousness','cognitive','hippocampus','amygdala','prefrontal','salience','default mode']},
  {id:'L06', name:'Embodied Cog.',     color:'#38bdf8', kw:['body','embodied','affect','emotion','feeling','sensation','gut','visceral','interoception','somatic','proprioception','breath','posture','arousal']},
  {id:'L07', name:'Narrative Self',    color:'#f59e0b', kw:['self','identity','narrative','story','ego','autobiography','meaning','purpose','inner','subjective','experience','phenomenology','reflection','introspect']},
  {id:'L08', name:'Dyadic Signal',     color:'#fb923c', kw:['dyad','pair','couple','intimate','trust','conversation','dialogue','listening','attachment','bond','friendship','rapport','mirror','empathy']},
  {id:'L09', name:'Group Cognition',   color:'#f87171', kw:['group','tribe','community','collective','shared belief','consensus','common knowledge','in-group','out-group','tribal','echo chamber','peer','cohort']},
  {id:'L10', name:'Social Coord.',     color:'#ef4444', kw:['coordination','cooperation','team','organization','meeting','protocol','norm','convention','ritual','standard','role','practice','workflow','division of labor']},
  {id:'L11', name:'Economic Cog.',     color:'#a78bfa', kw:['price','money','market','trade','demand','supply','labor','wage','capital','currency','profit','cost','value','exchange','transaction','investor']},
  {id:'L12', name:'National Narr.',    color:'#c084fc', kw:['nation','national','country','citizen','flag','patriotism','border','sovereignty','state','homeland','identity','public opinion','media','propaganda']},
  {id:'L13', name:'Political Str.',    color:'#e879f9', kw:['political','policy','power','authority','government','regulation','law','constitution','election','legislature','executive','party','vote','lobby','coalition']},
  {id:'L14', name:'Economic Topo.',    color:'#f472b6', kw:['economy','gdp','inflation','recession','inequality','class','capitalism','socialism','crisis','debt','financial','bank','banking','systemic','structural']},
  {id:'L15', name:'Cultural Field',    color:'#fbbf24', kw:['culture','art','music','literature','religion','ritual','tradition','myth','language','ideology','worldview','canon','discourse','aesthetics','meaning']},
  {id:'L16', name:'Instit. Morph.',    color:'#facc15', kw:['institution','bureaucracy','university','church','corporation','agency','board','charter','incumbent','governance','compliance','audit','mandate','ossified']},
  {id:'L17', name:'Civ. Memory',       color:'#84cc16', kw:['history','historical','civilization','heritage','memory','legacy','generation','century','ancient','archive','tradition','precedent','canon','lineage']},
  {id:'L18', name:'Planetary Cog.',    color:'#4ade80', kw:['planet','planetary','earth','climate','ecology','ecosystem','biosphere','global','species','extinction','carbon','atmosphere','geology','anthropocene','ocean']}
];
  S.topicLayers = function (units) {
    var cov = {}; S.LAYERS.forEach(function (L) { cov[L.id] = 0; });
    var res = S.LAYERS.map(function (L) { return { id: L.id, re: new RegExp('\\b(' + L.kw.map(function (k) { return k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }).join('|') + ')s?\\b', 'gi') }; });
    units.forEach(function (u) { if (u.nonclaim) return; res.forEach(function (r) { var m = u.text.match(r.re); if (m) cov[r.id] += m.length; }); });
    return cov;
  };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
