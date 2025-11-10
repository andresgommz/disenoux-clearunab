/* ==== util 100vh real y altura chrome ==== */
function setVhUnit(){ const vh = window.innerHeight * 0.01; document.documentElement.style.setProperty('--vh', `${vh}px`);}
function setChromeHeight(){
  const topbar = document.getElementById('topbar');
  const header = document.getElementById('header');
  const h = (topbar?.offsetHeight||0) + (header?.offsetHeight||0);
  document.documentElement.style.setProperty('--chrome', h + 'px');
}
window.addEventListener('load', ()=>{ setVhUnit(); setChromeHeight(); });
window.addEventListener('resize', ()=>{ setVhUnit(); setChromeHeight(); });

/* ==== DATA SLIDES ==== */
const slidesData = [
  {
    titulo: "UNABFEST",
    texto: "Festival universitario con arte, cultura y tecnología. Disfruta shows, talleres y experiencias interactivas.",
    cta: { label: "CONOCE MÁS →", href: "unabfest.html" },
    badge: "14 al 16 de mayo",
    img: "../static/img/unabfest.png",
    colors: { a: getVar('--hero1-a') || "#e9f7f3", b: getVar('--hero1-b') || "#dff0ea" }
  },
  {
    titulo: "ULIBRO",
    texto: "La feria del libro de la UNAB: autores invitados, charlas, lanzamientos editoriales y espacios para lectoras y lectores.",
    cta: { label: "CONOCE MÁS →", href: "ulibro.html" },
    badge: "Próxima edición",
    img: "../static/img/ulibro.png",
    colors: { a: getVar('--hero2-a') || "#f1f6ff", b: getVar('--hero2-b') || "#eef0ff" }
  },
  {
    titulo: "SEMANA DE INGENIERÍA",
    texto: "Humanos vs Máquinas: conferencias, retos y expo de proyectos sobre IA, automatización y el futuro del trabajo.",
    cta: { label: "CONOCE MÁS →", href: "semanaingenieria.html" },
    badge: "Edición 2025",
    img: "../static/img/semanaingenieria.jpg",
    colors: { a: getVar('--hero3-a') || "#f4fbf7", b: getVar('--hero3-b') || "#eaf7f1" }
  },
  {
    titulo: "INGENIOTIC",
    texto: "Feria de innovación, TIC y proyectos: demos, charlas técnicas y networking.",
    cta: { label: "CONOCE MÁS →", href: "ingeniotic.html" },
    badge: "Nueva edición",
    img: "../static/img/ingeniotic.jpeg",
    colors: { a: getVar('--hero4-a') || "#f6fff2", b: getVar('--hero4-b') || "#ecffe2" }
  }
];

function getVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

const slidesHost = document.getElementById("slides");
const dotsHost   = document.getElementById("dots");
let active = 0, timer=null;

function makeSlide(s){
  const el = document.createElement("article");
  el.className="slide";
  el.style.background = `linear-gradient(90deg, ${s.colors.a}, ${s.colors.b})`;
  // aplicar imagen de poster si existe
  const posterStyle = s.img ? `background-image:url('${s.img}');background-size:cover;background-position:center;` : '';
  el.innerHTML = `
    <div class="left">
      <h1>${s.titulo}</h1>
      <p>${s.texto}</p>
      <div><a class="cta" href="${s.cta.href}">${s.cta.label}</a></div>
    </div>
    <div class="right">
      <div class="poster" style="${posterStyle}"><div class="badge">${s.badge}</div></div>
    </div>`;
  return el;
}

function drawSlides(){
  slidesHost.innerHTML="";
  slidesData.forEach((s,i)=>{
    const el = makeSlide(s);
    if(i===active) el.classList.add("active");
    slidesHost.appendChild(el);
  });
}

function drawDots(){
  dotsHost.innerHTML="";
  slidesData.forEach((_,i)=>{
    const d=document.createElement("button");
    d.className="dot"+(i===active?" active":"");
    d.addEventListener("click", ()=>go(i));
    dotsHost.appendChild(d);
  });
}

function go(i){
  active = (i + slidesData.length) % slidesData.length;
  [...slidesHost.children].forEach((n,idx)=> idx===active ? n.classList.add("active") : n.classList.remove("active"));
  drawDots(); restartAuto();
}
function next(){ go(active+1); }
function restartAuto(){ clearInterval(timer); timer=setInterval(next, 10000); }

drawSlides(); drawDots(); restartAuto();

/* Dropdown EVENTOS */
const dd = document.querySelector('.dropdown');
const toggle = dd?.querySelector('.dropdown-toggle');
toggle?.addEventListener('click', (e)=>{ e.preventDefault(); dd.classList.toggle('open'); });
document.addEventListener('click', (e)=>{ if(!dd.contains(e.target)) dd.classList.remove('open'); });

/* Ajuste: comportamiento de "Cuenta" */
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

/* Atajos naranja (opcional) */
function renderAtajosEventos(targetId='eventos-atajos'){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = `
    <div class="atajos-wrap">
      <div class="atajos">
        <div class="grupo">
          <div class="btn">Ulibro 2025
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="drop">
            <a href="ulibro.html#vidas-narradas">Vidas Narradas</a>
            <a href="ulibro.html#invitados">Invitados</a>
          </div>
        </div>

        <div class="grupo">
          <div class="btn">Medios
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="drop">
            <a href="medios.html#prensa">Prensa</a>
            <a href="medios.html#galeria">Galería</a>
          </div>
        </div>

        <a class="btn" href="unabfest.html">UNAB Fest</a>
        <a class="btn" href="semanaingenieria.html">Semana de Ingeniería</a>
        <a class="btn" href="ingeniotic.html">Ingeniotic</a>

        <div class="search" title="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5ZM4 9.5C4 6.46 6.46 4 9.5 4S15 6.46 15 9.5 12.54 15 9.5 15 4 12.54 4 9.5Z"/></svg>
        </div>
      </div>
    </div>
  `;
  el.querySelectorAll('.atajos .grupo').forEach(g=>{
    const btn = g.querySelector('.btn');
    btn.addEventListener('click', ()=> g.classList.toggle('open'));
    document.addEventListener('click', (e)=>{ if(!g.contains(e.target)) g.classList.remove('open'); });
  });
}
renderAtajosEventos();

(function(){
  try{
    // aplicar tema guardado
    const current = localStorage.getItem('site.theme') || 'light';
    if(current === 'dark') document.documentElement.classList.add('dark-mode');
    // controlar boton
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    const setLabel = (t) => { btn.textContent = (t === 'dark') ? '☀️' : '🌓'; };
    setLabel(current);
    btn.addEventListener('click', function(){
      try{
        const now = document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark';
        if(now === 'dark') document.documentElement.classList.add('dark-mode');
        else document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('site.theme', now);
        setLabel(now);
      }catch(e){}
    });
  }catch(e){}
})();

/* Mobile nav toggle: encuentra .nav-toggle y maneja clase .nav-open en <html> */
(function(){
  function closeNav(){ document.documentElement.classList.remove('nav-open'); }
  function toggleNav(){ document.documentElement.classList.toggle('nav-open'); }

  document.addEventListener('click', function(e){
    const t = e.target;
    // toggle button
    if(t.closest && t.closest('.nav-toggle')){ toggleNav(); return; }
    // click on nav link -> close
    if(t.closest && t.closest('.nav-links')){ if(t.tagName === 'A') closeNav(); return; }
    // click outside nav -> close
    if(!t.closest || (!t.closest('.nav-links') && !t.closest('.nav-toggle'))){ closeNav(); }
  });

  // close on ESC
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeNav(); });
})();