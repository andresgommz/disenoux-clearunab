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
    // keep the form visible by keeping list scroll at top
    if(listEl) listEl.scrollTop = 0;
  });

  render();
})();

(function(){ try{ if(localStorage.getItem('site.theme') === 'dark') document.documentElement.classList.add('dark-mode'); }catch(e){} })();