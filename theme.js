(() => {
  const key='estudos-appearance-v1';
  const palettes=[
    ['green','Verde','#24664d','#83d3a8'],['blue','Azul','#245db5','#96baff'],
    ['indigo','Índigo','#4a48a5','#b5b2ff'],['purple','Roxo','#76419c','#d5adf1'],
    ['rose','Rosa','#a33360','#f7a9c7'],['red','Vermelho','#aa3333','#ffaeaa'],
    ['orange','Laranja','#98420c','#ffc38e'],['yellow','Amarelo','#785b05','#f4d46f'],
    ['ocean','Oceano · gradiente','#175e80','#91d6f2','linear-gradient(115deg,#175e80,#24664d)'],
    ['sunset','Pôr do sol · gradiente','#97411d','#ffc1a3','linear-gradient(115deg,#97411d,#923964)']
  ];
  let prefs={mode:'system',palette:'green'};
  try {const saved=JSON.parse(localStorage.getItem(key));if(saved&&['light','dark','system'].includes(saved.mode)&&palettes.some(p=>p[0]===saved.palette))prefs=saved;}catch{}
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  function apply(){
    const dark=prefs.mode==='dark'||(prefs.mode==='system'&&media.matches);
    const p=palettes.find(p=>p[0]===prefs.palette);
    const html=document.documentElement;
    html.dataset.theme=dark?'dark':'light';html.dataset.mode=prefs.mode;
    html.style.setProperty('--accent',dark?p[3]:p[2]);html.style.setProperty('--accent-solid',p[2]);
    html.style.setProperty('--accent-fill',p[4]||p[2]);
    html.style.colorScheme=dark?'dark':'light';
    document.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===prefs.palette)));
  }
  function persist(){apply();try{localStorage.setItem(key,JSON.stringify(prefs));const s=document.getElementById('appearance-status');if(s)s.textContent='Preferências salvas neste navegador.';}catch{const s=document.getElementById('appearance-status');if(s)s.textContent='Preferência aplicada; o navegador não permitiu salvar.';}}
  apply();media.addEventListener('change',()=>{if(prefs.mode==='system')apply();});
  document.addEventListener('DOMContentLoaded',()=>{
    const host=document.getElementById('appearance');if(!host)return;
    host.innerHTML=`<details class="appearance-panel"><summary>Aparência</summary><div class="appearance-options"><label>Tema<select id="theme-mode"><option value="light">Claro</option><option value="dark">Escuro</option><option value="system">Sistema</option></select></label><fieldset><legend>Cor de destaque</legend><div class="palette-list">${palettes.map(p=>`<button type="button" data-palette="${p[0]}" aria-pressed="false"><span class="color-sample" style="background:${p[4]||p[2]}" aria-hidden="true"></span>${p[1]}</button>`).join('')}</div></fieldset><small id="appearance-status" role="status">Preferências salvas neste navegador.</small></div></details>`;
    const select=document.getElementById('theme-mode');select.value=prefs.mode;
    select.addEventListener('change',()=>{prefs.mode=select.value;persist();});
    host.querySelectorAll('[data-palette]').forEach(b=>b.addEventListener('click',()=>{prefs.palette=b.dataset.palette;persist();}));apply();
  });
})();
