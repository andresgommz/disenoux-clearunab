/* ===== util: 100vh real y alto chrome ===== */
function setVhUnit(){ const vh = window.innerHeight * 0.01; document.documentElement.style.setProperty('--vh', `${vh}px`); }
function setChromeHeight(){
  const topbar = document.getElementById('topbar');
  const header = document.getElementById('header');
  const h = (topbar?.offsetHeight||0) + (header?.offsetHeight||0);
  document.documentElement.style.setProperty('--chrome', h + 'px');
}
addEventListener('load', ()=>{ setVhUnit(); setChromeHeight(); });
addEventListener('resize', ()=>{ setVhUnit(); setChromeHeight(); });

/* ===== DATA de egresados ===== */
const peopleData = [
  {
    nombre: "Laura Acuña",
    descripcion: "Graduada de derecho, presentadora de televisión, cantante y modelo colombiana.",
    foto: "../static/img/laura-acuna.png"
  },
  {
    nombre: "Maritza Rondón Rangel",
    descripcion: "Administradora de Empresas de la Universidad Autónoma de Bucaramanga UNAB. Rectora de la UCC.",
    foto: "../static/img/maritza-rondon.png"
  },
  {
    nombre: "Miguel Cadena Sanabria",
    descripcion: "Médico Especialista en Medicina Interna: Geriatría.",
    foto: "../static/img/miguel-cadena.png"
  },
  {
    nombre: "Silvia Corzo",
    descripcion: "Graduada de derecho. Periodista y abogada.",
    foto: "../static/img/silvia-corzo.png"
  }
];

/* paletas exactamente como index (se ciclan) */
const palettes = [
  {a: getVar('--hero1-a') || '#e9f7f3', b: getVar('--hero1-b') || '#dff0ea'},
  {a: getVar('--hero2-a') || '#f1f6ff', b: getVar('--hero2-b') || '#eef0ff'},
  {a: getVar('--hero3-a') || '#f4fbf7', b: getVar('--hero3-b') || '#eaf7f1'}
];
function getVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

/* ===== SLIDES ===== */
const slidesHost = document.getElementById('slides');
const dotsHost   = document.getElementById('dots');
let active = 0, timer=null;

function makeSlide(p, i){
  const pal = palettes[i % palettes.length];
  const el = document.createElement('article');
  el.className = 'slide';
  el.style.background = `linear-gradient(90deg, ${pal.a}, ${pal.b})`; // igual que index
  el.innerHTML = `
    <div class="left">
      <h1>${p.nombre}</h1>
      <p>${p.descripcion}</p>
    </div>
    <div class="right">
      <div class="photo" style="background-image:url('${p.foto}');"></div>
    </div>`;
  return el;
}
function drawSlides(){
  slidesHost.innerHTML = '';
  peopleData.forEach((p,i)=>{
    const s = makeSlide(p,i);
    if(i===active) s.classList.add('active');
    slidesHost.appendChild(s);
  });
}
function drawDots(){
  dotsHost.innerHTML = '';
  peopleData.forEach((_,i)=>{
    const d = document.createElement('button');
    d.className = 'dot' + (i===active?' active':'');
    d.addEventListener('click', ()=>go(i));
    dotsHost.appendChild(d);
  });
}
function go(i){
  active = (i + peopleData.length) % peopleData.length;
  [...slidesHost.children].forEach((n,idx)=> idx===active ? n.classList.add('active') : n.classList.remove('active'));
  drawDots(); restartAuto();
}
function next(){ go(active+1); }
function restartAuto(){ clearInterval(timer); timer=setInterval(next, 8000); } // 8 s

drawSlides(); drawDots(); restartAuto();

/* ===== Dropdown EVENTOS ===== */
const dd = document.querySelector('.dropdown');
const tg = dd?.querySelector('.dropdown-toggle');
tg?.addEventListener('click', e => { e.preventDefault(); dd.classList.toggle('open'); });
document.addEventListener('click', e => { if(dd && !dd.contains(e.target)) dd.classList.remove('open'); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') dd.classList.remove('open'); });

// Ajuste: comportamiento de "Cuenta"
(function(){
  const account = document.querySelector('.account');
  if(account){
    account.addEventListener('click', function(e){
      e.preventDefault();
      let u = null;
      try{ u = JSON.parse(localStorage.getItem('user.name')); }catch{}
      location.href = u ? 'userpage.html' : 'login.html';
    });
  }
})();

(function(){ try{ if(localStorage.getItem('site.theme') === 'dark') document.documentElement.classList.add('dark-mode'); }catch(e){} })();