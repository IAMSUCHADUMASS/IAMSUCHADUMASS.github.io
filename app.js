
const ASSET = {"f4a928b90340284c10f8cd1e6ce1c004": "media/p01.jpg", "6edac40e4c29514e9a22623c95478fae": "media/p02.jpg", "9fa3b5749ec9ca97eb4e19701b84c68d": "media/p03.jpg", "66237d5aac2144724541578a4e69e35e": "media/p04.jpg", "31aaa203acc1e4857d667913d23529a6": "media/p05.jpg", "a909e37ec3a6f74fff98265c2b5321d4": "media/p06.jpg", "ff29a148bf13b77452b0b03539326d0b": "media/p07.jpg", "0db77b0bbab41cd4271c697c3d52d364": "media/p08.jpg", "e4a10f425e66843a5de7e2af809f67f0": "media/p09.jpg", "6c3a18818dad51d4baa92a383f53e200": "media/p10.jpg", "f5e1807aa06903aa66924874bbdbc04a": "media/p11.jpg", "f70e932dc0fb64ab62e3b0a2c232c91f": "media/p12.jpg", "d23f0522121f5f1725cb4ac477817cc3": "media/p13.jpg", "5e3db95d2bd64cb6119f73c1a2bb277c": "media/p14.jpg", "8c2909ec63569891fe24ac91ada3d5b6": "media/p15.jpg", "35387a99e1d9a25779afc5bf06e59fcf": "media/p16.jpg", "a5e6b55eef1797cebecc76dda21e856a": "media/p17.jpg", "e2a87b0aa86dc8b6ba9f1466b5af0295": "media/n01.jpg", "49a34a10d9f07ac6e1adab856e606e2c": "media/n02.jpg", "92fd8820ebe79f0aeddf1cca23ca3bbb": "media/n03.jpg", "b12b1bf7cc616c95c1001f2a5e438867": "media/n04.jpg", "c8ae6000612f4f5dcd262cf2bc0aac8c": "media/v01.mp4", "a24d802a7713600d8f01ddccaa7c252e": "media/v01-poster.jpg", "13632838a211040cc2c70170acb1b4ea": "media/v02.mp4", "4b3c8d16483f43821fabab39312c8e1e": "media/v02-poster.jpg", "25e16b9816142ac4aae091b91b2c43a3": "media/v03.mp4", "bd7ecfaabbfd29b3641b5db76e9dfd1a": "media/v03-poster.jpg", "013cc81f88031ae1a06fc63a1afbd730": "media/v04.mp4", "8a5d48c029aad0e7f48a7a2d5b7c70ef": "media/v04-poster.jpg", "f1503d9cff8729f6f1b57727c1711b89": "media/v05.mp4", "26d34291f8a4826bf01d1b84327776bf": "media/v05-poster.jpg", "f30ec325ef6db5d4cc5d14f080bf77ba": "media/v06.mp4", "4b0e490aa90e0f480903da47741c0bfd": "media/v06-poster.jpg", "e3d610b1a233d48fdc6f4836fb2e1b03": "media/v07.mp4", "0d0dd79df9f6a6f5c1ffd09926ab5657": "media/v07-poster.jpg", "4396214bd264e4ad09c87762880a4d55": "media/v08.mp4", "b49548ca938c025e68bd03294afa15ae": "media/v08-poster.jpg", "1e6171a580cb964c53e021d46ec8e988": "media/v09.mp4", "6f770a107107d163f40031c43b75c784": "media/v09-poster.jpg", "47d5686ddd099a70418197f9d490322d": "media/v10.mp4", "a7d0f8efa55764d68f91bf3ecf3d7994": "media/v10-poster.jpg", "db651fbcdffd538c428c6246b26532fa": "media/v11.mp4", "6093a84dab674d3c31b621e8830c6aa3": "media/v11-poster.jpg", "030ca2f58f4bf0069e4e91b9545f0569": "media/v12.mp4", "22f54c0f3219e272a6e7860421215941": "media/v12-poster.jpg", "b88eb844bb14c5ecc3fec0eff3c2ee73": "media/v13.mp4", "7a4e4187ea8c77004e00bb50aa2b26c9": "media/v13-poster.jpg", "7fe939df0445b97145ccae9acbcc2e68": "media/v14.mp4", "5d122f8e68e631a49961c82b93a67361": "media/v14-poster.jpg", "4bde4f7680df8ddaf55aab07a496f534": "media/v15.mp4", "dfbb67b6947f309eaa26a677c82dc7f1": "media/v15-poster.jpg"};
const VOID = new Set(['img','br','hr','input','meta','link','source','wbr']);
const esc = (v) => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function lookup(path, scope) {
  path = path.trim();
  if (path === 'true') return true;
  if (path === 'false') return false;
  if (path === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
  let cur = scope;
  for (const part of path.split('.')) { if (cur == null) return undefined; cur = cur[part]; }
  return cur;
}
const WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
function attrValue(raw, scope) {
  const w = WHOLE.exec(raw);
  if (w) return lookup(w[1], scope);
  return raw.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, p) => { const v = lookup(p, scope); return v == null ? '' : String(v); });
}
let handlers = [];
function renderKids(node, scope) { let out = ''; node.childNodes.forEach((c) => { out += renderNode(c, scope); }); return out; }
function renderNode(node, scope) {
  if (node.nodeType === 3) return esc(node.nodeValue.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, p) => { const v = lookup(p, scope); return v == null ? '' : String(v); })).replace(/&amp;(amp|lt|gt|quot);/g, '&$1;');
  if (node.nodeType !== 1) return '';
  const tag = node.localName;
  if (tag === 'sc-if') { return attrValue(node.getAttribute('value') || '', scope) ? renderKids(node, scope) : ''; }
  if (tag === 'sc-for') {
    const list = attrValue(node.getAttribute('list') || '', scope) || [];
    const as = node.getAttribute('as') || 'item';
    let out = '';
    list.forEach((item, i) => { const sc = Object.assign({}, scope); sc[as] = item; sc.$index = i; out += renderKids(node, sc); });
    return out;
  }
  let attrs = '';
  for (const a of Array.from(node.attributes)) {
    const name = a.name;
    if (name.indexOf('hint-') === 0) continue;
    if (name === 'onclick' || name === 'onmouseenter') {
      const fn = attrValue(a.value, scope);
      if (typeof fn === 'function') { handlers.push(fn); attrs += ' data-' + (name === 'onclick' ? 'hc' : 'hm') + '="' + (handlers.length - 1) + '"'; }
      continue;
    }
    let v = attrValue(a.value, scope);
    if (v === null || v === undefined) continue;
    if (v === false && name.indexOf('aria-') !== 0) continue;
    attrs += ' ' + name + '="' + esc(v) + '"';
  }
  if (VOID.has(tag)) return '<' + tag + attrs + '>';
  return '<' + tag + attrs + '>' + renderKids(node, scope) + '</' + tag + '>';
}
function syncAttrs(o, n) {
  for (const a of Array.from(o.attributes)) { if (!n.hasAttribute(a.name)) o.removeAttribute(a.name); }
  for (const a of Array.from(n.attributes)) { if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value); }
}
function morphChildren(a, b) {
  const olds = Array.from(a.childNodes);
  const byKey = new Map();
  olds.forEach((o) => { if (o.nodeType === 1 && o.hasAttribute('data-key')) byKey.set(o.getAttribute('data-key'), o); });
  const used = new Set();
  const result = [];
  let cursor = 0;
  Array.from(b.childNodes).forEach((n) => {
    let o = null;
    const key = n.nodeType === 1 ? n.getAttribute('data-key') : null;
    if (key !== null) { o = byKey.get(key) || null; if (o && used.has(o)) o = null; }
    else {
      while (cursor < olds.length && (used.has(olds[cursor]) || (olds[cursor].nodeType === 1 && olds[cursor].hasAttribute('data-key')))) cursor++;
      if (cursor < olds.length) { const c = olds[cursor]; if (c.nodeType === n.nodeType && c.nodeName === n.nodeName) o = c; cursor++; }
    }
    if (o) {
      used.add(o);
      if (o.nodeType === 1) { syncAttrs(o, n); morphChildren(o, n); }
      else if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
      result.push(o);
    } else result.push(n.cloneNode(true));
  });
  olds.forEach((o) => { if (!used.has(o) && o.parentNode === a) a.removeChild(o); });
  result.forEach((node, i) => { if (a.childNodes[i] !== node) a.insertBefore(node, a.childNodes[i] || null); });
}
class DCLogic {
  constructor() { this.props = {}; this.state = {}; }
  setState(p) { this.state = Object.assign({}, this.state, typeof p === 'function' ? p(this.state) : p); this.forceUpdate(); }
  forceUpdate() {
    if (this._busy) { this._again = true; return; }
    this._busy = true;
    try {
      do {
        this._again = false;
        handlers = [];
        const html = renderKids(TPL, this.renderVals());
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        morphChildren(APP, wrap);
      } while (this._again);
    } finally { this._busy = false; }
  }
}
let TPL, APP;

class Component extends DCLogic {
audioCtx() {
try {
if (!this._ac) {
const C = window.AudioContext || window.webkitAudioContext;
if (!C) return null;
this._ac = new C();
}
if (this._ac.state === 'suspended') this._ac.resume();
return this._ac;
} catch (e) { return null; }
}
audio() {
if ((this.state || {}).muted) return null;
return this.audioCtx();
}
paper(strong) {
const ac = this.audio();
if (!ac) return;
try {
const t = ac.currentTime;
const dur = strong ? 0.46 : 0.28;
const n = Math.floor(ac.sampleRate * dur);
const buf = ac.createBuffer(1, n, ac.sampleRate);
const d = buf.getChannelData(0);
for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
const src = ac.createBufferSource();
src.buffer = buf;
const bp = ac.createBiquadFilter();
bp.type = 'bandpass';
bp.frequency.setValueAtTime(2000, t);
bp.frequency.linearRampToValueAtTime(5400, t + dur);
bp.Q.value = 0.7;
const hp = ac.createBiquadFilter();
hp.type = 'highpass';
hp.frequency.value = 1100;
const g = ac.createGain();
g.gain.setValueAtTime(0, t);
const steps = strong ? 10 : 6;
for (let i = 0; i < steps; i++) {
const tt = t + (i / steps) * dur;
g.gain.linearRampToValueAtTime(0.09 + Math.random() * 0.1, tt + 0.01);
g.gain.linearRampToValueAtTime(0.015, tt + (dur / steps) * 0.8);
}
g.gain.linearRampToValueAtTime(0, t + dur);
src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(ac.destination);
src.start(t); src.stop(t + dur);
} catch (e) {}
}
tone(freq, start, len, vol, type) {
const ac = this.audio();
if (!ac) return;
try {
const t = ac.currentTime + start;
const o = ac.createOscillator();
const g = ac.createGain();
o.type = type || 'sine';
o.frequency.setValueAtTime(freq, t);
g.gain.setValueAtTime(0.0001, t);
g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
g.gain.exponentialRampToValueAtTime(0.0001, t + len);
o.connect(g); g.connect(ac.destination);
o.start(t); o.stop(t + len + 0.02);
} catch (e) {}
}
tick() {
if (!this._ac) return;
const now = Date.now();
if (this._lastTick && now - this._lastTick < 110) return;
this._lastTick = now;
this.tone(1180, 0, 0.06, 0.025, 'sine');
}
boop() {
this.tone(300, 0, 0.16, 0.07, 'triangle');
}
chime() {
[523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, i * 0.11, 0.55, 0.06, 'sine'));
}
toggleSound() {
const m = !(this.state || {}).muted;
this.setState({ muted: m });
if (!m) {
this.audioCtx();
this.startMusic();
setTimeout(() => this.tone(880, 0, 0.12, 0.05, 'sine'), 40);
}
}
musicNote(freq, when, len, vol, type) {
const ac = this._ac;
if (!ac) return;
try {
const o = ac.createOscillator();
const g = ac.createGain();
o.type = type || 'sine';
o.frequency.setValueAtTime(freq, when);
g.gain.setValueAtTime(0.0001, when);
g.gain.exponentialRampToValueAtTime(vol, when + 0.01);
g.gain.exponentialRampToValueAtTime(0.0001, when + len);
o.connect(g); g.connect(ac.destination);
o.start(when); o.stop(when + len + 0.05);
} catch (e) {}
}
startMusic() {
if (this._musicTimer) return;
const ac = this.audioCtx();
if (!ac) return;
this._mStep = 0;
this._mNext = ac.currentTime + 0.15;
this._musicTimer = setInterval(() => this.musicTick(), 120);
}
musicTick() {
const ac = this._ac;
if (!ac) return;
const silent = !!(this.state || {}).muted || this._musicPaused;
if (silent) {
if (this._mNext < ac.currentTime) this._mNext = ac.currentTime + 0.1;
return;
}
if (ac.state === 'suspended') { try { ac.resume(); } catch (e) {} }
const mel = [659.25, 0, 783.99, 0, 880, 0, 783.99, 0, 659.25, 0, 587.33, 0, 523.25, 0, 0, 0, 587.33, 0, 659.25, 0, 783.99, 0, 659.25, 0, 587.33, 0, 523.25, 0, 587.33, 0, 0, 0];
const bass = [261.63, 220, 261.63, 196];
while (this._mNext < ac.currentTime + 0.35) {
const i = this._mStep % 32;
const t = this._mNext;
const f = mel[i];
if (f) {
this.musicNote(f, t, 1.1, 0.03, 'sine');
this.musicNote(f * 2, t, 0.45, 0.01, 'sine');
}
if (i % 8 === 0) this.musicNote(bass[i / 8], t, 1.8, 0.03, 'triangle');
this._mNext += 0.3;
this._mStep++;
}
}
tapIntro() {
const st = this.state || {};
if ((st.stage || 'intro') !== 'intro') return;
this.paper(true);
this.startMusic();
this.setState({ stage: 'sorry' });
}
openBox(item) {
this.paper(true);
const st = this.state || {};
this.setState({ box: item, boxSeq: (st.boxSeq || 0) + 1 });
if (item.kind === 'video') {
this._musicPaused = true;
try {
const v0 = document.querySelector('.box-video');
if (v0) { const p0 = v0.play(); if (p0 && p0.catch) p0.catch(() => {}); }
} catch (e) {}
setTimeout(() => {
try {
const v = document.querySelector('.box-video');
if (v) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
} catch (e) {}
}, 150);
}
}
closeBox() {
const st = this.state || {};
if (!st.box) return;
try {
const v = document.querySelector('.box-video');
if (v) v.pause();
} catch (e) {}
this._musicPaused = false;
this.paper(false);
this.setState({ box: null });
}
pick(i) {
this.paper(false);
if (window.innerWidth < 760) {
setTimeout(() => {
try {
const el = document.getElementById('panel');
if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
} catch (e) {}
}, 60);
}
const st = this.state || {};
const id = (st.seq || 0) + 1;
const flowers = (st.flowers || []).concat([{ id: id, top: 12 + (id % 5) * 12 }]);
this.setState({ sel: i, seq: id, flowers: flowers });
setTimeout(() => {
const cur = (this.state && this.state.flowers) || [];
this.setState({ flowers: cur.filter((f) => f.id !== id) });
}, 2600);
}
tapSorry() {
const st = this.state || {};
if ((st.stage || 'intro') !== 'sorry') return;
this.paper(true);
this.setState({ stage: 'movie' });
setTimeout(() => this.goMain(), 3800);
}
tapMovie() {
this.goMain();
}
goMain() {
const st = this.state || {};
if (st.stage !== 'movie') return;
this.paper(true);
this.setState({ stage: 'panning' });
setTimeout(() => {
const cur = this.state || {};
if (cur.stage === 'panning') this.setState({ stage: 'main' });
}, 950);
}
goForgive() {
this.paper(true);
this.setState({ stage: 'forgive' });
}
yesTap() {
const st = this.state || {};
const n = st.noTaps || 0;
if (n >= 6) {
if (!st.done) { this.chime(); this.setState({ done: true }); }
return;
}
if (!st.yesSeen) { this.boop(); this.setState({ yesSeen: true }); }
}
noTap() {
const st = this.state || {};
const n = st.noTaps || 0;
if (n >= 6) return;
this.boop();
this.setState({ noTaps: n + 1, shakes: (st.shakes || 0) + 1 });
}
renderVals() {
const st = this.state || {};
const stage = st.stage || 'intro';
const sel = st.sel || 0;
const n = st.noTaps || 0;
const full = n >= 6;
const folders = [
{ name: 'Your Photos', count: '15 photos' },
{ name: 'Your Makeups I really love', count: '3 looks' },
{ name: 'US', count: '3 photos, 4 videos' },
{ name: 'Your cute makeup vids', count: '4 videos' },
{ name: 'Your Videos', count: '7 videos' }
];
const tapes = ['rgba(244,167,185,0.8)', 'rgba(167,222,200,0.85)', 'rgba(250,224,150,0.9)', 'rgba(200,185,240,0.85)'];
const tints = ['#F6D5DC', '#CFEBDD', '#FBEBB9', '#E0D8F5'];
const rots = [-3, 2, -1.5, 3, 2.5, -2, 1.5];
const tapeRots = [4, -5, 3, -3, 5, -4, 2];
const make = (caps, label, ts, cs, lens) => caps.map((cap, i) => ({
cap: cap,
label: label + ' ' + (i + 1),
rot: rots[i % 7],
tapeRot: tapeRots[i % 7],
tape: tapes[(i + ts) % 4],
tint: tints[(i + cs) % 4],
length: lens ? lens[i] : ''
}));
const pics = (list, ts) => list.map((it, i) => ({
src: ASSET[it.id],
alt: it.alt,
label: 'Open photo: ' + it.alt,
hover: () => this.tick(),
open: () => this.openBox({ kind: 'photo', src: ASSET[it.id], alt: it.alt }),
pos: it.pos || 'center 30%',
ratio: it.ratio || '1 / 1',
rot: rots[i % 7],
tapeRot: tapeRots[i % 7],
tape: tapes[(i + ts) % 4]
}));
const photos = pics([
{ id: 'ff29a148bf13b77452b0b03539326d0b', alt: 'Close selfie with a pearl necklace and a peace sign' },
{ id: '0db77b0bbab41cd4271c697c3d52d364', alt: 'Selfie in a pink top with a gold chain', pos: 'center 40%' },
{ id: 'e4a10f425e66843a5de7e2af809f67f0', alt: 'Looking down in a patterned top with a clover necklace', pos: 'center 20%' },
{ id: '6c3a18818dad51d4baa92a383f53e200', alt: 'Resting a cheek on a hand, with a watch and bracelets' },
{ id: 'f5e1807aa06903aa66924874bbdbc04a', alt: 'Purple nails held up in front of the face' },
{ id: 'f70e932dc0fb64ab62e3b0a2c232c91f', alt: 'Selfie with a heart necklace and purple nails' },
{ id: 'd23f0522121f5f1725cb4ac477817cc3', alt: 'Smiling selfie in a striped shirt with a pearl necklace', pos: 'center 35%' },
{ id: '5e3db95d2bd64cb6119f73c1a2bb277c', alt: 'Half-face selfie in a car' },
{ id: '8c2909ec63569891fe24ac91ada3d5b6', alt: 'Selfie with a green cap, glasses and a moustache filter', pos: 'center 35%' },
{ id: '35387a99e1d9a25779afc5bf06e59fcf', alt: 'Smiling selfie with a heart necklace', pos: 'center 35%' },
{ id: 'a5e6b55eef1797cebecc76dda21e856a', alt: 'Peace sign with bracelets and a watch' },
{ id: 'e2a87b0aa86dc8b6ba9f1466b5af0295', alt: 'Peace sign with purple nails in a soft pink cardigan', pos: 'center 30%' },
{ id: '49a34a10d9f07ac6e1adab856e606e2c', alt: 'Selfie in a pink tee by a window with bracelets', pos: 'center 30%' },
{ id: '92fd8820ebe79f0aeddf1cca23ca3bbb', alt: 'Standing with a skateboard under a cloudy evening sky', pos: 'center 62%' },
{ id: 'b12b1bf7cc616c95c1001f2a5e438867', alt: 'Resting on a library table beside a phone and beaded charm', pos: 'center 42%' }
], 0);
const makeups = pics([
{ id: '66237d5aac2144724541578a4e69e35e', alt: 'Face paint look with a butterfly clip', ratio: '4 / 5' },
{ id: '31aaa203acc1e4857d667913d23529a6', alt: 'Textured half-face makeup look in a pink sweater', ratio: '4 / 5', pos: 'center 25%' },
{ id: 'a909e37ec3a6f74fff98265c2b5321d4', alt: 'Face paint look under blue light', ratio: '4 / 5' }
], 1);
const usPics = pics([
{ id: 'f4a928b90340284c10f8cd1e6ce1c004', alt: 'Two friends in a selfie at a restaurant', ratio: '4 / 3', pos: 'left center' },
{ id: '6edac40e4c29514e9a22623c95478fae', alt: 'A drawing-app screenshot with a funny caption', pos: 'center 62%' },
{ id: '9fa3b5749ec9ca97eb4e19701b84c68d', alt: 'A close selfie in a light blue top', pos: 'center 25%' }
], 3);
const B = (id, p, w, h, cap) => ({ id: id, p: p, r: w + ' / ' + h, cap: cap });
const usV = [
B('c8ae6000612f4f5dcd262cf2bc0aac8c', 'a24d802a7713600d8f01ddccaa7c252e', 480, 848, 'I missed Swep lwky'),
B('13632838a211040cc2c70170acb1b4ea', '4b3c8d16483f43821fabab39312c8e1e', 576, 1024, 'So cool'),
B('25e16b9816142ac4aae091b91b2c43a3', 'bd7ecfaabbfd29b3641b5db76e9dfd1a', 576, 1024, 'What was this bro'),
B('013cc81f88031ae1a06fc63a1afbd730', '8a5d48c029aad0e7f48a7a2d5b7c70ef', 368, 800, 'Yeah... ummm')
];
const cuteV = [
B('f1503d9cff8729f6f1b57727c1711b89', '26d34291f8a4826bf01d1b84327776bf', 576, 1024, 'Love it'),
B('f30ec325ef6db5d4cc5d14f080bf77ba', '4b0e490aa90e0f480903da47741c0bfd', 480, 848, 'This too'),
B('e3d610b1a233d48fdc6f4836fb2e1b03', '0d0dd79df9f6a6f5c1ffd09926ab5657', 480, 848, 'loved it'),
B('4396214bd264e4ad09c87762880a4d55', 'b49548ca938c025e68bd03294afa15ae', 576, 1024, 'This was terrifying')
];
const yourV = [
B('1e6171a580cb964c53e021d46ec8e988', '6f770a107107d163f40031c43b75c784', 576, 1024, 'Cool ash'),
B('47d5686ddd099a70418197f9d490322d', 'a7d0f8efa55764d68f91bf3ecf3d7994', 576, 1024, 'What was this'),
B('db651fbcdffd538c428c6246b26532fa', '6093a84dab674d3c31b621e8830c6aa3', 576, 1024, 'Cuteeeeee'),
B('030ca2f58f4bf0069e4e91b9545f0569', '22f54c0f3219e272a6e7860421215941', 480, 848, 'loved the transition'),
B('b88eb844bb14c5ecc3fec0eff3c2ee73', '7a4e4187ea8c77004e00bb50aa2b26c9', 480, 848, 'loved this alot'),
B('7fe939df0445b97145ccae9acbcc2e68', '5d122f8e68e631a49961c82b93a67361', 464, 832, 'Yeah ummm what was this'),
B('4bde4f7680df8ddaf55aab07a496f534', 'dfbb67b6947f309eaa26a677c82dc7f1', 576, 1024, 'Yeah.. umm lemme crack bruh not now ik')
];
const vids = (list) => list.map((it, i) => ({
cap: it.cap,
label: 'Play video: ' + it.cap,
hover: () => this.tick(),
open: () => this.openBox({ kind: 'video', src: ASSET[it.id], poster: ASSET[it.p], cap: it.cap }),
src: ASSET[it.id],
poster: ASSET[it.p],
ratio: it.r,
rot: rots[(i + 2) % 7],
tapeRot: tapeRots[i % 7],
tape: tapes[i % 4]
}));
const bx = st.box;
const boxHearts = [];
if (bx) {
const hc = ['#F4A7B9', '#E0607E', '#FFD966', '#C8B9F0', '#A7DEC8'];
for (let i = 0; i < 16; i++) {
const a = (i / 16) * Math.PI * 2;
boxHearts.push({
dx: Math.round(Math.cos(a) * (110 + (i % 4) * 45)),
up: Math.round(Math.sin(a) * (110 + (i % 3) * 40)) - 30,
delay: ((i % 5) * 0.04).toFixed(2),
sz: 16 + (i % 3) * 7,
color: hc[i % 5]
});
}
}
const palette = ['#F4A7B9', '#FBEBB9', '#A7DEC8', '#C8B9F0', '#E0607E', '#FFD966', '#7EC8F0'];
const confetti = [];
if (st.done) {
for (let i = 0; i < 72; i++) {
const a = i * 2.39996;
confetti.push({
dx: Math.round(Math.cos(a) * (18 + (i % 9) * 6)),
up: -(12 + (i % 6) * 9),
w: 8 + (i % 4) * 2,
h: 12 + (i % 5) * 2,
color: palette[i % 7],
r: i % 3 === 0 ? '50%' : '2px',
dur: (2.6 + (i % 5) * 0.25).toFixed(2),
delay: ((i % 8) * 0.03).toFixed(2)
});
}
}
const tiers = [1, 1.5, 2.2, 3.2, 4.6, 6.5];
const noMsgs = ['nope, not allowed', 'nice try', 'still no', 'the answer is yes', 'you know what to press'];
const shakes = st.shakes || 0;
return {
showIntro: stage === 'intro',
showSorry: stage === 'sorry',
showMovie: stage === 'movie' || stage === 'panning',
showMain: stage === 'main' || stage === 'panning',
showForgive: stage === 'forgive',
movieCls: stage === 'panning' ? 'slide pan-out' : 'slide',
mainCls: stage === 'panning' ? 'pan-in' : '',
tapSorry: () => this.tapSorry(),
tapMovie: () => this.tapMovie(),
goForgive: () => this.goForgive(),
yesTap: () => this.yesTap(),
noTap: () => this.noTap(),
yesCls: full ? 'note-btn note-yes yes-full' : 'note-btn note-yes',
yesRot: full ? '0deg' : '-3deg',
yesScale: full ? 1 : tiers[n],
yesFont: full ? (st.done ? 'clamp(56px, 13vw, 130px)' : 'clamp(80px, 26vw, 260px)') : '60px',
yesLabel: st.done ? 'Thank you' : 'Yes',
noCls: 'note-btn note-no' + (shakes ? (shakes % 2 ? ' shake-a' : ' shake-b') : ''),
noMsg: n > 0 && !full ? noMsgs[(n - 1) % noMsgs.length] : '',
showPop: !!st.yesSeen && n === 0,
showNo: !full,
soundOn: !st.muted,
soundOff: !!st.muted,
toggleSound: () => this.toggleSound(),
tapIntro: () => this.tapIntro(),
closeBox: () => this.closeBox(),
showBox: !!bx,
boxIsPhoto: !!bx && bx.kind === 'photo',
boxIsVideo: !!bx && bx.kind === 'video',
boxSrc: bx ? bx.src : '',
boxPoster: bx && bx.poster ? bx.poster : '',
boxAlt: bx && bx.alt ? bx.alt : '',
boxCap: bx && bx.cap ? bx.cap : '',
boxHearts: boxHearts,
done: !!st.done,
confetti: confetti,
folderItems: folders.map((f, i) => ({
name: f.name,
count: f.count,
on: i === sel,
cls: i === sel ? 'folder-btn is-on' : 'folder-btn',
pick: () => this.pick(i),
hover: () => this.tick()
})),
show0: sel === 0,
show1: sel === 1,
show2: sel === 2,
show3: sel === 3,
show4: sel === 4,
photos: photos,
makeups: makeups,
usPics: usPics,
usVids: vids(usV),
cuteVids: vids(cuteV),
moreVids: vids(yourV),
flowers: st.flowers || []
};
}
}


(function () {
  const t = document.createElement('template');
  t.innerHTML = document.getElementById('tpl').textContent;
  TPL = t.content;
  APP = document.getElementById('app');
  const comp = new Component();
  document.addEventListener('click', (e) => { const el = e.target.closest && e.target.closest('[data-hc]'); if (el) { const h = handlers[+el.getAttribute('data-hc')]; if (h) h(e); } });
  document.addEventListener('mouseover', (e) => { const el = e.target.closest && e.target.closest('[data-hm]'); if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) { const h = handlers[+el.getAttribute('data-hm')]; if (h) h(e); } });
  comp.forceUpdate();
})();
