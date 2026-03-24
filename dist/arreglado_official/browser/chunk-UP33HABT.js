function t(r){return String(r??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function w(r){return String(r??"").replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r")}function y(r,i){let e=t(r||i).split(" ");if(e.length>1){let o=Math.floor(e.length/2);e[o]=`<em>${e[o]}</em>`}return e.join(" ")}function $(r){return r.sections.find(a=>a.type==="hero")?.data.navBrand||"Arreglado"}function k(r){let i=r.sections.map(e=>e.type),a=[];return(i.includes("about-simple")||i.includes("about-centered")||i.includes("about-stats"))&&a.push(["#about","About"]),i.includes("features")&&a.push(["#features","Services"]),i.includes("form")&&a.push(["#form","Register"]),i.includes("contact")&&a.push(["#contact","Contact"]),a.map(([e,o])=>`<a href="${e}">${o}</a>`).join("")}function v(r,i){let a=[];return r.twitter&&a.push([r.twitter,"\u{1D54F}"]),r.instagram&&a.push([r.instagram,"\u25C8"]),r.linkedin&&a.push([r.linkedin,"in"]),a.map(([e,o])=>`<a href="${t(e)}" class="${i}" target="_blank" rel="noopener">${o}</a>`).join("")}function x(r,i,a,e,o){let n=r.required?'<span style="color:var(--c1)">*</span>':"",s=`<label class="${o}">${t(r.label)}${n}</label>`;if(r.type==="textarea")return`<div class="ff-wrap" data-label="${t(r.label)}">${s}<textarea class="${a}" placeholder="${t(r.placeholder||"")}" ${r.required?"required":""}></textarea></div>`;if(r.type==="select"){let p=(r.options||[]).map(f=>`<option>${t(f)}</option>`).join("");return`<div class="ff-wrap" data-label="${t(r.label)}">${s}<select class="${e}" ${r.required?"required":""}><option value="">\u2014 Select \u2014</option>${p}</select></div>`}let c={email:"email",phone:"tel",number:"number",url:"url"}[r.type]||"text";return`<div class="ff-wrap" data-label="${t(r.label)}">${s}<input type="${c}" class="${i}" placeholder="${t(r.placeholder||"")}" ${r.required?"required":""}></div>`}function z(r,i,a){let e=r.data,o=i==="agency"?"a":i==="minimal"?"m":"b",n=`${o}-cf-input`,s=`${o}-cf-ta`,d=`${o}-cf-sel`,c=`${o}-cf-lbl`,p=`${o}-cf-submit`,f=`${o}-cf-success`,b=w(a||"Event"),g=t(r.id),h="",l=0,m=e.fields||[];for(;l<m.length;){let u=m[l];u.width==="half"&&l+1<m.length&&m[l+1].width==="half"?(h+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">${x(u,n,s,d,c)}${x(m[l+1],n,s,d,c)}</div>`,l+=2):(h+=x(u,n,s,d,c),l++)}return`<div id="${g}">
    <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:18px">${h}</div>
    <button type="button" class="${p}" onclick="(function(btn){
      var wrap=document.getElementById('${g}');
      var required=wrap.querySelectorAll('[required]');
      var valid=true;
      required.forEach(function(el){
        if(!el.value.trim()){el.style.borderColor='#ff4d6a';valid=false;}
        else{el.style.borderColor='';}
      });
      if(!valid)return;
      var wrapEls=wrap.querySelectorAll('.ff-wrap');
      var submFields=[];
      var subName='';
      wrapEls.forEach(function(w){
        var lbl=w.getAttribute('data-label')||'';
        var inp=w.querySelector('input,textarea,select');
        var val=inp?inp.value.trim():'';
        if(lbl&&val){submFields.push({label:lbl,value:val});}
        if(!subName&&lbl.toLowerCase().indexOf('name')>=0&&val){subName=val;}
      });
      try{
        var sub={
          id:'sub-'+Date.now(),
          type:'attendance',
          name:subName||'Resident',
          submittedAt:new Date().toISOString(),
          status:'pending',
          eventName:'${b}',
          fields:submFields
        };
        var existing=JSON.parse(localStorage.getItem('ar_submissions')||'[]');
        existing.unshift(sub);
        localStorage.setItem('ar_submissions',JSON.stringify(existing));
      }catch(e){}
      btn.style.display='none';
      document.getElementById('${g}-success').style.display='block';
    })(this)">${t(e.submitLabel||"Send")}</button>
    <div class="${f}" id="${g}-success" style="display:none">${t(e.successMsg||"Thanks!")}</div>
  </div>`}function S(r,i,a){let e=r.data,o=e.heroImg?`style="background-image:url('${e.heroImg}')"`:"",n=k(a),s=t(e.navBrand||"MyBrand");return i==="agency"?`
    <section class="a-hero" id="hero">
      ${e.heroImg?`<div class="a-hero-bg" ${o}></div>`:""}
      <div class="a-hero-grad"></div>
      <div class="a-hero-content">
        <div class="a-hero-badge">\u2726 ${t(e.eyebrow||"Welcome")}</div>
        <h1>${y(e.headline,"We build things that matter")}</h1>
        <p>${t(e.sub||"A short description of your event.")}</p>
        <div class="a-hero-btns">
          ${e.cta?`<a href="${t(e.ctaLink||"#contact")}" class="a-btn-p">${t(e.cta)}</a>`:""}
          <a href="#about" class="a-btn-g">Learn more</a>
        </div>
      </div>
    </section>`:i==="minimal"?`
    <section class="m-hero" id="hero">
      ${e.heroImg?`<img src="${e.heroImg}" class="m-hero-img" alt=""/>`:'<div class="m-hero-img-ph">\u{1F5BC}</div>'}
      <div class="m-hero-fade"></div>
      <div class="m-hero-content">
        <div class="m-eyebrow">${t(e.eyebrow||"Upcoming Event")}</div>
        <h1>${y(e.headline,"Your Event <em>Headline</em>")}</h1>
        <p>${t(e.sub||"")}</p>
        <div class="m-hero-btns">
          ${e.cta?`<a href="${t(e.ctaLink||"#contact")}" class="m-btn-p">${t(e.cta)}</a>`:""}
          <a href="#about" class="m-btn-g">Learn more</a>
        </div>
      </div>
    </section>`:`
    <section class="b-hero" id="hero">
      ${e.heroImg?`<div class="b-hero-bg" ${o}></div>`:""}
      <div class="b-hero-grad"></div>
      <div class="b-hero-content">
        <div class="b-hero-line"></div>
        <h1><span>${t(e.eyebrow||"EVENT")}</span>${t(e.headline||"Your Bold Headline")}</h1>
        <p>${t(e.sub||"")}</p>
        <div class="b-hero-btns">
          ${e.cta?`<a href="${t(e.ctaLink||"#contact")}" class="b-btn-p">${t(e.cta)}</a>`:""}
          <a href="#about" class="b-btn-g">Learn more</a>
        </div>
      </div>
    </section>`}function j(r,i){let a=r.data,e=a.imgPos==="right"?"img-right":"img-left",o=a.img?`<img src="${a.img}" alt="" style="width:100%;height:100%;object-fit:cover"/>`:'<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem">\u{1F5BC}</div>';return i==="agency"?`<section class="a-ab-s ${e}" id="about" data-r>
    <div class="a-ab-img">${o}</div>
    <div class="a-ab-txt">
      <div class="eyebrow">${t(a.eyebrow||"About")}</div>
      <h2>${t(a.title||"About This Event")}</h2>
      <p>${t(a.body||"")}</p>
      ${a.tagline?`<div class="a-ab-txt tagline">${t(a.tagline)}</div>`:""}
    </div>
  </section>`:i==="minimal"?`<section class="m-ab-s ${e}" id="about" data-r>
    <div class="m-ab-img">${o}</div>
    <div class="m-ab-txt">
      <div class="m-eyebrow2">${t(a.eyebrow||"About")}</div>
      <h2>${t(a.title||"About This Event")}</h2>
      <p>${t(a.body||"")}</p>
      ${a.tagline?`<div class="m-ab-txt tagline">${t(a.tagline)}</div>`:""}
    </div>
  </section>`:`<section class="b-ab-s ${e}" id="about" data-r>
    <div class="b-ab-img">${o}</div>
    <div class="b-ab-txt">
      <div class="b-eyebrow">${t(a.eyebrow||"About")}</div>
      <h2>${t(a.title||"About This Event")}</h2>
      <p>${t(a.body||"")}</p>
    </div>
  </section>`}function C(r,i){let a=r.data,e=a.bannerImg?`<div style="margin-top:44px;border-radius:6px;overflow:hidden;height:280px"><img src="${a.bannerImg}" style="width:100%;height:100%;object-fit:cover" alt=""/></div>`:"",o=a.showQuote&&a.quote?`<div class="${i==="agency"?"a-ab-c-quote":i==="minimal"?"m-ab-c-quote":"b-ab-c-quote"}">"${t(a.quote)}"</div>`:"";return i==="agency"?`<section class="a-ab-c" id="about" data-r>
    <div class="eyebrow">${t(a.eyebrow||"Overview")}</div>
    <h2>${t(a.title||"Event Overview")}</h2>
    <p>${t(a.body||"")}</p>
    ${o}${e}
  </section>`:i==="minimal"?`<section class="m-ab-c" id="about" data-r>
    <div class="m-eyebrow2">${t(a.eyebrow||"Overview")}</div>
    <h2>${t(a.title||"Event Overview")}</h2>
    <p>${t(a.body||"")}</p>
    ${o}${e}
  </section>`:`<section class="b-ab-c" id="about" data-r>
    <div class="b-eyebrow">${t(a.eyebrow||"Overview")}</div>
    <h2>${t(a.title||"Event Overview")}</h2>
    <p>${t(a.body||"")}</p>
    ${o}${e}
  </section>`}function E(r,i){let a=r.data,o=(a.stats||[]).map(c=>{let p=i==="agency"?"stat-card":i==="minimal"?"m-stat-card":"b-stat-card",f=i==="agency"?"stat-num":i==="minimal"?"m-stat-num":"b-stat-num",b=i==="agency"?"stat-lbl":i==="minimal"?"m-stat-lbl":"b-stat-lbl";return`<div class="${p}"><div class="${f}">${t(c.num)}</div><div class="${b}">${t(c.label)}</div></div>`}).join(""),n=i==="agency"?"stats-grid":i==="minimal"?"m-stats-grid":"b-stats-grid";return`<section class="${i==="agency"?"a-ab-st":i==="minimal"?"m-ab-st":"b-ab-st"}" id="about" data-r>
    <div>
      <div class="${i==="agency"?"eyebrow":i==="minimal"?"m-eyebrow2":"b-eyebrow"}">${t(a.eyebrow||"Key Details")}</div>
      <h2>${t(a.title||"About Us")}</h2>
      <p>${t(a.body||"")}</p>
    </div>
    <div class="${n}">${o}</div>
  </section>`}function D(r,i){let a=r.data,e=a.items||[];return i==="agency"?`<section class="a-feat" id="features" data-r>
    <h2>${t(a.title||"Event Highlights")}</h2>
    <div class="feat-grid">${e.map(o=>`<div class="a-feat-card"><span class="fc-emoji">${t(o.emoji)}</span><h3>${t(o.title)}</h3><p>${t(o.desc)}</p></div>`).join("")}</div>
  </section>`:i==="minimal"?`<section class="m-feat" id="features" data-r>
    <div class="m-feat-hd"><div class="m-eyebrow2">Highlights</div><h2>${t(a.title||"Event Highlights")}</h2></div>
    <div class="m-feat-grid">${e.map(o=>`<div class="m-feat-card"><div class="m-fc-emoji">${t(o.emoji)}</div><h3>${t(o.title)}</h3><p>${t(o.desc)}</p></div>`).join("")}</div>
  </section>`:`<section class="b-feat" id="features" data-r>
    <div class="b-feat-hd"><h2>${t(a.title||"Event Highlights")}</h2><div class="b-feat-line"></div></div>
    <div class="b-feat-grid">${e.map(o=>`<div class="b-feat-card"><span class="b-fc-emoji">${t(o.emoji)}</span><h3>${t(o.title)}</h3><p>${t(o.desc)}</p></div>`).join("")}</div>
  </section>`}function q(r,i,a){let e=r.data,o=a.sections.find(c=>c.type==="hero"),n=o?.data.headline?.trim()||o?.data.navBrand?.trim()||e.title||"Event";return`<section class="${i==="agency"?"a-form-sec":i==="minimal"?"m-form-sec":"b-form-sec"}" id="form" data-r>
    <div class="${i==="agency"?"eyebrow":i==="minimal"?"m-eyebrow2":"b-eyebrow"}">${t(e.eyebrow||"Register")}</div>
    <h2>${t(e.title||"Register Now")}</h2>
    ${e.desc?`<p class="form-desc">${t(e.desc)}</p>`:""}
    ${z(r,i,n)}
  </section>`}function A(r,i,a){let e=r.data,o=t(e.footerCopy||`\xA9 ${new Date().getFullYear()} ${$(a)}. All rights reserved.`);if(i==="agency")return`
    <section class="a-contact" id="contact" data-r>
      <h2>${t(e.title||"Let's Talk")}</h2>
      <p>${t(e.body||"")}</p>
      <div class="contact-links">
        ${e.email?`<a href="mailto:${t(e.email)}" class="c-link">\u2709 ${t(e.email)}</a>`:""}
        ${e.phone?`<a href="tel:${t(e.phone)}" class="c-link">\u260E ${t(e.phone)}</a>`:""}
        <div class="social-bar">${v(e,"s-btn")}</div>
      </div>
    </section>
    <footer class="a-footer"><span>${o}</span><span>Built with Arreglado</span></footer>`;if(i==="minimal")return`
    <section class="m-contact" id="contact" data-r>
      <h2>${t(e.title||"Let's Talk")}</h2>
      <p>${t(e.body||"")}</p>
      <div class="m-contact-links">
        ${e.email?`<a href="mailto:${t(e.email)}" class="m-c-link">\u2709 ${t(e.email)}</a>`:""}
        ${e.phone?`<a href="tel:${t(e.phone)}" class="m-c-link">\u260E ${t(e.phone)}</a>`:""}
        <div class="m-social-bar">${v(e,"m-s-btn")}</div>
      </div>
    </section>
    <footer class="m-footer"><span>${o}</span><span style="color:#222">Arreglado</span></footer>`;let n=t(e.title||"Let's Talk").split(" ");return n.length>1&&(n[0]=`<span>${n[0]}</span>`),`
    <section class="b-contact" id="contact" data-r>
      <h2>${n.join(" ")}</h2>
      <p>${t(e.body||"")}</p>
      <div class="b-contact-links">
        ${e.email?`<a href="mailto:${t(e.email)}" class="b-c-link">\u2709 ${t(e.email)}</a>`:""}
        ${e.phone?`<a href="tel:${t(e.phone)}" class="b-c-link">\u260E ${t(e.phone)}</a>`:""}
        <div class="b-social-bar">${v(e,"b-s-btn")}</div>
      </div>
    </section>
    <footer class="b-footer"><span>${o}</span><span>ARREGLADO</span></footer>`}function I(r,i,a){switch(r.type){case"hero":return S(r,i,a);case"about-simple":return j(r,i);case"about-centered":return C(r,i);case"about-stats":return E(r,i);case"features":return D(r,i);case"form":return q(r,i,a);case"contact":return A(r,i,a);default:return""}}function O(r){let i=r.theme?.primary||"#7c6aff",a=r.theme?.secondary||"#ff6a8a",e=r.theme?.customCss||"";return`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{--c1:${i};--c2:${a}}
[data-r]{opacity:0;transform:translateY(22px);transition:opacity .55s,transform .55s}
[data-r].vis{opacity:1;transform:none}
@keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
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
.a-cf-submit{padding:13px 32px;background:var(--c1);color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .2s;margin-top:4px}
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
body.minimal{background:#f8f5f0;color:#1a1a1a}
.m-hero{min-height:100vh;display:flex;align-items:center;padding:80px 8vw 80px;background:#f8f5f0;position:relative;overflow:hidden}
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
label.m-cf-lbl{display:block;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#aaa;margin-bottom:6px}
.m-cf-input,.m-cf-ta,.m-cf-sel{width:100%;background:#f8f5f0;border:1px solid #e0dbd2;border-radius:6px;color:#1a1a1a;font-family:'DM Sans',sans-serif;font-size:.88rem;padding:10px 14px;outline:none;transition:border-color .15s}
.m-cf-input:focus,.m-cf-ta:focus,.m-cf-sel:focus{border-color:var(--c1)}
.m-cf-ta{resize:vertical;min-height:100px;line-height:1.6}
.m-cf-submit{padding:11px 28px;background:#1a1a1a;color:#fff;border:none;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:600;cursor:pointer;transition:all .2s;margin-top:4px}.m-cf-submit:hover{background:var(--c1)}
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
label.b-cf-lbl{display:block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3);margin-bottom:6px}
.b-cf-input,.b-cf-ta,.b-cf-sel{width:100%;background:#0d0009;border:1px solid rgba(255,255,255,.1);border-bottom:2px solid rgba(255,255,255,.2);color:#fff;font-family:'DM Sans',sans-serif;font-size:.9rem;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:0}
.b-cf-input:focus,.b-cf-ta:focus,.b-cf-sel:focus{border-bottom-color:var(--c1)}
.b-cf-ta{resize:vertical;min-height:100px;line-height:1.6}
.b-cf-submit{padding:13px 36px;background:var(--c1);color:#fff;border:none;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:.1em;transition:all .2s;margin-top:4px}.b-cf-submit:hover{background:var(--c2);transform:translateX(3px)}
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
${e}`}function T(r){let i=r.layout||"agency";return r.sections.map(a=>I(a,i,r)).join(`
`)}export{O as a,T as b};
