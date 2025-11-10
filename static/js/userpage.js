// ================= Utils =================
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const fmt = new Intl.NumberFormat('es-CO');
  const storage = {
    get(k, def){ try{ const v = localStorage.getItem(k); return v? JSON.parse(v): def }catch{ return def }},
    set(k, val){ try{ localStorage.setItem(k, JSON.stringify(val)) }catch{} }
  };
  const todayISO = () => new Date().toISOString().slice(0,10);

  // ================ Navegación / Layout ================
  const sections = [
    { id:'horas', icon:'⏱️', label:'Horas libres', render: renderHoras },
    { id:'calendario', icon:'🗓️', label:'Calendario', render: renderCalendario },
    { id:'promedio', icon:'📊', label:'Simulador de promedio', render: renderPromedio },
    { id:'fallas', icon:'✅', label:'Calculadora de fallas', render: renderFallas },
    { id:'reservas', icon:'📍', label:'Reservas', render: renderReservas },
  ];

  const activeKey = 'ui.activeSection';
  let active = storage.get(activeKey, 'horas');

  function drawSidebar(){
    const nav = $('#sidebar');
    nav.innerHTML = '';
    sections.forEach(s=>{
      const btn = document.createElement('button');
      btn.className = 'navbtn' + (active===s.id? ' active':'');
      btn.innerHTML = `<span>${s.icon}</span><span>${s.label}</span>`;
      btn.addEventListener('click', ()=>{
        active = s.id; storage.set(activeKey, active); drawSidebar(); drawContent();
      });
      nav.appendChild(btn);
    })
  }

  function drawContent(){
    const content = $('#content');
    content.innerHTML = '';
    sections.forEach(s=>{
      const wrap = document.createElement('section');
      wrap.className = 'panel' + (active===s.id? '':' hidden');
      wrap.dataset.section = s.id;
      s.render(wrap);
      content.appendChild(wrap);

      // Si la sección es la activa, animarla al mostrarse
      if(active === s.id){
        // Esperar al siguiente frame para forzar la animación
        requestAnimationFrame(()=>{
          wrap.classList.add('fade-in');
          wrap.addEventListener('animationend', ()=> wrap.classList.remove('fade-in'), { once:true });
        });
      }
    })
  }

  // ===================== 1) HORAS LIBRES =====================
  // Ya no usamos eventos fijos; los eventos del panel vienen de lo que el usuario registra en las páginas de eventos.
  function demoEventos(){ return []; } // kept for compatibility (no-op)

  function renderHoras(root){
    const acumuladasKey='horas.acumuladas', objetivoKey='horas.objetivo';
    const eventosKey='user.events';
    let acumuladas = storage.get(acumuladasKey, 0);
    const objetivo = storage.get(objetivoKey, 48);
    let eventos = storage.get(eventosKey, []);

    const pct = objetivo>0 ? Math.round((acumuladas/objetivo)*100) : 0;

    const achievements = [
      { id:'primiparo', title:'Primiparo', pct:25, text:'¡Felicitaciones! Llevas el 25% de tus horas completas.' },
      { id:'amateur', title:'Amateur', pct:50, text:'¡Felicitaciones! Llevas el 50% de tus horas completas.' },
      { id:'master', title:'Master', pct:75, text:'¡Felicitaciones! Llevas el 75% de tus horas completas.' },
      { id:'doctor', title:'Doctor', pct:100, text:'¡Felicitaciones! Llevas el 100% de tus horas completas.' },
    ];

    root.innerHTML = `
      <h2>Horas libres</h2>
      <div class="muted">Meta: ${objetivo} horas</div>

      <div class="grid gap-6" style="margin-top:12px">
        <div class="card">
          <div class="between" style="margin-bottom:8px">
            <div>
              <div style="font-size:24px;font-weight:700" id="horas-count">${acumuladas} / ${objetivo}</div>
              <div class="muted" style="font-size:12px" id="horas-remaining">Te faltan ${Math.max(0, objetivo - acumuladas)} horas</div>
            </div>
          </div>
          <div class="progress"><span id="progress-bar" style="width:${pct}%"></span></div>
          <div class="muted" style="text-align:right;font-size:12px;margin-top:4px" id="horas-pct">${pct}%</div>

          <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
            <input id="hours-input" type="number" min="0" value="1" style="width:88px;padding:8px;border-radius:8px;border:1px solid var(--line);background:var(--bg2);color:var(--text)"/>
            <button class="btn" id="add-hours">+ Añadir</button>
            <button class="btn ghost" id="sub-hours">− Quitar</button>
          </div>
        </div>

        <div class="card">
          <div class="between" style="margin-bottom:8px">
            <div style="font-weight:600">Próximos eventos</div>
            <div class="muted" style="font-size:12px">(${eventos.length})</div>
          </div>
          <ul class="list" id="lista-ev"></ul>
          ${eventos.length===0 ? `<div class="muted" style="font-size:12px">Aún no te has registrado en ningún evento. Regístrate desde la página de eventos.</div>` : ''}
        </div>
      </div>

      <div style="margin-top:12px" class="card achievements">
        <div style="font-weight:600;margin-bottom:8px">Logros</div>
        <div class="grid grid-4" id="ach-grid" style="gap:8px"></div>
      </div>
    `;

    // Render eventos (misma lógica previa)
    const ul = $('#lista-ev', root);
    ul.innerHTML = '';
    eventos.sort((a,b)=>a.fecha.localeCompare(b.fecha)).forEach(ev=>{
      const li=document.createElement('li');
      li.className='li';
      const imgHtml = ev.img ? `<div class="ev-img"><img data-base="${ev.img}" src="${ev.img}.svg" alt="${ev.titulo}"></div>` : `<div class="ev-placeholder" data-ev-id="${ev.id}"></div>`;
      li.innerHTML=`
        <div class="ev-row">
          ${imgHtml}
          <div style="flex:1">
            <div style="font-weight:600">${ev.titulo}</div>
            <div class="k">${ev.fecha} · ${ev.lugar||''}</div>
            <div class="muted" style="margin-top:6px;font-size:13px">${ev.descripcion||''}</div>
          </div>
        </div>`;
      ul.appendChild(li);
    });

    (function resolveImages(){
      const exts = ['.svg','.png','.jpg','.jpeg','.webp'];
      const imgs = Array.from(ul.querySelectorAll('img[data-base]'));
      imgs.forEach(img => {
        const base = img.dataset.base;
        let idx = 0;
        function tryNext(){
          if(idx >= exts.length){
            const placeholder = document.createElement('div');
            placeholder.className = 'ev-placeholder';
            placeholder.textContent = '';
            img.parentElement.replaceChild(placeholder, img);
            return;
          }
          const trySrc = base + exts[idx++];
          img.onerror = tryNext;
          img.onload = function(){ img.onerror = img.onload = null; };
          img.src = trySrc;
        }
        tryNext();
      });
    })();

    // Render achievements
    const grid = $('#ach-grid', root);
    achievements.forEach(a=>{
      const unlocked = pct >= a.pct;
      const d = document.createElement('div');
      d.className = 'ach-card' + (unlocked ? ' unlocked' : '');
      d.innerHTML = `<div style="font-weight:700">${a.title}</div><div class="k" style="margin:6px 0">${a.pct}%</div><div style="font-size:12px">${unlocked? a.text : 'Alcanza el ' + a.pct + '% para desbloquear'}</div>`;
      grid.appendChild(d);
    });

    // Helpers: modificar horas y persistir
    function changeHours(delta){
      let val = Number(storage.get(acumuladasKey, 0)) + delta;
      val = Math.max(0, Math.round(val*100)/100); // no negativo, normalizar decimales
      storage.set(acumuladasKey, val);
      // re-render toda la sección para simplificar actualización
      renderHoras(root);
    }

    // Handlers
    $('#add-hours', root).addEventListener('click', ()=> {
      const v = Number($('#hours-input', root).value || 0);
      if(v<=0){ alert('Ingresa un número positivo'); return; }
      changeHours(v);
    });
    $('#sub-hours', root).addEventListener('click', ()=> {
      const v = Number($('#hours-input', root).value || 0);
      if(v<=0){ alert('Ingresa un número positivo'); return; }
      changeHours(-v);
    });
  }

  // ===================== 2) CALENDARIO =====================
  function renderCalendario(root){
    const key='cal.items';
    let items = storage.get(key, []);

    // state
    let view = storage.get('cal.view', 'calendar'); // 'calendar' or 'list'
    let cur = new Date(); // current month shown
    let selected = null;

    function eventsByDate(arr){
      const m = new Map();
      arr.forEach(it=>{
        const d = (it.fecha||'').toString();
        if(!m.has(d)) m.set(d, []);
        m.get(d).push(it);
      });
      return m;
    }

    function startOfMonth(dt){ return new Date(dt.getFullYear(), dt.getMonth(), 1); }
    function prevMonth(dt){ return new Date(dt.getFullYear(), dt.getMonth()-1, 1); }
    function nextMonth(dt){ return new Date(dt.getFullYear(), dt.getMonth()+1, 1); }

    function build(){
      items = storage.get(key, []);
      const evMap = eventsByDate(items);
      root.innerHTML = `
        <h2>Calendario</h2>
        <div class="muted">Eventos guardados localmente</div>
        <div class="view-toggle">
          <button class="btn" data-view="calendar"${view==='calendar'?' ':''}>Vista calendario</button>
          <button class="btn" data-view="list"${view==='list'?' ':''}>Vista lista</button>
        </div>
        <div class="cal-wrap">
          <div class="cal-panel" id="cal-panel"></div>
          <div class="cal-panel" id="side-panel">
            <div style="font-weight:600;margin-bottom:8px">Eventos del día</div>
            <div id="day-events" class="day-events muted">Selecciona un día</div>
            <div style="height:12px"></div>
            <div style="font-weight:600;margin-bottom:8px">Agregar evento</div>
            <form id="form-cal" class="grid" style="gap:6px">
              <input name="titulo" placeholder="Título" />
              <input name="fecha" type="date" value="${todayISO()}" />
              <input name="hora" type="time" value="08:00" />
              <input name="nota" placeholder="Nota (opcional)" />
              <div><button class="btn primary">Guardar</button></div>
            </form>
          </div>
        </div>
      `;

      // attach handlers
      root.querySelectorAll('[data-view]').forEach(b=> b.addEventListener('click', (e)=>{
        view = e.currentTarget.dataset.view;
        storage.set('cal.view', view);
        renderMain();
      }));

      const form = $('#form-cal', root);
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const fd = new FormData(form);
        const it = {
          id: crypto.randomUUID ? crypto.randomUUID() : ('ev_'+Date.now()),
          titulo:(fd.get('titulo')||'Evento').toString(),
          fecha:(fd.get('fecha')||todayISO()).toString(),
          hora:(fd.get('hora')||'08:00').toString(),
          nota:(fd.get('nota')||'').toString()
        };
        items = [it, ...items]; storage.set(key, items);
        renderMain();
        form.reset();
      });

      renderMain();
    }

    function renderMain(){
      const panel = $('#cal-panel', root);
      panel.innerHTML = '';
      if(view === 'list'){
        // simple list (reuse previous behavior)
        if(items.length===0){ panel.innerHTML = '<div class=\"muted\">Aún no hay eventos.</div>'; return; }
        const grouped = Array.from(items).sort((a,b)=> a.fecha.localeCompare(b.fecha));
        const ul = document.createElement('ul'); ul.className='list';
        grouped.forEach(it=>{
          const li = document.createElement('li'); li.className='li';
          li.innerHTML = `<div><div style="font-weight:600">${it.titulo}</div><div class="k">⏰ ${it.fecha} ${it.hora||''}${it.nota? ' · '+it.nota:''}</div></div><button class="btn" data-del="${it.id}">Borrar</button>`;
          ul.appendChild(li);
        });
        panel.appendChild(ul);
        panel.addEventListener('click', (e)=>{
          const del = e.target.closest('[data-del]');
          if(del){ items = items.filter(x=>x.id!==del.dataset.del); storage.set(key, items); renderMain(); }
        });
        return;
      }

      // render calendar month
      const monthStart = startOfMonth(cur);
      const monthName = monthStart.toLocaleString('es-ES', { month:'long', year:'numeric' });
      const hdr = document.createElement('div'); hdr.className='cal-header';
      hdr.innerHTML = `<div><button class="btn" id="prev">&lt;</button> <strong style="margin:0 8px">${monthName}</strong> <button class="btn" id="next">&gt;</button></div><div class="k">Hoy: ${todayISO()}</div>`;
      panel.appendChild(hdr);

      const weekdays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
      const wk = document.createElement('div'); wk.className='cal-grid';
      weekdays.forEach(w => { const d = document.createElement('div'); d.className='cal-weekday'; d.textContent = w; wk.appendChild(d); });

      // compute first day to show (start Monday)
      const first = new Date(monthStart);
      const startDay = (first.getDay()+6)%7; // convert Sun=0 to index with Mon=0
      first.setDate(first.getDate() - startDay);

      const matrix = [];
      const date = new Date(first);
      for(let i=0;i<42;i++){
        const dcell = document.createElement('div');
        dcell.className = 'cal-day';
        const isOther = (date.getMonth() !== monthStart.getMonth());
        if(isOther) dcell.classList.add('other-month');
        const ymd = date.toISOString().slice(0,10);
        if(ymd === todayISO()) dcell.classList.add('today');
        dcell.innerHTML = `<div class="date">${date.getDate()}</div>`;
        const evs = items.filter(ev => ev.fecha === ymd);
        evs.slice(0,3).forEach(ev=>{
          const b = document.createElement('div'); b.className='ev';
          b.textContent = ev.titulo;
          b.title = ev.titulo;
          b.addEventListener('click', (e)=>{ e.stopPropagation(); showDayEvents(ymd); });
          dcell.appendChild(b);
        });
        if(evs.length>3){
          const more = document.createElement('div'); more.className='k'; more.textContent = `+${evs.length-3} más`; more.style.marginTop='6px'; more.addEventListener('click', ()=> showDayEvents(ymd));
          dcell.appendChild(more);
        }
        dcell.addEventListener('click', ()=> { selected = ymd; showDayEvents(ymd); });
        wk.appendChild(dcell);
        date.setDate(date.getDate()+1);
      }
      panel.appendChild(wk);

      // nav handlers
      $('#prev', panel).addEventListener('click', ()=>{ cur = prevMonth(cur); renderMain(); });
      $('#next', panel).addEventListener('click', ()=>{ cur = nextMonth(cur); renderMain(); });

      // delete events from side panel if requested (list view handled above)
    }

    function showDayEvents(ymd){
      const listEl = $('#day-events', root);
      const evs = items.filter(ev => ev.fecha === ymd);
      if(evs.length===0){ listEl.innerHTML = `<div class="muted">No hay eventos en ${ymd}</div>`; return; }
      listEl.innerHTML = '';
      evs.forEach(ev=>{
        const row = document.createElement('div'); row.style.marginBottom='8px';
        row.innerHTML = `<div style="font-weight:700">${ev.titulo}</div><div class="k">⏰ ${ev.hora||''} · ${ev.nota||''}</div><div style="margin-top:6px"><button class="btn" data-del="${ev.id}">Borrar</button></div>`;
        listEl.appendChild(row);
      });
      // attach delete handlers
      listEl.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', (e)=>{
        const id = e.currentTarget.dataset.del;
        items = items.filter(x=>x.id!==id); storage.set(key, items);
        build(); // rebuild whole calendar to reflect changes
      }));
    }

    // inicializar
    build();
  }

  // ===================== 3) SIMULADOR PROMEDIO =====================
  function renderPromedio(root){
    const escKey='prom.escala', metaKey='prom.meta', itemsKey='prom.items';
    let escala = storage.get(escKey, '0-5');
    let meta = Number(storage.get(metaKey, 3.0));
    let items = storage.get(itemsKey, [
      { id: crypto.randomUUID(), nombre:'Parcial 1', peso:30, nota:3.5 },
      { id: crypto.randomUUID(), nombre:'Talleres', peso:20, nota:4.0 },
      { id: crypto.randomUUID(), nombre:'Parcial 2', peso:30, nota:null },
      { id: crypto.randomUUID(), nombre:'Proyecto', peso:20, nota:null },
    ]);

    function base(){ return escala==='0-5'? 5: 100 }

    function compute(){
      const B = base();
      let sum=0, pHecho=0; // sum ponderado en base B, y peso usado (0..1)
      items.forEach(it=>{
        if(it.nota!==null && it.nota!=='' && !isNaN(it.nota)){
          sum += (Number(it.nota)/B) * (it.peso/100);
          pHecho += it.peso/100;
        }
      });
      const pRest = Math.max(0, 1 - pHecho);
      const promedioActual = pHecho===0? 0: (sum*B)/pHecho;
      const necesario = pRest<=0? null: ((meta - sum*B)/pRest);
      return {B, sum:sum*B, pHecho, pRest, promedioActual, necesario: Number.isFinite(necesario)? Math.max(0, Math.min(B, Number(nesec(necesario)))): null };
    }
    const nesec = (x)=> (Math.round(x*100)/100).toFixed(2);

    function totalPeso(){ return items.reduce((a,b)=> a + Number(b.peso||0), 0) }

    root.innerHTML=`
      <h2>Simulador de promedio académico</h2>
      <div class="muted">Ingresa pesos (%) y notas. Soporta escala 0–5 o 0–100.</div>

      <div class="grid grid-4" style="margin-top:12px">
        <div class="card">
          <div class="k">Escala</div>
          <select id="escala">
            <option value="0-5" ${escala==='0-5'?'selected':''}>0 – 5</option>
            <option value="0-100" ${escala==='0-100'?'selected':''}>0 – 100</option>
          </select>
        </div>
        <div class="card">
          <div class="k">Meta para pasar</div>
          <input id="meta" type="number" step="0.01" min="0" max="${base()}" value="${meta}">
        </div>
        <div class="card">
          <div class="k">Promedio con lo registrado</div>
          <div style="font-size:22px;font-weight:700" id="prom-act">0.00</div>
        </div>
        <div class="card">
          <div class="k">Necesitas en lo restante</div>
          <div style="font-size:22px;font-weight:700" id="necesario">—</div>
          <div class="k" id="peso-rest">Peso restante: 0%</div>
        </div>
      </div>

      <div class="card" style="margin-top:8px">
        <div class="between" style="margin-bottom:8px">
          <div style="font-weight:600">Evaluaciones</div>
          <div class="k" id="peso-total"></div>
        </div>
        <div class="table th">
          <div>Nombre</div><div>Peso (%)</div><div>Nota (${escala})</div><div></div>
        </div>
        <div class="hr"></div>
        <div id="rows" class="grid" style="gap:8px"></div>
        <div class="between" style="margin-top:10px">
          <button class="btn" id="add">+ Agregar evaluación</button>
          <button class="btn ghost" id="clr">Limpiar</button>
        </div>
      </div>

      <div class="muted" style="font-size:12px;margin-top:6px">
        • Fórmula: Nota final = Σ(Notaᵢ/Base × Pesoᵢ/100) × Base · "Necesitas" calcula el promedio requerido en el peso restante para alcanzar la meta.
      </div>
    `;

    function drawRows(){
      const host = $('#rows', root); host.innerHTML='';
      items.forEach(it=>{
        const row=document.createElement('div'); row.className='table';
        row.innerHTML=`
          <input value="${it.nombre}" data-id="${it.id}" data-field="nombre"/>
          <input type="number" min="0" max="100" value="${it.peso}" data-id="${it.id}" data-field="peso"/>
          <input type="number" step="0.01" min="0" max="${base()}" value="${it.nota??''}" placeholder="(pendiente)" data-id="${it.id}" data-field="nota"/>
          <button class="btn" data-del="${it.id}" title="Eliminar">✕</button>`;
        host.appendChild(row);
      })
      updateStats();
    }

    function updateStats(){
      const {pRest, promedioActual, necesario} = compute();
      $('#prom-act', root).textContent = (Math.round(promedioActual*100)/100).toFixed(2);
      $('#necesario', root).textContent = necesario===null? '—' : necesario.toFixed(2);
      $('#peso-rest', root).textContent = `Peso restante: ${Math.round(pRest*100)}%`;
      const total = totalPeso();
      $('#peso-total', root).textContent = `Peso total: ${total}% ${total!==100? '(ideal: 100%)':''}`;
    }

    drawRows();

    root.addEventListener('input', (e)=>{
      const t=e.target;
      if(t.id==='escala'){
        escala=t.value; storage.set(escKey, escala); $('#meta',root).max = base(); updateStats();
      } else if(t.id==='meta'){
        meta=Number(t.value||0); storage.set(metaKey, meta); updateStats();
      } else if(t.dataset && t.dataset.field){
        const id=t.dataset.id, f=t.dataset.field;
        items = items.map(x=> x.id===id? {...x, [f]: f==='nombre'? t.value : (t.value===''? null : Number(t.value)) }: x);
        storage.set(itemsKey, items); updateStats();
      }
    });

    root.addEventListener('click', (e)=>{
      const del = e.target.closest('[data-del]');
      if(del){ items = items.filter(x=>x.id!==del.dataset.del); storage.set(itemsKey, items); drawRows(); }
      if(e.target.id==='add'){
        items=[...items, {id:crypto.randomUUID(), nombre:'Nuevo', peso:10, nota:null}]; storage.set(itemsKey, items); drawRows();
      }
      if(e.target.id==='clr'){ items=[]; storage.set(itemsKey, items); drawRows(); }
    });
  }

  // ===================== 4) CALCULADORA FALLAS =====================
  function renderFallas(root){
    const iniKey='fallas.ini', finKey='fallas.fin', freqKey='fallas.freq', fesKey='fallas.festivos', canKey='fallas.canceladas', actKey='fallas.actuales';
    let ini = storage.get(iniKey, todayISO());
    let fin = storage.get(finKey, todayISO());
    let freq = Number(storage.get(freqKey, 2));
    let fest = Number(storage.get(fesKey, 0));
    let cancel = Number(storage.get(canKey, 0));
    let faltas = Number(storage.get(actKey, 0));

    root.innerHTML = `
      <h2>Calculadora de asistencias/fallas</h2>
      <div class="muted">Política: máximo 20% de fallas respecto a las sesiones efectivas.</div>

      <div class="grid grid-2" style="margin-top:12px">
        <div class="card grid grid-2">
          <div>
            <div class="k">Inicio del semestre</div>
            <input type="date" id="ini" value="${ini}" />
          </div>
          <div>
            <div class="k">Fin del semestre</div>
            <input type="date" id="fin" value="${fin}" />
          </div>
          <div>
            <div class="k">Sesiones por semana</div>
            <input type="number" id="freq" min="1" value="${freq}" />
          </div>
          <div>
            <div class="k">Clases perdidas por festivos</div>
            <input type="number" id="fest" min="0" value="${fest}" />
          </div>
          <div>
            <div class="k">Clases canceladas (profesor/paro/etc.)</div>
            <input type="number" id="cancel" min="0" value="${cancel}" />
          </div>
          <div>
            <div class="k">Tus faltas actuales</div>
            <input type="number" id="faltas" min="0" value="${faltas}" />
          </div>
        </div>

        <div class="card" id="res"></div>
      </div>

      <div class="muted" style="font-size:12px;margin-top:6px">• Cálculo: sesiones efectivas = semanas × sesiones/semana − festivos − canceladas. Límite de fallas = ⌊0,2 × sesiones efectivas⌋.</div>
    `;

    function weeksBetween(a,b){ const ms = Math.max(0, (b-a)); return Math.ceil(ms / (1000*60*60*24*7)); }

    function compute(){
      const d1=new Date(ini), d2=new Date(fin);
      const semanas = weeksBetween(d1,d2);
      const plan = Math.max(0, semanas * Number(freq));
      const efect = Math.max(0, plan - Number(fest) - Number(cancel));
      const maxF = Math.floor(efect * 0.2);
      const restantes = Math.max(0, maxF - Number(faltas));
      const pct = (maxF>0)? Math.min(100, Math.round((Number(faltas)/maxF)*100)) : 0;
      let estado='OK', badge='ok';
      if(restantes===0) {estado='Límite'; badge='danger'} else if(restantes<=2){estado='Riesgo'; badge='warn'}
      return {semanas, plan, efect, maxF, restantes, pct, estado, badge};
    }

    function draw(){
      const r = compute();
      const res = $('#res', root);
      res.innerHTML = `
        <div class="k">Resumen</div>
        <div class="between"><span>Semanas</span><span>${fmt.format(r.semanas)}</span></div>
        <div class="between"><span>Sesiones planificadas</span><span>${fmt.format(r.plan)}</span></div>
        <div class="between"><span>Sesiones efectivas</span><span>${fmt.format(r.efect)}</span></div>
        <div class="between"><span>Fallas permitidas (20%)</span><span>${fmt.format(r.maxF)}</span></div>
        <div class="between"><span>Te quedan</span><span>${fmt.format(r.restantes)}</span></div>
        <div class="progress" style="height:8px;margin-top:6px"><span style="width:${r.pct}%"></span></div>
        <div class="row" style="margin-top:6px"><span class="pill ${r.badge}">${r.estado}</span><span class="k">Has usado ${r.pct}% de tu margen</span></div>`;
    }

    draw();

    root.addEventListener('input', (e)=>{
      if(e.target.id==='ini'){ ini=e.target.value; storage.set(iniKey, ini); }
      if(e.target.id==='fin'){ fin=e.target.value; storage.set(finKey, fin); }
      if(e.target.id==='freq'){ freq=Number(e.target.value||1); storage.set(freqKey, freq); }
      if(e.target.id==='fest'){ fest=Number(e.target.value||0); storage.set(fesKey, fest); }
      if(e.target.id==='cancel'){ cancel=Number(e.target.value||0); storage.set(canKey, cancel); }
      if(e.target.id==='faltas'){ faltas=Number(e.target.value||0); storage.set(actKey, faltas); }
      draw();
    });
  }

  // ===================== 5) RESERVAS DE ESPACIOS =====================
  function renderReservas(root){
    const KEY = 'reservas.items.v1';
    function pad(n){ return n<10? '0'+n : ''+n; }
    function todayISO(){ const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

    function genTimeOptions(){
      const start = 8*60, end = 20*60;
      const opts = [];
      for(let m=start; m<=end; m+=30){
        const hh = Math.floor(m/60); const mm = m%60;
        opts.push(pad(hh)+':'+pad(mm));
      }
      return opts;
    }

    function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]') }catch{ return [] } }
    function save(v){ try{ localStorage.setItem(KEY, JSON.stringify(v)) }catch{} }

    function add(res){
      const all = load(); res.id = Date.now(); res.createdAt = new Date().toISOString(); all.push(res); save(all);
    }
    function remove(id){
      const all = load().filter(r=> r.id !== id); save(all);
    }

    function toGoogleDates(startDate, startTime, durationMinutes = 60){
      const start = new Date(startDate + 'T' + startTime + ':00');
      const end = new Date(start.getTime() + durationMinutes*60000);
      function fmt(d){ return d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'; }
      return { start: fmt(start), end: fmt(end) };
    }

    function openGoogle(res){
      const { start, end } = toGoogleDates(res.date, res.time, 60);
      const title = encodeURIComponent('Reserva: ' + res.space);
      const details = encodeURIComponent('Reserva hecha desde panel UNAB.');
      const location = encodeURIComponent(res.space);
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
      window.open(url, '_blank');
    }

    // markup (se quitaron los '+' erróneos)
    root.innerHTML = `
      <h2>Reservas de espacios</h2>
      <div class="muted">Selecciona espacio, fecha y hora (08:00 - 20:00).</div>
      <div style="margin-top:12px" class="card">
        <form id="frm-res" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          <label style="flex:1;min-width:200px;display:flex;flex-direction:column">
            Espacio
            <select id="space" required style="margin-top:6px;padding:8px">
              <optgroup label="Espacios deportivos">
                <option>Gimnasio</option>
                <option>Cancha de fútbol</option>
                <option>Cancha de padel 1</option>
                <option>Cancha de padel 2</option>
                <option>Cancha de tenis</option>
              </optgroup>
              <optgroup label="Espacios académicos">
                <option>Sala de estudio 1</option>
                <option>Sala de estudio 2</option>
                <option>Sala de estudio 3</option>
              </optgroup>
            </select>
          </label>
          <label style="min-width:160px;display:flex;flex-direction:column">
            Fecha
            <input id="date" type="date" required style="margin-top:6px;padding:8px" />
          </label>
          <label style="min-width:140px;display:flex;flex-direction:column">
            Hora
            <select id="time" required style="margin-top:6px;padding:8px"></select>
          </label>
          <div style="margin-left:auto">
            <button id="btn-res" class="btn">Reservar</button>
          </div>
        </form>
      </div>
      <div style="margin-top:12px" id="reservas-list"></div>
    `;

    const timeEl = root.querySelector('#time');
    const dateEl = root.querySelector('#date');
    const spaceEl = root.querySelector('#space');
    const listEl = root.querySelector('#reservas-list');
    const frm = root.querySelector('#frm-res');

    // init values
    genTimeOptions().forEach(t => { const o = document.createElement('option'); o.value=t; o.textContent=t; timeEl.appendChild(o); });
    dateEl.min = todayISO(); dateEl.value = todayISO();

    function render(){
      const all = load().sort((a,b)=> a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
      if(all.length===0){ listEl.innerHTML = '<div class="muted">No hay reservas registradas.</div>'; return; }
      const grouped = all.reduce((acc,r)=>{ (acc[r.date]=acc[r.date]||[]).push(r); return acc }, {});
      const frag = document.createDocumentFragment();
      Object.keys(grouped).sort().forEach(d=>{
        const h = document.createElement('div'); h.style.marginTop='8px'; h.innerHTML = `<strong>${d}</strong>`; frag.appendChild(h);
        const ul = document.createElement('ul'); ul.className='list'; ul.style.margin='6px 0 12px 0';
        grouped[d].forEach(it=>{
          const li = document.createElement('li'); li.className='li';
          li.innerHTML = `<div style="display:flex;gap:8px;align-items:center"><div style="min-width:86px">${it.time}</div><div style="flex:1">${it.space}</div></div>
            <div><button class="btn" data-gc="${it.id}" style="margin-right:6px">Google Calendar</button><button class="btn ghost" data-del="${it.id}">Eliminar</button></div>`;
          ul.appendChild(li);
        });
        frag.appendChild(ul);
      });
      listEl.innerHTML = ''; listEl.appendChild(frag);
      // attach handlers
      listEl.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', e=>{
        const id = Number(e.currentTarget.dataset.del);
        if(confirm('Eliminar reserva?')){ remove(id); render(); }
      }));
      listEl.querySelectorAll('[data-gc]').forEach(b=> b.addEventListener('click', e=>{
        const id = Number(e.currentTarget.dataset.gc);
        const it = load().find(x=> x.id === id); if(it) openGoogle(it);
      }));
    }

    frm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const space = spaceEl.value, date = dateEl.value, time = timeEl.value;
      if(!space || !date || !time){ alert('Completa espacio, fecha y hora.'); return; }
      add({ space, date, time });
      alert('Reserva guardada.');
      render();
    });

    render();
  }

  // ================ Init ================
  drawSidebar();
  drawContent();

  // Colocar nombre de usuario desde login (guardado en localStorage por login.html)
  try{
    const uname = storage.get('user.name', null);
    const g = document.getElementById('greeting');
    if(g) g.textContent = 'Hola, ' + (uname || 'Estudiante');
  }catch(e){}

  // Sincronizar eventos del usuario ('user.events') con el calendario local ('cal.items')
  try{
    const userEvKey = 'user.events', calKey='cal.items';
    const userEvents = storage.get(userEvKey, []);
    if(userEvents.length>0){
      const cal = storage.get(calKey, []);
      // Añadir sólo los que no existan (comparando titulo+fecha+hora)
      userEvents.forEach(ev => {
        const exists = cal.some(c => c.titulo===ev.titulo && c.fecha===ev.fecha && (c.hora||'08:00') === (ev.hora||'08:00'));
        if(!exists){
          cal.push({ id: ev.id || (crypto.randomUUID?crypto.randomUUID():('ev_'+Date.now())), titulo: ev.titulo, fecha: ev.fecha, hora: ev.hora||'08:00', nota: ev.descripcion||'' });
        }
      });
      storage.set(calKey, cal);
    }
  }catch(e){}

  // Tema: aplicar desde almacenamiento y controlar botón (persistente para todas las páginas)
  (function(){
    const btn = document.getElementById('theme-toggle');
    function applyTheme(t){
      try{
        if(t === 'dark'){
          document.documentElement.classList.add('dark-mode');
          document.documentElement.classList.remove('light-mode');
        } else {
          document.documentElement.classList.add('light-mode');
          document.documentElement.classList.remove('dark-mode');
        }
      }catch(e){}
      if(btn) btn.textContent = (t==='dark')? '☀️' : '🌓';
    }
    try{
      const current = localStorage.getItem('site.theme') || 'light';
      applyTheme(current);
    }catch(e){}
    if(btn){
      btn.addEventListener('click', ()=>{
        try{
          const now = document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark';
           localStorage.setItem('site.theme', now);
           applyTheme(now);
        }catch(e){}
      });
    }

    // Nuevo: botón para volver a la página principal (index.html)
    const back = document.getElementById('back-home');
    if(back){
      back.addEventListener('click', ()=> { location.href = 'index.html'; });
    }
  })();