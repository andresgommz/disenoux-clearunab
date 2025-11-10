/* Dropdown EVENTOS: abre/cierra y se cierra al hacer click fuera o con ESC */
const dd = document.querySelector('.dropdown');
const tg = dd?.querySelector('.dropdown-toggle');
tg?.addEventListener('click', e => { e.preventDefault(); dd.classList.toggle('open'); });
document.addEventListener('click', e => { if(dd && !dd.contains(e.target)) dd.classList.remove('open'); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') dd.classList.remove('open'); });

(function(){
  const account = document.querySelector('.account');
  if(account){
    account.addEventListener('click', (e)=>{ e.preventDefault(); let u=null; try{ u=JSON.parse(localStorage.getItem('user.name')) }catch{}; location.href = u? 'userpage.html' : 'login.html'; });
  }

  function storageGet(k){ try{ return JSON.parse(localStorage.getItem(k)) || []; }catch(e){ return [] } }
  function storageSet(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

  const userEvKey='user.events', calKey='cal.items';
  document.querySelectorAll('.card').forEach(card=>{
    const btn = card.querySelector('.btn-outline');
    if(!btn) return;
    function readEvent(){
      const t = (card.querySelector('h3')?.textContent||'Evento').trim();
      const meta = (card.querySelector('.meta')?.textContent||'').trim();
      const m = meta.match(/(\d{2}\/\d{2}\/\d{4})/);
      let fecha='';
      if(m){ const [d,mm,y] = m[1].split('/'); fecha = `${y}-${mm}-${d}`; }
      const horaM = meta.match(/(\d{1,2}:\d{2})/);
      return { titulo:t, fecha: fecha || new Date().toISOString().slice(0,10), hora: horaM?horaM[1]:'08:00', descripcion:meta, img:'' };
    }
    const ev = readEvent();
    if(storageGet(userEvKey).some(x=>x.titulo===ev.titulo && x.fecha===ev.fecha)){ btn.textContent='Registrado'; btn.disabled=true; }
    btn.addEventListener('click', e=>{
      e.preventDefault();
      const user = (()=>{ try{return JSON.parse(localStorage.getItem('user.name')) }catch{return null} })();
      if(!user){ location.href='login.html'; return; }
      const ev2 = readEvent(); ev2.id = crypto.randomUUID?crypto.randomUUID():('ev_'+Date.now());
      const arr = storageGet(userEvKey);
      if(!arr.some(x=>x.titulo===ev2.titulo && x.fecha===ev2.fecha)){ arr.push(ev2); storageSet(userEvKey, arr); }
      const cal = storageGet(calKey);
      if(!cal.some(c=>c.titulo===ev2.titulo && c.fecha===ev2.fecha && c.hora===ev2.hora)){ cal.push({ id:ev2.id, titulo:ev2.titulo, fecha:ev2.fecha, hora:ev2.hora||'08:00', nota:ev2.descripcion||''}); storageSet(calKey, cal); }
      btn.textContent='Registrado'; btn.disabled=true; alert('Registrado en tu panel');
    });
  });
})();

(function(){
  const key = 'comments:' + location.pathname;
  const q = sel => document.querySelector(sel);
  const listEl = q('#comments-list');
  const form = q('#comment-form');

  function storageGet(k){ try{ return JSON.parse(localStorage.getItem(k)) || [] }catch(e){ return [] } }
  function storageSet(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)) }catch(e){} }
  function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;"); }

  function render(){
    const items = storageGet(key);
    if(!listEl) return;
    listEl.innerHTML = '';
    if(items.length===0){ listEl.innerHTML = '<div class="muted">Sé el primero en comentar.</div>'; return }
    items.slice().reverse().forEach(c=>{
      const row = document.createElement('div');
      row.style.padding = '10px 0';
      row.innerHTML = `<div style="font-weight:700">${escapeHtml(c.name||'Anónimo')}</div><div style="margin-top:6px;color:#21394d">${escapeHtml(c.text)}</div><div style="font-size:12px;color:#7b8a93;margin-top:6px">${new Date(c.ts).toLocaleString()}</div>`;
      listEl.appendChild(row);
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim() || 'Anónimo';
    const text = (fd.get('text')||'').toString().trim();
    if(!text) return;
    const items = storageGet(key);
    items.push({ name, text, ts: Date.now() });
    storageSet(key, items);
    form.reset();
    render();
    if(listEl) listEl.scrollTop = 0;
  });

  render();
})();

(function(){ try{ if(localStorage.getItem('site.theme') === 'dark') document.documentElement.classList.add('dark-mode'); }catch(e){} })();