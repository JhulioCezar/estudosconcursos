# Propostas para evolução de Estudos Concursos

## Prioridades recomendadas

1. Retomar simulados em andamento: salvar ordem das alternativas, respostas e prazo original por aluno; recarregar não deve reiniciar o cronômetro.
2. Ampliar e revisar o banco: começar pelas normas municipais com menor cobertura. Cada questão precisa de assunto, origem autoral/oficial, referência, versão da norma e revisão editorial. Não copiar comentários ou cursos de plataformas comerciais.
3. Estatísticas por assunto: guardar resultados por questão e tempo de resposta para identificar dificuldades. Hoje o histórico guarda apenas o resultado agregado de cada tentativa.
4. Edital com tópicos individuais e revisão espaçada: separar conteúdo estudado de conteúdo dominado e sugerir a próxima revisão conforme erros e novas tentativas.
5. Cadernos personalizados: filtrar disciplina, assunto, dificuldade, erradas, não respondidas e favoritas; permitir anotações pessoais.
6. Plano adaptado à disponibilidade: horas e dias de estudo informados pelo aluno; tarefas combinando teoria, questões e revisão.
7. Painel administrativo: cadastrar e revisar questões, registrar atualizações de legislação, verificar cobertura e publicar somente conteúdo validado.

## Professor com inteligência artificial

É viável integrar um tutor pela API da OpenAI. Esta conversa não é incorporada ao site; o tutor terá instruções e contexto próprios. A ativação não foi incluída nesta atualização.

Proposta inicial: botão para pedir uma dica, explicar uma alternativa, rever um conceito ou receber uma pergunta de fixação. No modo prova, oferecer ajuda apenas depois da entrega.

Arquitetura sugerida: página autenticada -> função de servidor (por exemplo Supabase Edge Function) -> API OpenAI. A função valida o usuário, restringe o tamanho das perguntas, aplica limites de uso por aluno e usa uma chave secreta mantida no servidor. A integração requer conta e faturamento da API e um orçamento definido para uso.

O tutor deve receber o enunciado e materiais revisados pertinentes, informar quando uma fonte não sustenta a resposta e citar o material usado. Não deve inventar artigos, datas ou normas. A qualidade precisa ser avaliada com perguntas de referência e revisão humana, especialmente em legislação. Não enviar e-mails, senhas ou dados de outros alunos como contexto. Conversas salvas precisam de regras individuais de acesso e política clara de retenção.

## Referências pesquisadas

As referências abaixo mostram funcionalidades das plataformas consultadas. A ordem de prioridade acima é uma proposta para nosso produto, não uma comparação de qualidade dos fornecedores.

- Qconcursos: filtros e cadernos pessoais de questões. https://suporte.qconcursos.com/pt-BR/articles/11655438-como-criar-um-caderno-de-questoes-no-portal-do-qconcursos
- TEC Concursos: estatísticas dos cadernos e organização de teoria com questões. https://www.tecconcursos.com.br/blog/noticias/modo-curso-estatisticas-do-caderno/
- Estratégia: tarefas e ciclos combinando teoria, exercícios, revisão e simulados. https://www.estrategiaconcursos.com.br/blog/trilha-estrategica-como-seguir-saiba-como-usa-la-para-ser-aprovado-mais-rapido/
- Gran Questões: painel de desempenho, anotações, marcadores e programas de estudo. https://questoes.grancursosonline.com.br/assinatura
- OpenAI: documentação da API e orientação para manter chaves no servidor. https://developers.openai.com/api/reference/overview

## Atualização implementada

Temas Claro, Escuro e Sistema; dez paletas (oito sólidas e dois gradientes); remoção de símbolos decorativos; caderno A4 no simulado completo; cartão de respostas, marcação para revisão e limpeza de resposta; estilos de impressão; README orientado aos alunos.

As preferências visuais são locais ao navegador. Não houve alteração do esquema do Supabase, ampliação do banco de questões nem ativação de IA. O gabarito continua entregue ao navegador no banco original; a modalidade é de autoestudo e não é adequada para avaliação competitiva com proteção contra consulta ao código.
