function paperQuiz(){
  const s=session;s.flags??={};const total=s.questions.length,pages=[];
  for(let offset=0;offset<total;offset+=3){
    const pageNumber=offset/3+1;
    pages.push(`<section class="exam-paper" aria-label="Página ${pageNumber} do caderno"><header class="paper-header"><div class="paper-overline">Estudos Concursos · preparação CMRB</div><h1>Caderno de questões · Agente Legislativo</h1><p>${total} questões · 3 horas · 60 pontos</p>${offset===0?'<p class="candidate-line">Nome: __________________________________________________</p><p class="paper-instructions">Assinale uma alternativa por questão. Específicos têm peso 2; as demais disciplinas, peso 1. Os comentários serão apresentados somente ao finalizar. Questões autorais de treinamento; este caderno não é uma prova oficial.</p>':''}</header>${s.questions.slice(offset,offset+3).map((q,j)=>{
      const number=offset+j+1;
      return `<article class="paper-question" id="paper-q-${q.id}"><h2>QUESTÃO ${String(number).padStart(2,'0')} · ${esc(q.subject)}</h2><p id="paper-text-${q.id}">${esc(q.text)}</p><div role="radiogroup" aria-labelledby="paper-text-${q.id}">${q.order.map((original,letter)=>`<label class="paper-option"><input type="radio" name="paper-answer-${q.id}" value="${original}" ${s.answers[q.id]===original?'checked':''} onchange="paperAnswer(${q.id},${original})"><b>${'ABCDE'[letter]})</b><span>${esc(q.options[original])}</span></label>`).join('')}</div><div class="paper-actions"><button type="button" id="flag-${q.id}" aria-pressed="${!!s.flags[q.id]}" onclick="paperFlag(${q.id})">${s.flags[q.id]?'Marcada para revisão':'Marcar para revisão'}</button><button type="button" onclick="paperClear(${q.id})">Limpar resposta</button></div></article>`;
    }).join('')}<footer class="paper-page-number">Caderno de treinamento · página ${pageNumber} de ${Math.ceil(total/3)}</footer></section>`);
  }
  $('app').innerHTML=`<div class="exam-toolbar"><div class="exam-status"><b>Simulado completo</b><small><span id="paper-count">${Object.keys(s.answers).length}</span> de ${total} respondidas · <span id="paper-flags">${Object.values(s.flags).filter(Boolean).length}</span> para revisar</small></div><span class="timer" id="timer" role="timer" aria-label="Tempo restante">${clock()}</span><div class="toolbar"><button class="btn secondary" onclick="window.print()">Imprimir caderno / PDF</button><button class="btn" onclick="requestFinish()">Finalizar prova</button><button class="inline" onclick="quit()">Sair</button></div></div><p class="muted no-print">Responda no caderno e confira o cartão ao final. Recarregar a página encerra esta tentativa.</p>${pages.join('')}<section class="exam-sheet" aria-label="Cartão de respostas"><h2>Cartão de respostas</h2><p class="muted">Cada item leva à questão correspondente. “Revisar” indica uma marcação pessoal.</p><div class="answer-grid">${s.questions.map((q,i)=>`<a id="sheet-${q.id}" href="#paper-q-${q.id}"></a>`).join('')}</div><div class="toolbar"><button class="btn" onclick="requestFinish()">Entregar e ver resultado</button></div></section>`;
  s.questions.forEach(q=>updatePaperAnswer(q.id));
}
function updatePaperAnswer(id){
  const s=session,q=s.questions.find(q=>q.id===id),number=s.questions.indexOf(q)+1;
  const chosen=s.answers[id],letter=chosen===undefined?'Em branco':'ABCDE'[q.order.indexOf(chosen)];
  const cell=$('sheet-'+id);cell.className=(chosen!==undefined?'answered ':'')+(s.flags[id]?'flagged':'');
  cell.innerHTML=`<b>${number}. ${letter}</b><small>${s.flags[id]?'Revisar':chosen===undefined?'Não respondida':'Respondida'}</small>`;
  cell.setAttribute('aria-label',`Questão ${number}: ${letter}${s.flags[id]?', marcada para revisão':''}`);
  $('paper-count').textContent=Object.keys(s.answers).length;$('paper-flags').textContent=Object.values(s.flags).filter(Boolean).length;
}
function paperAnswer(id,answer){if(!session||session.finished||!session.full)return;const q=session.questions.find(q=>q.id===id);if(!q||!q.order.includes(answer))return;session.answers[id]=answer;updatePaperAnswer(id);}
function paperClear(id){if(!session||session.finished)return;delete session.answers[id];document.querySelectorAll(`input[name="paper-answer-${id}"]`).forEach(input=>input.checked=false);updatePaperAnswer(id);}
function paperFlag(id){if(!session||session.finished)return;session.flags[id]=!session.flags[id];const button=$('flag-'+id);button.setAttribute('aria-pressed',String(session.flags[id]));button.textContent=session.flags[id]?'Marcada para revisão':'Marcar para revisão';updatePaperAnswer(id);}
