/* Corpus Map front end. Served as /map/app.js; data from /data/corpus-map.json. */
(function(){
  function start(DATA){
const G=DATA;
const typeset=()=>{if(window.MathJax&&MathJax.typesetPromise)MathJax.typesetPromise([pb]).catch(()=>{})};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ccol=i=>`var(--c${i%8})`;
const posts=G.posts.map((p,i)=>({...p,type:'post',i}));
const byId=new Map(posts.map(p=>[p.id,p]));
const concepts=G.concepts.map(c=>({...c,type:'concept'}));
concepts.forEach(c=>byId.set(c.id,c));
const nodes=[...posts,...concepts];
const pp=G.edges.map(e=>({source:posts[e.s],target:posts[e.t],sem:e.sem,link:e.link,kind:'pp'}));
const pc=G.clinks.map(l=>({source:byId.get(l.p),target:byId.get(l.c),n:l.n,d:l.d,kind:'pc'}));
// adjacency
const adj=new Map(nodes.map(n=>[n.id,[]]));
pp.forEach(e=>{adj.get(e.source.id).push({o:e.target,e});adj.get(e.target.id).push({o:e.source,e})});
pc.forEach(e=>{adj.get(e.source.id).push({o:e.target,e});adj.get(e.target.id).push({o:e.source,e})});
const conOf=new Map(posts.map(p=>[p.id,new Set()]));
pc.forEach(e=>conOf.get(e.source.id).add(e.target.id));
const citedBy=new Map(posts.map(p=>[p.id,[]]));
posts.forEach(p=>p.cites.forEach(t=>{if(citedBy.has(t))citedBy.get(t).push(p.id)}));
const UBIQ=new Set(['c:gamma','c:rho','c:gluing','c:h1','c:topology','c:substrate']);
document.getElementById('cm-load').remove();
document.getElementById('cm-hint').textContent='Tap a scale to open a post. Diamonds are concepts. Gold lines are explicit citations, green lines shared vocabulary.';
document.getElementById('cm-stats').textContent=`${posts.length} posts, ${concepts.length} concepts, ${pp.filter(e=>e.link).length} citation links`;

const svg=d3.select('#cm-svg'), root=svg.append('g');
const gLanes=root.append('g'), gAxis=root.append('g').attr('class','axis');
const gE=root.append('g'), gC=root.append('g'), gT=root.append('g'), gN=root.append('g');
const zoom=d3.zoom().scaleExtent([.25,6]).on('zoom',ev=>{root.attr('transform',ev.transform);root.classed('lab',ev.transform.k>1.6)});
svg.call(zoom).on('dblclick.zoom',null);
let W=0,H=0; function size(){const r=svg.node().getBoundingClientRect();W=r.width;H=r.height}
size();

const rP=p=>4+Math.sqrt(p.words)/9;
const rC=c=>5+Math.sqrt(c.n)*1.3;
const hex=r=>{const a=[];for(let k=0;k<6;k++){const t=Math.PI/3*k+Math.PI/6;a.push([r*Math.cos(t),r*Math.sin(t)])}return 'M'+a.map(x=>x.join(',')).join('L')+'Z'};
const dia=r=>`M0,${-r}L${r},0L0,${r}L${-r},0Z`;

const eSel=gE.selectAll('line').data(pp).join('line')
  .attr('class',d=>'edge'+(d.link?' cite':''))
  .attr('stroke-width',d=>0.4+d.sem*5+(d.link?0.6:0)).attr('stroke-opacity',d=>d.link?.55:.45);
let cSel=gC.selectAll('line');
const nSel=gN.selectAll('g').data(nodes).join('g').attr('class',d=>'node '+d.type).attr('tabindex',0)
  .attr('role','button').attr('aria-label',d=>d.type==='post'?`${d.title}`:`Concept ${d.label}`);
nSel.append('path').attr('d',d=>d.type==='post'?hex(rP(d)):dia(rC(d)))
  .attr('fill',d=>d.type==='post'?ccol(d.comm):(d.kind==='op'?'var(--op)':'var(--ground)'))
  .attr('stroke',d=>d.type==='post'?'var(--ground)':(d.kind==='theme'?'var(--theme)':d.kind==='domain'?'var(--domain)':'var(--op)'))
  .attr('stroke-width',d=>d.type==='post'?1.2:2);
nSel.append('text').attr('dy',d=>d.type==='post'?-rP(d)-3:-rC(d)-3).attr('text-anchor','middle')
  .text(d=>d.type==='post'?(d.drk||''):d.label);
nSel.on('click',(ev,d)=>{ev.stopPropagation();select(d)})
    .on('keydown',(ev,d)=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();select(d)}});
svg.on('click',()=>{if(!pathFrom)clearSel()});
nSel.call(d3.drag().on('start',(ev,d)=>{if(!ev.active)sim.alphaTarget(.2).restart();d.fx=d.x;d.fy=d.y})
  .on('drag',(ev,d)=>{d.fx=ev.x;d.fy=ev.y}).on('end',(ev,d)=>{if(!ev.active)sim.alphaTarget(0);if(mode==='map'){d.fx=null;d.fy=null}}));

let showConcepts=true, mode='map';
const K=G.comms.length, anc=G.comms.map((c,i)=>({x:Math.cos(2*Math.PI*i/K-Math.PI/2)*190,y:Math.sin(2*Math.PI*i/K-Math.PI/2)*190}));
const ax=d=>d.type==='post'?anc[d.comm].x:0, ay=d=>d.type==='post'?anc[d.comm].y:0;
const axs=d=>d.type==='post'?.13:.01;
const ppStr=d=>Math.min(.7,d.sem*1.2+(d.link?.04:0));
const lpp=d3.forceLink(pp).id(d=>d.id).distance(d=>70-d.sem*90).strength(ppStr);
const pcStr=d=>Math.min(.12,.01+d.d/150);
const lpc=d3.forceLink(pc).id(d=>d.id).distance(40).strength(pcStr);
const sim=d3.forceSimulation(nodes).force('pp',lpp).force('pc',lpc)
  .force('charge',d3.forceManyBody().strength(d=>d.type==='post'?-90:-30))
  .force('collide',d3.forceCollide(d=>(d.type==='post'?rP(d):rC(d))+3))
  .force('x',d3.forceX(ax).strength(axs)).force('y',d3.forceY(ay).strength(axs))
  .on('tick',tick).on('end',()=>{if(!fitted){fitted=true;fitBounds(500)}});
function tick(){
  eSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
  cSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
  nSel.attr('transform',d=>`translate(${d.x},${d.y})`);
  drawTrail();
}
function fitBounds(dur){
  const vis=nodes.filter(n=>n.x!=null&&(showConcepts||n.type==='post'));
  let [x0,x1]=d3.extent(vis,n=>n.x),[y0,y1]=d3.extent(vis,n=>n.y);
  if(mode==='stream'){if(W<700){x0=showConcepts?-345:-190;x1=235;y0=-470;y1=440}else{x0=-570;x1=445;y0=showConcepts?-410:-250;y1=300}}
  const top=H<700?40:36,bot=46,pad=18,w=W-2*pad,h=H-top-bot;
  const k=Math.min(w/(x1-x0),h/(y1-y0),3);
  svg.transition().duration(reduce?0:dur).call(zoom.transform,d3.zoomIdentity.translate(pad+w/2-k*(x0+x1)/2,top+h/2-k*(y0+y1)/2).scale(k));
}
function fit(){fitBounds(0)}
let fitted=false;
fit();

// ---- stream mode
const dates=posts.map(p=>new Date(p.date));
const x=d3.scaleTime().domain(d3.extent(dates)).range([-420,420]);
const lanes=G.comms.length;
const y=i=>-230+i*(460/Math.max(lanes-1,1));
function setMode(m){
  mode=m;root.classed('stream',m==='stream');
  document.getElementById('cm-mMap').setAttribute('aria-pressed',m==='map');
  document.getElementById('cm-mStream').setAttribute('aria-pressed',m==='stream');
  gLanes.selectAll('*').remove();gAxis.selectAll('*').remove();
  if(m==='stream'){
    const vert=W<700;
    const tpos=d=>d.type==='post'?x(new Date(d.date)):x(new Date(d.first));
    const lpos=d=>d.type==='post'?y(d.comm):({op:-390,theme:-340,domain:-290})[d.kind];
    const vl=d=>d.type==='post'?(d.comm-(lanes-1)/2)*44:({op:-300,theme:-262,domain:-224})[d.kind];
    if(!vert){
      sim.force('x',d3.forceX(tpos).strength(d=>d.type==='post'?.9:.6)).force('y',d3.forceY(lpos).strength(d=>d.type==='post'?.5:.8));
      G.comms.forEach(c=>gLanes.append('text').attr('class','lane').attr('x',-440).attr('y',y(c.id)+3).attr('text-anchor','end').text(c.name));
      [['Operators, first use',-390],['Themes, first use',-340],['Domains, first use',-290]].forEach(([t,yy])=>gLanes.append('text').attr('class','lane').attr('x',-440).attr('y',yy+3).attr('text-anchor','end').text(t));
      gAxis.attr('transform','translate(0,275)').call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%b %Y')));
    }else{
      sim.force('x',d3.forceX(vl).strength(d=>d.type==='post'?.7:.8)).force('y',d3.forceY(tpos).strength(d=>d.type==='post'?.9:.6));
      [['Ops',-300],['Themes',-262],['Domains',-224]].forEach(([t,xx])=>gLanes.append('text').attr('class','lane').attr('x',xx).attr('y',-440).attr('text-anchor','middle').text(t));
      gLanes.append('text').attr('class','lane').attr('x',0).attr('y',-440).attr('text-anchor','middle').text('Clusters, by colour');
      gAxis.attr('transform','translate(200,0)').call(d3.axisRight(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%b')));
    }
    sim.force('pp').strength(.02);sim.force('pc').strength(0);
    document.getElementById('cm-hint').textContent=vert?'Time runs top to bottom. Each column is a cluster; concepts sit where they first appear.':'Time runs left to right. Each lane is a cluster; concepts sit where they first appear.';
  }else{
    sim.force('x',d3.forceX(ax).strength(axs)).force('y',d3.forceY(ay).strength(axs));
    sim.force('pp').strength(ppStr);sim.force('pc').strength(pcStr);
    nodes.forEach(n=>{n.fx=null;n.fy=null});
    document.getElementById('cm-hint').textContent='Tap a scale to open a post. Diamonds are concepts. Gold lines are explicit citations, green lines shared vocabulary.';
  }
  if(m==='stream'){fitted=true;fitBounds(500)}else fitted=false;
  sim.alpha(.9).restart();
}
document.getElementById('cm-mMap').onclick=()=>setMode('map');
document.getElementById('cm-mStream').onclick=()=>setMode('stream');
document.getElementById('cm-bConcepts').onclick=function(){
  showConcepts=!showConcepts;this.setAttribute('aria-pressed',showConcepts);
  nSel.filter(d=>d.type==='concept').style('display',showConcepts?null:'none');fitBounds(400);
};

// ---- clusters
const cl=d3.select('#cm-clusters');let clusterOn=null;
G.comms.forEach(c=>{
  cl.append('button').attr('class','chip').attr('aria-pressed','false')
    .html(`<i style="background:${ccol(c.id)}"></i>${c.name}`)
    .on('click',function(){clusterOn=clusterOn===c.id?null:c.id;cl.selectAll('.chip').attr('aria-pressed',(_,i)=>String(i===clusterOn));
      if(clusterOn===null)clearSel();else highlight(new Set(posts.filter(p=>p.comm===c.id).map(p=>p.id)),null)});
});

// ---- selection
const panel=document.getElementById('cm-panel'),pb=document.getElementById('cm-pbody');
let current=null, trail=[], pathFrom=null;
function highlight(set,edgeSet){
  nSel.classed('dim',d=>!set.has(d.id)).classed('hi',d=>set.has(d.id)&&set.size<40);
  eSel.classed('dim',d=>edgeSet?!edgeSet.has(d):!(set.has(d.source.id)&&set.has(d.target.id)));
}
function clearSel(){current=null;nSel.classed('dim',false).classed('hi',false);eSel.classed('dim',false);cSel=cSel.data([]).join('line');panel.classList.remove('open');trail=[];drawTrail()}
function sharedCon(a,b){const A=conOf.get(a)||new Set(),B=conOf.get(b)||new Set();return [...A].filter(c=>B.has(c)&&!UBIQ.has(c)).map(c=>byId.get(c).label)}
function why(a,b){
  const bits=[];
  if(a.type==='post'&&b.type==='post'){
    if(a.cites.includes(b.id))bits.push('cites it');else if(b.cites.includes(a.id))bits.push('cited by it');
    const s=sharedCon(a.id,b.id).slice(0,3);if(s.length)bits.push('shares '+s.join(', '));
    const t=a.terms.filter(x=>b.terms.includes(x));if(t.length)bits.push('vocabulary: '+t.join(', '));
  }else{const c=a.type==='concept'?a:b;bits.push('via '+c.label)}
  return bits.join('; ')||'close in vocabulary';
}
function fmtDate(s){return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const btn=(n,extra='')=>`<button data-go="${esc(n.id)}">${esc(n.type==='post'?n.title:n.label)}</button>${extra}`;
function select(d){
  if(pathFrom&&pathFrom!==d){const f=pathFrom;pathFrom=null;return showPath(f,d)}
  current=d;clusterOn=null;cl.selectAll('.chip').attr('aria-pressed','false');
  const nb=new Set([d.id,...adj.get(d.id).map(a=>a.o.id)]);
  highlight(nb,new Set(adj.get(d.id).filter(a=>a.e.kind==='pp').map(a=>a.e)));
  cSel=gC.selectAll('line').data(showConcepts?adj.get(d.id).filter(a=>a.e.kind==='pc').map(a=>a.e):[]).join('line').attr('class','cedge');
  tick();
  let h='';
  if(d.type==='post'){
    const cons=[...conOf.get(d.id)].map(c=>byId.get(c)).sort((a,b)=>a.n-b.n);
    const near=adj.get(d.id).filter(a=>a.e.kind==='pp').sort((a,b)=>b.e.sem-a.e.sem).slice(0,6).map(a=>a.o);
    const cites=d.cites.map(i=>byId.get(i)).filter(Boolean), by=citedBy.get(d.id).map(i=>byId.get(i));
    h+=`<div class="meta">${d.drk?d.drk+', ':''}${fmtDate(d.date)}, ${d.words.toLocaleString('en')} words<br><i style="display:inline-block;width:.6rem;height:.6rem;border-radius:2px;background:${ccol(d.comm)}"></i> ${esc(G.comms[d.comm].name)}</div>`;
    h+=`<h2>${esc(d.title)}</h2><p>${esc(d.excerpt)}</p>`;
    h+=`<div class="actions"><a class="cm-btn" href="/posts/${d.id}/">Read the post</a><button class="cm-btn" id="cm-drift">Drift from here</button><button class="cm-btn" id="cm-path">Find a path to…</button></div>`;
    if(d.layers.length)h+=`<h3>Layers</h3><div class="tags">${d.layers.map(l=>`<button class="tag" data-layer="${l}" title="${esc(G.layers[l]||'')}">${l} ${esc(G.layers[l]||'')}</button>`).join('')}</div>`;
    h+=`<h3>Concepts</h3><div class="tags">${cons.map(c=>`<button class="tag" data-go="${c.id}">${esc(c.label)}</button>`).join('')}</div>`;
    h+=`<h3>Distinctive vocabulary</h3><div class="tags">${d.terms.map(t=>`<span class="tag static">${esc(t)}</span>`).join('')}</div>`;
    if(cites.length)h+=`<h3>Cites</h3><ul class="list">${cites.map(n=>`<li>${btn(n)}</li>`).join('')}</ul>`;
    if(by.length)h+=`<h3>Cited by</h3><ul class="list">${by.map(n=>`<li>${btn(n)}</li>`).join('')}</ul>`;
    h+=`<h3>Closest in vocabulary</h3><ul class="list">${near.map(n=>`<li>${btn(n,`<span class="why">${esc(why(d,n))}</span>`)}</li>`).join('')}</ul>`;
  }else{
    const mem=adj.get(d.id).map(a=>({p:a.o,e:a.e})).sort((a,b)=>b.e.d-a.e.d);
    const kindName={op:'Formal operator or tool',theme:'Theme',domain:'Domain'}[d.kind];
    h+=`<div class="meta">${kindName}, in ${d.n} posts, first used ${fmtDate(d.first)}</div><h2>${esc(d.label)}</h2>`;
    h+=`<div class="actions"><button class="cm-btn" id="cm-path">Find a path to…</button></div>`;
    h+=`<h3>Posts, densest use first</h3><ul class="list">${mem.map(m=>`<li>${btn(m.p,`<span class="why">${m.e.n} mentions, ${m.e.d} per 1000 words</span>`)}</li>`).join('')}</ul>`;
  }
  pb.innerHTML=h;panel.classList.add('open');panel.scrollTop=0;typeset();
  const dr=document.getElementById('cm-drift');if(dr)dr.onclick=()=>drift(d);
  const pa=document.getElementById('cm-path');if(pa)pa.onclick=()=>{pathFrom=d;document.getElementById('cm-hint').textContent=`Choose where the path from “${d.type==='post'?d.title:d.label}” should end: tap a node or search.`;panel.classList.remove('open');document.getElementById('cm-q').focus()};
}
pb.addEventListener('click',ev=>{
  const g=ev.target.closest('[data-go]');if(g){select(byId.get(g.dataset.go));focusOn(byId.get(g.dataset.go));return}
  const l=ev.target.closest('[data-layer]');if(l){const L=l.dataset.layer;highlight(new Set(posts.filter(p=>p.layers.includes(L)).map(p=>p.id)),null);
    document.getElementById('cm-hint').textContent=`Highlighting posts tagged ${L} ${G.layers[L]||''}.`}
});
document.getElementById('cm-close').onclick=()=>clearSel();
function focusOn(n){if(!n||n.x==null)return;const t=d3.zoomTransform(svg.node());const mob=W<=700;const cx=mob?W/2:(W-Math.min(380,W))/2,cy=mob?H*.19:H/2;svg.transition().duration(reduce?0:450).call(zoom.transform,d3.zoomIdentity.translate(cx-n.x*t.k,cy-n.y*t.k).scale(t.k))}

// ---- drift (weighted walk)
function drift(start){
  trail=[start];const seen=new Set([start.id]);let cur=start;
  for(let s=0;s<11;s++){
    const opts=adj.get(cur.id).filter(a=>a.e.kind==='pp');if(!opts.length)break;
    const w=opts.map(a=>(a.e.sem+(a.e.link?.08:0))*(seen.has(a.o.id)?.1:1));
    let r=Math.random()*d3.sum(w),k=0;while(r>w[k]){r-=w[k];k++}
    cur=opts[Math.min(k,opts.length-1)].o;trail.push(cur);seen.add(cur.id);
  }
  showTrail('Drift',`A weighted walk: each step prefers the closest unvisited neighbour, so the stream follows vocabulary and citation.`);
}
// ---- path (Dijkstra)
function cost(e){return e.kind==='pp'?1/(e.sem+(e.link?.12:0)+.02):(UBIQ.has(e.target.id)?40:4+Math.log(e.target.n))}
function showPath(a,b){
  const dist=new Map(nodes.map(n=>[n.id,Infinity])),prev=new Map(),done=new Set();dist.set(a.id,0);
  while(true){let u=null,best=Infinity;for(const [k,v] of dist)if(!done.has(k)&&v<best){best=v;u=k}
    if(u===null||u===b.id)break;done.add(u);
    for(const {o,e} of adj.get(u)){const nd=best+cost(e);if(nd<dist.get(o.id)){dist.set(o.id,nd);prev.set(o.id,u)}}}
  if(!prev.has(b.id)){document.getElementById('cm-hint').textContent='No path found.';return}
  const p=[b.id];while(p[0]!==a.id)p.unshift(prev.get(p[0]));
  trail=p.map(i=>byId.get(i));
  showTrail('Path',`The shortest route from “${a.type==='post'?a.title:a.label}” to “${b.type==='post'?b.title:b.label}”, where close vocabulary and citations are short steps and broad concepts are long ones.`);
}
function showTrail(kind,desc){
  cSel=cSel.data([]).join('line');
  const set=new Set(trail.map(n=>n.id));highlight(set,new Set());
  let h=`<div class="meta">${kind}, ${trail.length} steps</div><h2>${kind==='Drift'?'A stream through the corpus':'From one idea to another'}</h2><p>${esc(desc)}</p>`;
  h+=`<ol class="steps">${trail.map((n,i)=>`<li>${btn(n,i?`<span class="why">${esc(why(trail[i-1],n))}</span>`:'')}</li>`).join('')}</ol>`;
  if(kind==='Drift')h+=`<div class="actions"><button class="cm-btn" id="cm-again">Drift again</button></div>`;
  pb.innerHTML=h;panel.classList.add('open');panel.scrollTop=0;
  const ag=document.getElementById('cm-again');if(ag){const s=trail[0];ag.onclick=()=>drift(s)}
  document.getElementById('cm-hint').textContent=kind==='Drift'?'The blue line is the drift.':'The blue line is the path.';
  drawTrail(true);
}
const tSel=gT.append('path').attr('class','trail');
function drawTrail(animate){
  if(!trail.length){tSel.attr('d',null);return}
  const line=d3.line().x(d=>d.x).y(d=>d.y).curve(d3.curveCatmullRom.alpha(.5));
  tSel.attr('d',line(trail));
  if(animate&&!reduce){const L=tSel.node().getTotalLength();tSel.attr('stroke-dasharray',L).attr('stroke-dashoffset',L).transition().duration(1400).ease(d3.easeCubicOut).attr('stroke-dashoffset',0).on('end',()=>tSel.attr('stroke-dasharray',null))}
}

// ---- search
const q=document.getElementById('cm-q'),res=document.getElementById('cm-res');
q.addEventListener('input',()=>{
  const s=q.value.trim().toLowerCase();if(!s){res.style.display='none';return}
  const hits=nodes.filter(n=>(n.type==='post'?(n.title+' '+(n.drk||'')+' '+n.terms.join(' ')+' '+n.tags.join(' ')):n.label).toLowerCase().includes(s)).slice(0,12);
  res.innerHTML=hits.map(n=>`<button role="option" data-id="${esc(n.id)}">${n.type==='post'?(n.drk?n.drk+'  ':'')+esc(n.title):'Concept: '+esc(n.label)}</button>`).join('')||'<button disabled>No match</button>';
  res.style.display='block';
});
res.addEventListener('click',ev=>{const b=ev.target.closest('[data-id]');if(!b)return;const n=byId.get(b.dataset.id);res.style.display='none';q.value='';select(n);focusOn(n)});
q.addEventListener('keydown',ev=>{if(ev.key==='Enter'){const b=res.querySelector('[data-id]');if(b)b.click()}if(ev.key==='Escape'){res.style.display='none'}});

// ---- method
document.getElementById('cm-bAbout').onclick=()=>{
  pb.innerHTML=`<div class="method"><h2>How the map is made</h2>
  <p>The map is rebuilt from the ${posts.length} published posts every time the site is built (${esc(G.generated.slice(0,10))} for this version). Each post is a hexagonal scale, sized by length and coloured by cluster.</p>
  <p><b>Green lines</b> join posts that share distinctive vocabulary: TF-IDF over words and word pairs, cosine similarity, each post linked to its four nearest neighbours above 0.10.</p>
  <p><b>Gold lines</b> are explicit citations: a DRK number or a /posts/ link inside the text. DRK numbers that belong to more than one post are left out rather than guessed.</p>
  <p><b>Clusters</b> come from Louvain community detection on that graph. Cluster names come from a small seed file (static/data/corpus-map-names.json); a cluster without a seed is labelled by its top terms.</p>
  <p><b>Concepts</b> are counted with fixed search patterns, one per concept, and a post joins a concept once it passes a minimum count. That is keyword matching, not understanding: it catches a word, not whether the post argues with it.</p>
  <p><b>Drift</b> is a weighted random walk over the green and gold lines. <b>Path</b> is a shortest route where close posts are cheap steps and broad concepts are expensive ones, so the route prefers real neighbours over generic hubs.</p>
  <p>Layer names follow the table in the corpus itself (DRK-105); the thesis may define them differently.</p></div>`;
  panel.classList.add('open');panel.scrollTop=0;
};
addEventListener('resize',()=>{size();fitBounds(0)});

  }
  function go(){
    if(!window.d3){document.getElementById('cm-load').textContent='The map needs d3 from cdnjs.cloudflare.com, which did not load.';return}
    fetch('/data/corpus-map.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(start)
      .catch(e=>{document.getElementById('cm-load').textContent='Could not load /data/corpus-map.json ('+e.message+'). Run node build.js.'});
  }
  if(document.readyState==='complete')go();else addEventListener('load',go);
})();
