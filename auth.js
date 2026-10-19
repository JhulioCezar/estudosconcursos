import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from './config.js';
let client, user, ready = false, pending = null, saving = false, failed = false, recovering = false;
const empty = () => ({history:[],wrong:[],checks:{}});
const root = document.getElementById('app');
const account = document.getElementById('account');
const status = text => { const el=document.getElementById('sync-status'); if(el) el.textContent=text; };
function normalize(value) {
  if(!value || !Array.isArray(value.history) || !Array.isArray(value.wrong) || !value.checks || typeof value.checks!=='object') throw Error('Formato de progresso inválido.');
  return {history:value.history.filter(h=>typeof h.label==='string'&&typeof h.date==='string'&&Number.isFinite(h.score)&&Number.isFinite(h.max)&&Number.isFinite(h.percent)).slice(-1000),wrong:[...new Set(value.wrong.filter(id=>BANK.some(q=>q.id===id)))],checks:Object.fromEntries(Object.entries(value.checks).filter(([k,v])=>/^[0-6]$/.test(k)&&typeof v==='boolean'))};
}
function login(mode='login', message='') {
  ready=false; account.replaceChildren(); document.getElementById('nav').replaceChildren();
  const reset=mode==='reset', signup=mode==='signup', update=mode==='update';
  root.innerHTML=`<section class="panel" style="max-width:480px;margin:40px auto"><span class="chip">TRILHA LEGISLATIVA · CMRB</span><h1>${update?'Defina sua nova senha':reset?'Recuperar acesso':signup?'Crie sua conta':'Bem-vindo à sua trilha'}</h1><p class="muted">Estude no seu ritmo e acompanhe seu progresso.</p><form id="auth-form">${!update?'<label style="display:block">E-mail<input style="width:100%;margin:8px 0 16px" name="email" type="email" autocomplete="email" required maxlength="254"></label>':''}${!reset?`<label style="display:block">Senha<input style="width:100%;margin:8px 0 16px" name="password" type="password" autocomplete="${signup||update?'new-password':'current-password'}" required minlength="${signup||update?12:1}" maxlength="128"></label>`:''}${signup||update?'<p class="muted">Use pelo menos 12 caracteres.</p>':''}<button class="btn" type="submit">${update?'Salvar nova senha':reset?'Enviar link':signup?'Criar conta':'Entrar'}</button><p id="auth-message" role="status" aria-live="polite">${esc(message)}</p></form><div class="toolbar"><button class="inline" id="switch-mode">${signup||reset||update?'Voltar ao login':'Criar conta'}</button>${mode==='login'?'<button class="inline" id="forgot">Esqueci minha senha</button>':''}</div><p class="muted" style="font-size:12px">Seu e-mail é usado para acesso e recuperação da conta. Senhas são gerenciadas pelo Supabase Auth.</p></section>`;
  document.getElementById('switch-mode').onclick=()=>login(signup||reset||update?'login':'signup');
  if(document.getElementById('forgot')) document.getElementById('forgot').onclick=()=>login('reset');
  document.getElementById('auth-form').onsubmit=async event=>{
    event.preventDefault(); const form=event.currentTarget, button=form.querySelector('[type=submit]'), output=document.getElementById('auth-message'); button.disabled=true;
    const values=new FormData(form), email=String(values.get('email')||'').trim(), password=String(values.get('password')||'');
    try {
      let response;
      const redirect=location.origin+location.pathname;
      if(signup) response=await client.auth.signUp({email,password,options:{emailRedirectTo:redirect}});
      else if(reset) response=await client.auth.resetPasswordForEmail(email,{redirectTo:redirect});
      else if(update) response=await client.auth.updateUser({password});
      else response=await client.auth.signInWithPassword({email,password});
      if(response.error) throw response.error;
      form.reset();
      if(reset) output.textContent='Se o endereço estiver cadastrado, você receberá um link de recuperação.';
      else if(signup&&!response.data.session) output.textContent='Confira seu e-mail para confirmar o cadastro e depois entre na plataforma.';
      else if(update) {await client.auth.signOut();login('login','Senha atualizada. Entre com sua nova senha.');}
    } catch(error) { output.textContent=mode==='login'?'Não foi possível entrar. Confira e-mail e senha e tente novamente.':'Não foi possível concluir. Tente novamente em alguns instantes.'; }
    finally {button.disabled=false;}
  };
}
async function load(current) {
  if(recovering)return;
  if(user?.id===current.id&&ready)return;
  user=current; ready=false; state=empty(); session=null; clearInterval(tick); page='home';
  root.textContent='Carregando seu progresso…';
  try {
    const {data,error}=await client.from('student_progress').select('progress').eq('user_id',current.id).maybeSingle();
    if(error) throw error;
    if(user?.id!==current.id||recovering)return;
    state=data?normalize(data.progress):empty(); ready=true;
    account.innerHTML=`<div class="toolbar" style="align-items:center"><span>${esc(current.email||'Aluno')}</span><small id="sync-status" role="status">Progresso carregado</small><button class="inline" id="retry-save">Salvar agora</button><button class="btn secondary" id="logout">Sair da conta</button></div>`;
    document.getElementById('retry-save').onclick=()=>window.persistProgress();
    document.getElementById('logout').onclick=async()=>{
      if(saving||pending||failed){toast('Aguarde a sincronização ou tente salvar novamente antes de sair.');return;}
      if(session&&!session.finished&&!confirm('Sair da conta encerra o simulado em andamento. Continuar?'))return;
      const {error}=await client.auth.signOut(); if(error)toast('Não foi possível sair. Tente novamente.');
    };
    render();
  } catch(error) {
    root.innerHTML='<section class="panel"><h2>Não foi possível carregar seu progresso</h2><p>Confira sua conexão e tente novamente. Seus dados não serão substituídos.</p><button class="btn" id="reload-progress">Tentar novamente</button></section>';
    document.getElementById('reload-progress').onclick=()=>load(current);
  }
}
window.persistProgress=()=>{
  if(!ready||!user) return;
  pending={owner:user.id,progress:JSON.parse(JSON.stringify(state))}; failed=false; void flush();
};
async function flush(){
  if(saving)return; saving=true;
  while(pending&&ready&&user){
    const item=pending; pending=null; status('Salvando…');
    try{
      const {error}=await client.from('student_progress').upsert({user_id:item.owner,progress:item.progress,updated_at:new Date().toISOString()},{onConflict:'user_id'});
      if(error)throw error;
      failed=false;status('Progresso salvo na sua conta');
    }catch(error){failed=true;if(!pending)pending=item;status('Falha ao salvar. Use “Salvar agora” para tentar novamente.');break;}
  }
  saving=false;
}
window.addEventListener('online',()=>{if(pending)void flush();});
window.addEventListener('beforeunload',e=>{if(saving||pending||failed){e.preventDefault();e.returnValue='';}});
async function boot(){
  if(!SUPABASE_URL||!SUPABASE_PUBLIC_KEY){root.innerHTML='<section class="panel"><h1>Trilha Legislativa CMRB</h1><p>A plataforma está sendo preparada. Falta conectar o projeto Supabase para liberar o acesso dos alunos.</p></section>';return;}
  try{
    const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.1');
    client=createClient(SUPABASE_URL,SUPABASE_PUBLIC_KEY);
    client.auth.onAuthStateChange((event,current)=>{
      if(event==='PASSWORD_RECOVERY'){recovering=true;user=current?.user;login('update');return;}
      if(event==='SIGNED_OUT'){recovering=false;user=null;ready=false;pending=null;failed=false;state=empty();session=null;clearInterval(tick);login();return;}
      if(current&&event!=='TOKEN_REFRESHED')setTimeout(()=>void load(current.user),0);
    });
    const {data,error}=await client.auth.getSession();if(error)throw error;
    if(!data.session)login();
  }catch(error){root.innerHTML='<section class="panel"><h2>Não foi possível iniciar o acesso</h2><p>Confira sua conexão e recarregue a página.</p></section>';}
}
void boot();
