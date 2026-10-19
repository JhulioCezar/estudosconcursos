# Trilha Legislativa CMRB

Plataforma de estudos com HTML/JavaScript, Supabase Auth e progresso individual no Postgres. Hospedagem estática preparada para Cloudflare Pages.

## Configurar Supabase

1. Criar um projeto Supabase e executar `supabase/schema.sql` uma única vez no SQL Editor.
2. Preencher `config.js` com a URL e chave pública publishable/anon. Nunca usar secret/service_role no navegador ou no GitHub.
3. Em Authentication > URL Configuration, configurar Site URL e Redirect URLs com o endereço final, por exemplo https://estudos.jhuliosolucoes.com.br. Adicionar também o endereço de desenvolvimento enquanto necessário.
4. Manter confirmação de e-mail habilitada, definir senha mínima de 12 caracteres e configurar SMTP para envio aos alunos antes de abrir cadastros públicos.
5. Testar cadastro, confirmação por e-mail, login, recuperação e isolamento entre duas contas.

## Publicar

Subir esta pasta no GitHub. Em Cloudflare Pages, conectar o repositório, usar sem framework, sem comando de build e diretório de publicação `/`. Conectar o domínio desejado no painel Pages. O domínio raiz deve ser usado apenas se não substituir outro site necessário.

Para desenvolvimento, servir os arquivos por HTTP (não abrir via file://), por exemplo `npx serve .`.

## Dados e limites desta primeira versão

O progresso é salvo na tabela student_progress por usuário. RLS restringe leitura e escrita ao proprietário. A tabela não armazena senhas; Supabase Auth faz a autenticação. O indicador informa falhas de sincronização e há opção de tentar novamente. Simulados em andamento ainda não são retomados após recarregar. O último salvamento prevalece se a mesma conta estudar simultaneamente em dois dispositivos. Não importar automaticamente o antigo progresso anônimo para evitar vinculá-lo à conta errada. O usuário pode importar explicitamente um backup pela página Meu plano.

O banco de questões, cronograma e referências foram preservados do HTML original e ainda precisam de revisão editorial e conferência com o edital vigente. original.html preserva a referência recebida e não faz parte da experiência autenticada.

## Validação pendente de ambiente real

É necessário aplicar o SQL no Supabase e configurar config.js antes de testar autenticação e persistência reais. Não há publicação ou criação automática de infraestrutura por estes arquivos.
