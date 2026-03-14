/**
 * site-renderer.ts
 * Pure TypeScript rendering engine.
 * Exports:
 *   renderStyles(SD)  → raw CSS string (inject into document.head)
 *   renderBody(SD)    → sections HTML string only (bind via [innerHTML])
 *   renderSite(SD)    → full standalone HTML document (kept for other uses)
 */
import { SiteData, SiteSection } from '../../shared/event.model';

function esc(s: any): string {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatHeadline(h: string, fallback: string): string {
  const text = h || fallback;
  const words = esc(text).split(' ');
  if (words.length > 1) {
    const mid = Math.floor(words.length / 2);
    words[mid] = `<em>${words[mid]}</em>`;
  }
  return words.join(' ');
}

function getNavBrand(SD: SiteData): string {
  const hero = SD.sections.find(s => s.type === 'hero');
  return hero?.data['navBrand'] || 'Arreglado';
}

function navLinks(SD: SiteData): string {
  const types = SD.sections.map(s => s.type);
  const links: [string, string][] = [];
  if (types.includes('about-simple') || types.includes('about-centered') || types.includes('about-stats')) links.push(['#about','About']);
  if (types.includes('features')) links.push(['#features','Services']);
  if (types.includes('form'))     links.push(['#form','Register']);
  if (types.includes('contact'))  links.push(['#contact','Contact']);
  return links.map(([href,label]) => `<a href="${href}">${label}</a>`).join('');
}

function socialBar(d: Record<string,any>, cls: string): string {
  const links: [string,string][] = [];
  if (d['twitter'])   links.push([d['twitter'],'𝕏']);
  if (d['instagram']) links.push([d['instagram'],'◈']);
  if (d['linkedin'])  links.push([d['linkedin'],'in']);
  return links.map(([url,icon]) => `<a href="${esc(url)}" class="${cls}" target="_blank" rel="noopener">${icon}</a>`).join('');
}

function renderField(f: any, inputCls: string, taCls: string, selCls: string, lblCls: string): string {
  const req = f.required ? `<span style="color:var(--c1)">*</span>` : '';
  const lbl = `<label class="${lblCls}">${esc(f.label)}${req}</label>`;
  if (f.type === 'textarea') return `<div>${lbl}<textarea class="${taCls}" placeholder="${esc(f.placeholder||'')}" ${f.required?'required':''}></textarea></div>`;
  if (f.type === 'select') {
    const opts = (f.options||[]).map((o: string) => `<option>${esc(o)}</option>`).join('');
    return `<div>${lbl}<select class="${selCls}" ${f.required?'required':''}><option value="">— Select —</option>${opts}</select></div>`;
  }
  const typeMap: Record<string,string> = {email:'email',phone:'tel',number:'number',url:'url'};
  const t = typeMap[f.type] || 'text';
  return `<div>${lbl}<input type="${t}" class="${inputCls}" placeholder="${esc(f.placeholder||'')}" ${f.required?'required':''}></div>`;
}

function renderForm(sec: SiteSection, L: string): string {
  const d = sec.data;
  const PX = L === 'agency' ? 'a' : L === 'minimal' ? 'm' : 'b';
  const inputCls = `${PX}-cf-input`, taCls = `${PX}-cf-ta`, selCls = `${PX}-cf-sel`;
  const lblCls   = `${PX}-cf-lbl`,  submitCls = `${PX}-cf-submit`, successCls = `${PX}-cf-success`;

  let rows = '';
  let i = 0;
  const fields = d['fields'] || [];
  while (i < fields.length) {
    const f = fields[i];
    if (f.width === 'half' && i+1 < fields.length && fields[i+1].width === 'half') {
      rows += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${renderField(f,inputCls,taCls,selCls,lblCls)}${renderField(fields[i+1],inputCls,taCls,selCls,lblCls)}</div>`;
      i += 2;
    } else {
      rows += renderField(f,inputCls,taCls,selCls,lblCls);
      i++;
    }
  }

  return `<div id="${esc(sec.id)}">${rows}
    <button type="button" class="${submitCls}"
      onclick="(function(el){
        var ins=el.parentElement.querySelectorAll('[required]');var ok=true;
        ins.forEach(function(i){if(!i.value.trim()){i.style.borderColor='#ff4d6a';ok=false;}else i.style.borderColor='';});
        if(!ok)return;
        el.style.display='none';
        document.getElementById('${esc(sec.id)}-success').style.display='block';
      })(this)">${esc(d['submitLabel']||'Send')}</button>
    <div class="${successCls}" id="${esc(sec.id)}-success" style="display:none">${esc(d['successMsg']||"Thanks!")}</div>
  </div>`;
}

// ── SECTION RENDERERS ────────────────────────────────────────────────────────

function renderHero(sec: SiteSection, L: string, SD: SiteData): string {
  const d = sec.data;
  const heroImg = d['heroImg'] ? `style="background-image:url('${d['heroImg']}')"` : '';
  const nl = navLinks(SD);
  const brand = esc(d['navBrand'] || 'MyBrand');

  if (L === 'agency') return `
    <nav class="a-nav">
      <div class="a-nav-brand">${brand}</div>
      <div class="a-nav-links">${nl}</div>
      ${d['cta']?`<a href="${esc(d['ctaLink']||'#contact')}" class="a-nav-cta">${esc(d['cta'])}</a>`:''}
    </nav>
    <section class="a-hero" id="hero">
      ${d['heroImg']?`<div class="a-hero-bg" ${heroImg}></div>`:''}
      <div class="a-hero-grad"></div>
      <div class="a-hero-content">
        <div class="a-hero-badge">✦ ${esc(d['eyebrow']||'Welcome')}</div>
        <h1>${formatHeadline(d['headline'],'We build things that matter')}</h1>
        <p>${esc(d['sub']||'A short description of your event.')}</p>
        <div class="a-hero-btns">
          ${d['cta']?`<a href="${esc(d['ctaLink']||'#contact')}" class="a-btn-p">${esc(d['cta'])}</a>`:''}
          <a href="#about" class="a-btn-g">Learn more</a>
        </div>
      </div>
    </section>`;

  if (L === 'minimal') return `
    <nav class="m-nav">
      <div class="m-nav-brand">${brand}</div>
      <div class="m-nav-links">${nl}</div>
      ${d['cta']?`<a href="${esc(d['ctaLink']||'#contact')}" class="m-nav-cta">${esc(d['cta'])}</a>`:''}
    </nav>
    <section class="m-hero" id="hero">
      ${d['heroImg']?`<img src="${d['heroImg']}" class="m-hero-img" alt=""/>`:`<div class="m-hero-img-ph">🖼</div>`}
      <div class="m-hero-fade"></div>
      <div class="m-hero-content">
        <div class="m-eyebrow">${esc(d['eyebrow']||'Upcoming Event')}</div>
        <h1>${formatHeadline(d['headline'],'Your Event <em>Headline</em>')}</h1>
        <p>${esc(d['sub']||'')}</p>
        <div class="m-hero-btns">
          ${d['cta']?`<a href="${esc(d['ctaLink']||'#contact')}" class="m-btn-p">${esc(d['cta'])}</a>`:''}
          <a href="#about" class="m-btn-g">Learn more</a>
        </div>
      </div>
    </section>`;

  return `
    <nav class="b-nav">
      <div class="b-nav-brand">${brand}</div>
      <div class="b-nav-links">${nl}</div>
      ${d['cta']?`<a href="${esc(d['ctaLink']||'#contact')}" class="b-nav-cta">${esc(d['cta'])}</a>`:''}
    </nav>
    <section class="b-hero" id="hero">
      ${d['heroImg']?`<div class="b-hero-bg" ${heroImg}></div>`:''}
      <div class="b-hero-grad"></div>
      <div class="b-hero-content">
        <div class="b-hero-line"></div>
        <h1><span>${esc(d['eyebrow']||'EVENT')}</span>${esc(d['headline']||'Your Bold Headline')}</h1>
        <p>${esc(d['sub']||'')}</p>
        <div class="b-hero-btns">
          ${d['cta']?`<a href="${esc(d['ctaLink']||'#contact')}" class="b-btn-p">${esc(d['cta'])}</a>`:''}
          <a href="#about" class="b-btn-g">Learn more</a>
        </div>
      </div>
    </section>`;
}

function renderAboutSimple(sec: SiteSection, L: string): string {
  const d = sec.data;
  const imgSide = d['imgPos'] === 'right' ? 'img-right' : 'img-left';
  const imgTag = d['img'] ? `<img src="${d['img']}" alt="" style="width:100%;height:100%;object-fit:cover"/>` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem">🖼</div>`;

  if (L === 'agency') return `<section class="a-ab-s ${imgSide}" id="about" data-r>
    <div class="a-ab-img">${imgTag}</div>
    <div class="a-ab-txt">
      <div class="eyebrow">${esc(d['eyebrow']||'About')}</div>
      <h2>${esc(d['title']||'About This Event')}</h2>
      <p>${esc(d['body']||'')}</p>
      ${d['tagline']?`<div class="a-ab-txt tagline">${esc(d['tagline'])}</div>`:''}
    </div>
  </section>`;

  if (L === 'minimal') return `<section class="m-ab-s ${imgSide}" id="about" data-r>
    <div class="m-ab-img">${imgTag}</div>
    <div class="m-ab-txt">
      <div class="m-eyebrow2">${esc(d['eyebrow']||'About')}</div>
      <h2>${esc(d['title']||'About This Event')}</h2>
      <p>${esc(d['body']||'')}</p>
      ${d['tagline']?`<div class="m-ab-txt tagline">${esc(d['tagline'])}</div>`:''}
    </div>
  </section>`;

  return `<section class="b-ab-s ${imgSide}" id="about" data-r>
    <div class="b-ab-img">${imgTag}</div>
    <div class="b-ab-txt">
      <div class="b-eyebrow">${esc(d['eyebrow']||'About')}</div>
      <h2>${esc(d['title']||'About This Event')}</h2>
      <p>${esc(d['body']||'')}</p>
    </div>
  </section>`;
}

function renderAboutCentered(sec: SiteSection, L: string): string {
  const d = sec.data;
  const bannerTag = d['bannerImg'] ? `<div style="margin-top:44px;border-radius:6px;overflow:hidden;height:280px"><img src="${d['bannerImg']}" style="width:100%;height:100%;object-fit:cover" alt=""/></div>` : '';
  const quoteTag  = d['showQuote'] && d['quote'] ? `<div class="${L==='agency'?'a-ab-c-quote':L==='minimal'?'m-ab-c-quote':'b-ab-c-quote'}">"${esc(d['quote'])}"</div>` : '';

  if (L === 'agency') return `<section class="a-ab-c" id="about" data-r>
    <div class="eyebrow">${esc(d['eyebrow']||'Overview')}</div>
    <h2>${esc(d['title']||'Event Overview')}</h2>
    <p>${esc(d['body']||'')}</p>
    ${quoteTag}${bannerTag}
  </section>`;

  if (L === 'minimal') return `<section class="m-ab-c" id="about" data-r>
    <div class="m-eyebrow2">${esc(d['eyebrow']||'Overview')}</div>
    <h2>${esc(d['title']||'Event Overview')}</h2>
    <p>${esc(d['body']||'')}</p>
    ${quoteTag}${bannerTag}
  </section>`;

  return `<section class="b-ab-c" id="about" data-r>
    <div class="b-eyebrow">${esc(d['eyebrow']||'Overview')}</div>
    <h2>${esc(d['title']||'Event Overview')}</h2>
    <p>${esc(d['body']||'')}</p>
    ${quoteTag}${bannerTag}
  </section>`;
}

function renderAboutStats(sec: SiteSection, L: string): string {
  const d = sec.data;
  const stats = (d['stats'] || []) as {num: string; label: string}[];
  const statsHtml = stats.map(s => {
    const cls = L === 'agency' ? 'stat-card' : L === 'minimal' ? 'm-stat-card' : 'b-stat-card';
    const numCls = L === 'agency' ? 'stat-num' : L === 'minimal' ? 'm-stat-num' : 'b-stat-num';
    const lblCls = L === 'agency' ? 'stat-lbl' : L === 'minimal' ? 'm-stat-lbl' : 'b-stat-lbl';
    return `<div class="${cls}"><div class="${numCls}">${esc(s.num)}</div><div class="${lblCls}">${esc(s.label)}</div></div>`;
  }).join('');
  const gridCls = L === 'agency' ? 'stats-grid' : L === 'minimal' ? 'm-stats-grid' : 'b-stats-grid';
  const secCls  = L === 'agency' ? 'a-ab-st' : L === 'minimal' ? 'm-ab-st' : 'b-ab-st';
  const eyeCls  = L === 'agency' ? 'eyebrow' : L === 'minimal' ? 'm-eyebrow2' : 'b-eyebrow';

  return `<section class="${secCls}" id="about" data-r>
    <div>
      <div class="${eyeCls}">${esc(d['eyebrow']||'Key Details')}</div>
      <h2>${esc(d['title']||'About Us')}</h2>
      <p>${esc(d['body']||'')}</p>
    </div>
    <div class="${gridCls}">${statsHtml}</div>
  </section>`;
}

function renderFeatures(sec: SiteSection, L: string): string {
  const d = sec.data;
  const items = (d['items'] || []) as {emoji: string; title: string; desc: string}[];

  if (L === 'agency') return `<section class="a-feat" id="features" data-r>
    <h2>${esc(d['title']||'Event Highlights')}</h2>
    <div class="feat-grid">${items.map(i => `<div class="a-feat-card"><span class="fc-emoji">${esc(i.emoji)}</span><h3>${esc(i.title)}</h3><p>${esc(i.desc)}</p></div>`).join('')}</div>
  </section>`;

  if (L === 'minimal') return `<section class="m-feat" id="features" data-r>
    <div class="m-feat-hd"><div class="m-eyebrow2">Highlights</div><h2>${esc(d['title']||'Event Highlights')}</h2></div>
    <div class="m-feat-grid">${items.map(i => `<div class="m-feat-card"><div class="m-fc-emoji">${esc(i.emoji)}</div><h3>${esc(i.title)}</h3><p>${esc(i.desc)}</p></div>`).join('')}</div>
  </section>`;

  return `<section class="b-feat" id="features" data-r>
    <div class="b-feat-hd"><h2>${esc(d['title']||'Event Highlights')}</h2><div class="b-feat-line"></div></div>
    <div class="b-feat-grid">${items.map(i => `<div class="b-feat-card"><span class="b-fc-emoji">${esc(i.emoji)}</span><h3>${esc(i.title)}</h3><p>${esc(i.desc)}</p></div>`).join('')}</div>
  </section>`;
}

function renderFormSection(sec: SiteSection, L: string): string {
  const d = sec.data;
  const eyeCls = L === 'agency' ? 'eyebrow' : L === 'minimal' ? 'm-eyebrow2' : 'b-eyebrow';
  const secCls = L === 'agency' ? 'a-form-sec' : L === 'minimal' ? 'm-form-sec' : 'b-form-sec';
  return `<section class="${secCls}" id="form" data-r>
    <div class="${eyeCls}">${esc(d['eyebrow']||'Register')}</div>
    <h2>${esc(d['title']||'Register Now')}</h2>
    ${d['desc']?`<p class="form-desc">${esc(d['desc'])}</p>`:''}
    ${renderForm(sec, L)}
  </section>`;
}

function renderContact(sec: SiteSection, L: string, SD: SiteData): string {
  const d = sec.data;
  const copy = esc(d['footerCopy'] || `© ${new Date().getFullYear()} ${getNavBrand(SD)}. All rights reserved.`);

  if (L === 'agency') return `
    <section class="a-contact" id="contact" data-r>
      <h2>${esc(d['title']||"Let's Talk")}</h2>
      <p>${esc(d['body']||'')}</p>
      <div class="contact-links">
        ${d['email']?`<a href="mailto:${esc(d['email'])}" class="c-link">✉ ${esc(d['email'])}</a>`:''}
        ${d['phone']?`<a href="tel:${esc(d['phone'])}" class="c-link">☎ ${esc(d['phone'])}</a>`:''}
        <div class="social-bar">${socialBar(d,'s-btn')}</div>
      </div>
    </section>
    <footer class="a-footer"><span>${copy}</span><span>Built with Arreglado</span></footer>`;

  if (L === 'minimal') return `
    <section class="m-contact" id="contact" data-r>
      <h2>${esc(d['title']||"Let's Talk")}</h2>
      <p>${esc(d['body']||'')}</p>
      <div class="m-contact-links">
        ${d['email']?`<a href="mailto:${esc(d['email'])}" class="m-c-link">✉ ${esc(d['email'])}</a>`:''}
        ${d['phone']?`<a href="tel:${esc(d['phone'])}" class="m-c-link">☎ ${esc(d['phone'])}</a>`:''}
        <div class="m-social-bar">${socialBar(d,'m-s-btn')}</div>
      </div>
    </section>
    <footer class="m-footer"><span>${copy}</span><span style="color:#222">Arreglado</span></footer>`;

  const titleWords = esc(d['title']||"Let's Talk").split(' ');
  if (titleWords.length > 1) titleWords[0] = `<span>${titleWords[0]}</span>`;
  return `
    <section class="b-contact" id="contact" data-r>
      <h2>${titleWords.join(' ')}</h2>
      <p>${esc(d['body']||'')}</p>
      <div class="b-contact-links">
        ${d['email']?`<a href="mailto:${esc(d['email'])}" class="b-c-link">✉ ${esc(d['email'])}</a>`:''}
        ${d['phone']?`<a href="tel:${esc(d['phone'])}" class="b-c-link">☎ ${esc(d['phone'])}</a>`:''}
        <div class="b-social-bar">${socialBar(d,'b-s-btn')}</div>
      </div>
    </section>
    <footer class="b-footer"><span>${copy}</span><span>ARREGLADO</span></footer>`;
}

function renderSection(sec: SiteSection, L: string, SD: SiteData): string {
  switch (sec.type) {
    case 'hero':           return renderHero(sec, L, SD);
    case 'about-simple':   return renderAboutSimple(sec, L);
    case 'about-centered': return renderAboutCentered(sec, L);
    case 'about-stats':    return renderAboutStats(sec, L);
    case 'features':       return renderFeatures(sec, L);
    case 'form':           return renderFormSection(sec, L);
    case 'contact':        return renderContact(sec, L, SD);
    default: return '';
  }
}

// ── CSS STRING (no <style> tags) ─────────────────────────────────────────────
export function renderStyles(SD: SiteData): string {
  const c1 = SD.theme?.primary   || '#7c6aff';
  const c2 = SD.theme?.secondary || '#ff6a8a';
  const customCss = SD.theme?.customCss || '';

  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{--c1:${c1};--c2:${c2}}
[data-r]{opacity:0;transform:translateY(22px);transition:opacity .55s,transform .55s}
[data-r].vis{opacity:1;transform:none}
@keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
/* ── AGENCY ── */
body.agency{--bg:#0a0a0f;--surface:#111118;--surface2:#18181f;--text:#e2e2ee;--muted:rgba(226,226,238,.45);--border:rgba(255,255,255,.07);background:var(--bg);color:var(--text)}
.a-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 6vw;height:62px;background:rgba(10,10,15,.82);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
.a-nav-brand{font-family:'Syne',sans-serif;font-weight:800;font-size:1.05rem;color:#fff}
.a-nav-links{display:flex;gap:28px}.a-nav-links a{color:rgba(255,255,255,.5);font-size:.83rem;text-decoration:none;transition:color .18s}.a-nav-links a:hover{color:#fff}
.a-nav-cta{padding:8px 20px;background:var(--c1);color:#fff;border-radius:7px;text-decoration:none;font-size:.82rem;font-weight:600;transition:all .18s}.a-nav-cta:hover{filter:brightness(1.15);transform:translateY(-1px)}
.a-hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;background:var(--bg);padding:100px 6vw 80px}
.a-hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.2;filter:saturate(.6)}
.a-hero-grad{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 55% 50%,rgba(124,106,255,.13),transparent 70%),linear-gradient(180deg,transparent 50%,var(--bg))}
.a-hero-content{position:relative;z-index:2;max-width:780px}
.a-hero-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;background:rgba(124,106,255,.1);border:1px solid rgba(124,106,255,.3);border-radius:50px;font-size:.72rem;color:var(--c1);letter-spacing:.08em;text-transform:uppercase;margin-bottom:26px}
.a-hero h1{font-family:'Syne',sans-serif;font-size:clamp(2.8rem,7vw,5.5rem);font-weight:800;line-height:1.03;letter-spacing:-.03em;color:#fff}
.a-hero h1 em{font-style:normal;background:linear-gradient(90deg,var(--c1),var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.a-hero p{margin-top:22px;font-size:1rem;line-height:1.75;color:var(--muted);max-width:520px}
.a-hero-btns{display:flex;gap:12px;margin-top:34px;flex-wrap:wrap}
.a-btn-p{padding:13px 30px;background:var(--c1);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:.88rem;transition:all .2s}.a-btn-p:hover{transform:translateY(-2px)}
.a-btn-g{padding:13px 30px;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.65);border-radius:8px;text-decoration:none;font-size:.88rem;transition:all .2s}.a-btn-g:hover{color:#fff;border-color:rgba(255,255,255,.35)}
.a-ab-s{padding:110px 6vw;background:var(--bg);display:grid;gap:72px;align-items:center}
.a-ab-s.img-left{grid-template-columns:1fr 1fr}.a-ab-s.img-right{grid-template-columns:1fr 1fr}
.a-ab-s.img-right .a-ab-img{order:2}.a-ab-s.img-right .a-ab-txt{order:1}
.a-ab-img{border-radius:12px;overflow:hidden;aspect-ratio:4/3;background:var(--surface);position:relative}
.eyebrow{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--c1);margin-bottom:12px}
.a-ab-txt h2{font-family:'Syne',sans-serif;font-size:clamp(1.9rem,3.2vw,2.7rem);font-weight:700;color:#fff;line-height:1.15}
.a-ab-txt p{margin-top:16px;color:var(--muted);line-height:1.82;font-size:.92rem}
.a-ab-c{padding:110px 6vw;background:var(--surface);text-align:center}
.a-ab-c h2{font-family:'Syne',sans-serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:700;color:#fff;max-width:700px;margin:0 auto;line-height:1.15}
.a-ab-c>p{color:var(--muted);line-height:1.82;font-size:.92rem;max-width:620px;margin:18px auto 0}
.a-ab-c-quote{max-width:560px;margin:32px auto 0;padding:20px 28px;border-left:3px solid var(--c1);background:rgba(124,106,255,.05);border-radius:0 8px 8px 0;text-align:left;font-size:1rem;color:rgba(255,255,255,.75);font-style:italic;line-height:1.7}
.a-ab-st{padding:110px 6vw;background:var(--bg);display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
.a-ab-st h2{font-family:'Syne',sans-serif;font-size:clamp(1.9rem,3vw,2.6rem);font-weight:700;color:#fff;line-height:1.15}
.a-ab-st>div>p{margin-top:16px;color:var(--muted);line-height:1.82;font-size:.92rem}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--c1),var(--c2));opacity:.06}
.stat-num{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;color:var(--c1);line-height:1}
.stat-lbl{font-size:.75rem;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
.a-feat{padding:100px 6vw;background:var(--surface)}
.a-feat h2{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,3vw,2.4rem);font-weight:700;color:#fff;text-align:center;margin-bottom:52px}
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
.a-feat-card{background:var(--bg);border:1px solid var(--border);border-radius:11px;padding:26px;transition:all .2s}
.a-feat-card:hover{border-color:rgba(124,106,255,.3);transform:translateY(-4px)}
.fc-emoji{font-size:1.9rem;margin-bottom:12px;display:block}
.a-feat-card h3{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700;color:#fff;margin-bottom:7px}
.a-feat-card p{font-size:.8rem;color:rgba(255,255,255,.42);line-height:1.65}
.a-form-sec{padding:100px 6vw;background:var(--bg)}
.a-form-sec h2{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,3vw,2.4rem);font-weight:700;color:#fff;margin-bottom:8px}
.a-form-sec>.form-desc{color:var(--muted);margin-bottom:36px;font-size:.9rem;line-height:1.7}
label.a-cf-lbl{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.45);margin-bottom:6px}
.a-cf-input,.a-cf-ta,.a-cf-sel{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.9rem;padding:11px 14px;outline:none;transition:border-color .15s}
.a-cf-input:focus,.a-cf-ta:focus,.a-cf-sel:focus{border-color:var(--c1)}
.a-cf-ta{resize:vertical;min-height:100px;line-height:1.6}
.a-cf-submit{padding:13px 32px;background:var(--c1);color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .2s;margin-top:12px}
.a-cf-submit:hover{filter:brightness(1.15);transform:translateY(-1px)}
.a-cf-success{padding:18px 22px;background:rgba(61,220,132,.08);border:1px solid rgba(61,220,132,.25);border-radius:9px;color:#3ddc84;font-size:.88rem;margin-top:16px}
.a-contact{padding:110px 6vw;background:var(--bg);text-align:center;position:relative;overflow:hidden}
.a-contact h2{font-family:'Syne',sans-serif;font-size:clamp(2.5rem,5vw,4.2rem);font-weight:800;color:#fff}
.a-contact>p{color:var(--muted);margin-top:14px;max-width:460px;margin-left:auto;margin-right:auto;line-height:1.75;font-size:.92rem}
.contact-links{margin-top:38px;display:flex;flex-direction:column;align-items:center;gap:10px}
.c-link{color:var(--c1);text-decoration:none;font-size:1.05rem;font-weight:500;transition:opacity .2s}.c-link:hover{opacity:.65}
.social-bar{display:flex;gap:12px;margin-top:12px}
.s-btn{width:38px;height:38px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:.85rem;text-decoration:none;transition:all .15s;color:#fff}.s-btn:hover{background:rgba(124,106,255,.15);border-color:var(--c1)}
.a-footer{background:var(--surface);border-top:1px solid var(--border);padding:18px 6vw;display:flex;align-items:center;justify-content:space-between}
.a-footer span{font-size:.72rem;color:rgba(255,255,255,.2)}
/* ── MINIMAL ── */
body.minimal{background:#f8f5f0;color:#1a1a1a}
.m-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 8vw;height:60px;background:rgba(248,245,240,.94);backdrop-filter:blur(10px);border-bottom:1px solid #e8e3db}
.m-nav-brand{font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;color:#1a1a1a}
.m-nav-links{display:flex;gap:26px}.m-nav-links a{color:#999;font-size:.8rem;text-decoration:none;transition:color .15s}.m-nav-links a:hover{color:#1a1a1a}
.m-nav-cta{padding:7px 18px;border-radius:5px;font-size:.78rem;font-weight:600;text-decoration:none;background:#1a1a1a;color:#fff;transition:all .18s}.m-nav-cta:hover{background:var(--c1)}
.m-hero{min-height:100vh;display:flex;align-items:center;padding:100px 8vw 80px;background:#f8f5f0;position:relative;overflow:hidden}
.m-hero-img{position:absolute;right:0;top:0;bottom:0;width:44vw;object-fit:cover;opacity:.9}
.m-hero-img-ph{position:absolute;right:0;top:0;bottom:0;width:44vw;background:linear-gradient(135deg,#e8e3db,#d4cdc5);display:flex;align-items:center;justify-content:center;font-size:5rem}
.m-hero-fade{position:absolute;right:0;top:0;bottom:0;width:44vw;background:linear-gradient(to right,#f8f5f0 20%,transparent);pointer-events:none}
.m-hero-content{position:relative;max-width:52vw}
.m-eyebrow{font-size:.65rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--c1);margin-bottom:18px}
.m-hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,5vw,4.2rem);font-weight:700;line-height:1.1;color:#1a1a1a}
.m-hero h1 em{font-style:italic;color:var(--c1)}
.m-hero p{margin-top:22px;font-size:.92rem;line-height:1.82;color:#888;max-width:420px}
.m-hero-btns{display:flex;gap:10px;margin-top:32px}
.m-btn-p{padding:12px 26px;background:#1a1a1a;color:#fff;border-radius:5px;text-decoration:none;font-size:.84rem;font-weight:600;transition:all .2s}.m-btn-p:hover{background:var(--c1);transform:translateY(-1px)}
.m-btn-g{padding:12px 26px;border:1.5px solid #ccc;color:#777;border-radius:5px;text-decoration:none;font-size:.84rem;transition:all .2s}.m-btn-g:hover{border-color:#1a1a1a;color:#1a1a1a}
.m-ab-s{padding:100px 8vw;background:#fff;display:grid;gap:72px;align-items:center}
.m-ab-s.img-left{grid-template-columns:1fr 1fr}.m-ab-s.img-right{grid-template-columns:1fr 1fr}
.m-ab-s.img-right .m-ab-img{order:2}.m-ab-s.img-right .m-ab-txt{order:1}
.m-ab-img{aspect-ratio:3/4;border-radius:4px;overflow:hidden;background:#ede9e2}
.m-eyebrow2{font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--c1);margin-bottom:12px}
.m-ab-txt h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,2.8vw,2.5rem);line-height:1.2;color:#1a1a1a}
.m-ab-txt p{margin-top:14px;color:#777;line-height:1.82;font-size:.88rem}
.m-ab-c{padding:100px 8vw;background:#f8f5f0;text-align:center}
.m-ab-c h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,3.5vw,3rem);color:#1a1a1a;max-width:640px;margin:0 auto;line-height:1.2}
.m-ab-c>p{color:#888;max-width:580px;margin:18px auto 0;line-height:1.82;font-size:.88rem}
.m-ab-st{padding:100px 8vw;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
.m-ab-st h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,2.8vw,2.5rem);color:#1a1a1a;line-height:1.2}
.m-ab-st>div>p{color:#888;margin-top:14px;line-height:1.82;font-size:.88rem}
.m-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.m-stat-card{background:#f8f5f0;border-radius:6px;padding:18px;border:1px solid #e8e3db}
.m-stat-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--c1)}
.m-stat-lbl{font-size:.72rem;color:#999;margin-top:3px;text-transform:uppercase;letter-spacing:.06em}
.m-feat{padding:90px 8vw;background:#f8f5f0}
.m-feat-hd{margin-bottom:48px}.m-feat-hd h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,2.8vw,2.4rem);color:#1a1a1a}
.m-feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;background:#e8e3db;border:1px solid #e8e3db;border-radius:7px;overflow:hidden}
.m-feat-card{background:#f8f5f0;padding:28px 24px;transition:background .15s}.m-feat-card:hover{background:#fff}
.m-fc-emoji{font-size:1.5rem;margin-bottom:12px}
.m-feat-card h3{font-family:'Syne',sans-serif;font-size:.88rem;font-weight:700;color:#1a1a1a;margin-bottom:5px}
.m-feat-card p{font-size:.78rem;color:#999;line-height:1.6}
.m-form-sec{padding:90px 8vw;background:#fff}
.m-form-sec h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,2.8vw,2.4rem);color:#1a1a1a;margin-bottom:8px}
.m-form-sec>.form-desc{color:#888;margin-bottom:32px;font-size:.88rem;line-height:1.7}
label.m-cf-lbl{display:block;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#aaa;margin-bottom:5px}
.m-cf-input,.m-cf-ta,.m-cf-sel{width:100%;background:#f8f5f0;border:1px solid #e0dbd2;border-radius:6px;color:#1a1a1a;font-family:'DM Sans',sans-serif;font-size:.88rem;padding:10px 14px;outline:none;transition:border-color .15s}
.m-cf-input:focus,.m-cf-ta:focus,.m-cf-sel:focus{border-color:var(--c1)}
.m-cf-ta{resize:vertical;min-height:100px;line-height:1.6}
.m-cf-submit{padding:11px 28px;background:#1a1a1a;color:#fff;border:none;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:600;cursor:pointer;transition:all .2s;margin-top:12px}.m-cf-submit:hover{background:var(--c1)}
.m-cf-success{padding:16px 20px;background:rgba(124,106,255,.06);border:1px solid rgba(124,106,255,.2);border-radius:7px;color:var(--c1);font-size:.86rem;margin-top:14px}
.m-contact{padding:100px 8vw;background:#1a1a1a;text-align:center}
.m-contact h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.2rem);color:#fff}
.m-contact>p{color:#666;margin-top:14px;max-width:420px;margin-left:auto;margin-right:auto;font-size:.86rem;line-height:1.75}
.m-contact-links{margin-top:34px;display:flex;flex-direction:column;align-items:center;gap:9px}
.m-c-link{color:var(--c1);text-decoration:none;font-size:.98rem;transition:opacity .2s}.m-c-link:hover{opacity:.65}
.m-social-bar{display:flex;gap:10px;margin-top:10px}
.m-s-btn{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:.78rem;text-decoration:none;transition:all .15s;color:#fff}.m-s-btn:hover{background:var(--c1);border-color:var(--c1)}
.m-footer{background:#111;padding:16px 8vw;display:flex;align-items:center;justify-content:space-between}
.m-footer span{font-size:.7rem;color:#333}
/* ── BOLD ── */
body.bold{background:#080005;color:#fff}
.b-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;height:58px;background:#080005;border-bottom:2px solid var(--c1)}
.b-nav-brand{font-family:'Syne',sans-serif;font-weight:900;font-size:1rem;letter-spacing:.1em;text-transform:uppercase;color:var(--c1)}
.b-nav-links{display:flex;gap:26px}.b-nav-links a{color:rgba(255,255,255,.45);font-size:.75rem;text-decoration:none;letter-spacing:.06em;text-transform:uppercase;font-weight:600;transition:color .15s}.b-nav-links a:hover{color:var(--c1)}
.b-nav-cta{padding:7px 18px;background:transparent;color:var(--c1);border:2px solid var(--c1);text-decoration:none;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;transition:all .18s}.b-nav-cta:hover{background:var(--c1);color:#080005}
.b-hero{min-height:100vh;display:flex;align-items:flex-end;position:relative;overflow:hidden;background:#080005;padding:100px 5vw 80px}
.b-hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.22;filter:grayscale(1) contrast(1.3)}
.b-hero-grad{position:absolute;inset:0;background:linear-gradient(to top,#080005 10%,transparent 60%)}
.b-hero-content{position:relative;z-index:2;max-width:920px}
.b-hero-line{width:52px;height:3px;background:var(--c1);margin-bottom:22px}
.b-hero h1{font-family:'Syne',sans-serif;font-size:clamp(3rem,9vw,8rem);font-weight:900;line-height:.95;letter-spacing:-.04em;color:#fff;text-transform:uppercase}
.b-hero h1 span{color:var(--c1);display:block}
.b-hero p{margin-top:26px;font-size:.95rem;color:rgba(255,255,255,.38);max-width:480px;line-height:1.75}
.b-hero-btns{margin-top:38px;display:flex;gap:14px}
.b-btn-p{padding:13px 34px;background:var(--c1);color:#fff;text-decoration:none;font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:all .2s}.b-btn-p:hover{background:var(--c2);transform:translateX(4px)}
.b-btn-g{padding:13px 34px;background:transparent;color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.2);text-decoration:none;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em;font-weight:600;transition:all .2s}.b-btn-g:hover{color:#fff;border-color:rgba(255,255,255,.5)}
.b-ab-s{padding:110px 5vw;background:#080005;display:grid;gap:80px;align-items:center}
.b-ab-s.img-left{grid-template-columns:1fr 1fr}.b-ab-s.img-right{grid-template-columns:1fr 1fr}
.b-ab-img{aspect-ratio:4/3;overflow:hidden;border:2px solid var(--c1);position:relative}
.b-eyebrow{font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--c1);margin-bottom:14px}
.b-ab-txt h2{font-family:'Syne',sans-serif;font-size:clamp(2rem,3.5vw,3rem);font-weight:800;color:#fff;line-height:1.1;text-transform:uppercase}
.b-ab-txt p{margin-top:18px;color:rgba(255,255,255,.42);line-height:1.82;font-size:.92rem}
.b-ab-c{padding:110px 5vw;background:#0d0009;text-align:center}
.b-ab-c h2{font-family:'Syne',sans-serif;font-size:clamp(2.2rem,4.5vw,3.8rem);font-weight:900;color:#fff;text-transform:uppercase;max-width:800px;margin:0 auto;line-height:1.05}
.b-ab-c>p{color:rgba(255,255,255,.35);margin:20px auto 0;max-width:580px;font-size:.92rem;line-height:1.82}
.b-ab-st{padding:110px 5vw;background:#080005;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.b-ab-st h2{font-family:'Syne',sans-serif;font-size:clamp(2rem,3.5vw,3rem);font-weight:900;color:#fff;text-transform:uppercase;line-height:1.1}
.b-ab-st>div>p{margin-top:16px;color:rgba(255,255,255,.38);line-height:1.82;font-size:.92rem}
.b-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:rgba(255,255,255,.08)}
.b-stat-card{background:#080005;padding:28px 24px}
.b-stat-num{font-family:'Syne',sans-serif;font-size:2.6rem;font-weight:900;color:var(--c1);line-height:1}
.b-stat-lbl{font-size:.68rem;color:rgba(255,255,255,.35);margin-top:6px;text-transform:uppercase;letter-spacing:.1em}
.b-feat{padding:100px 5vw;background:#0d0009}
.b-feat-hd{display:flex;align-items:center;gap:24px;margin-bottom:52px}
.b-feat-hd h2{font-family:'Syne',sans-serif;font-size:clamp(2rem,3.5vw,2.8rem);font-weight:900;color:#fff;text-transform:uppercase}
.b-feat-line{flex:1;height:2px;background:var(--c1)}
.b-feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2px;background:rgba(255,255,255,.06)}
.b-feat-card{background:#0d0009;padding:28px 24px;transition:background .15s}.b-feat-card:hover{background:#150010}
.b-fc-emoji{font-size:1.9rem;margin-bottom:14px;display:block}
.b-feat-card h3{font-family:'Syne',sans-serif;font-size:.92rem;font-weight:800;color:var(--c1);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em}
.b-feat-card p{font-size:.8rem;color:rgba(255,255,255,.3);line-height:1.65}
.b-form-sec{padding:100px 5vw;background:#080005}
.b-form-sec h2{font-family:'Syne',sans-serif;font-size:clamp(2rem,3.5vw,2.8rem);font-weight:900;color:#fff;text-transform:uppercase;margin-bottom:8px}
.b-form-sec>.form-desc{color:rgba(255,255,255,.35);margin-bottom:36px;font-size:.9rem;line-height:1.7}
label.b-cf-lbl{display:block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3);margin-bottom:5px}
.b-cf-input,.b-cf-ta,.b-cf-sel{width:100%;background:#0d0009;border:1px solid rgba(255,255,255,.1);border-bottom:2px solid rgba(255,255,255,.2);color:#fff;font-family:'DM Sans',sans-serif;font-size:.9rem;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:0}
.b-cf-input:focus,.b-cf-ta:focus,.b-cf-sel:focus{border-bottom-color:var(--c1)}
.b-cf-ta{resize:vertical;min-height:100px;line-height:1.6}
.b-cf-submit{padding:13px 36px;background:var(--c1);color:#fff;border:none;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:.1em;transition:all .2s;margin-top:12px}.b-cf-submit:hover{background:var(--c2);transform:translateX(3px)}
.b-cf-success{padding:16px 20px;background:rgba(124,106,255,.08);border-left:3px solid var(--c1);color:rgba(255,255,255,.75);font-size:.88rem;margin-top:16px}
.b-contact{padding:120px 5vw;background:#080005;text-align:center;position:relative;overflow:hidden}
.b-contact h2{font-family:'Syne',sans-serif;font-size:clamp(3rem,7vw,6rem);font-weight:900;color:#fff;text-transform:uppercase;line-height:.95;letter-spacing:-.03em}
.b-contact h2 span{color:var(--c1)}
.b-contact>p{color:rgba(255,255,255,.3);margin-top:20px;max-width:420px;margin-left:auto;margin-right:auto;font-size:.88rem;line-height:1.75}
.b-contact-links{margin-top:44px;display:flex;flex-direction:column;align-items:center;gap:10px}
.b-c-link{color:var(--c1);text-decoration:none;font-size:1.05rem;letter-spacing:.04em;transition:opacity .2s}.b-c-link:hover{opacity:.65}
.b-social-bar{display:flex;gap:10px;margin-top:14px}
.b-s-btn{width:40px;height:40px;background:transparent;border:2px solid var(--c1);display:flex;align-items:center;justify-content:center;font-size:.8rem;text-decoration:none;transition:all .15s;color:var(--c1)}.b-s-btn:hover{background:var(--c1);color:#080005}
.b-footer{background:#050003;border-top:2px solid var(--c1);padding:16px 5vw;display:flex;align-items:center;justify-content:space-between}
.b-footer span{font-size:.7rem;color:rgba(255,255,255,.18);text-transform:uppercase;letter-spacing:.08em}
${customCss}`;
}

// ── BODY HTML (sections only) ────────────────────────────────────────────────
export function renderBody(SD: SiteData): string {
  const L = SD.layout || 'agency';
  return SD.sections.map(s => renderSection(s, L, SD)).join('\n');
}

// ── FULL STANDALONE DOCUMENT (kept for reference) ────────────────────────────
export function renderSite(SD: SiteData): string {
  const L = SD.layout || 'agency';
  const body = renderBody(SD);
  const fonts = `<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap" rel="stylesheet"/>`;
  const css = renderStyles(SD);
  const scrollReveal = `<script>
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}});},{threshold:.1});
    document.querySelectorAll('[data-r]').forEach(function(el){obs.observe(el);});
  </script>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>${fonts}<style>${css}</style></head><body class="${L}"><div id="root">${body}</div>${scrollReveal}</body></html>`;
}
