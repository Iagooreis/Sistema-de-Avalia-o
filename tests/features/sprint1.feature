# language: pt
Funcionalidade: Cadastro de Usuário e Restrição de Domínio (Back-end)
  Como estudante da instituição
  Quero que o sistema valide meu cadastro apenas com o e-mail universitário
  Para assegurar que as avaliações fiquem restritas à comunidade acadêmica

  Cenário: Cadastro bem-sucedido via API utilizando e-mail acadêmico válido
    Dado que a API do sistema está ativa e pronta para receber requisições
    Quando uma requisição POST é disparada para o endpoint "/api/auth/register" com os dados:
      | campo    | valor                       |
      | nome     | "Wellington Miguel"        |
      | email    | "wellington.miguel@ufba.br"|
      | password | "SenhaSegura123"            |
    Então o status code da resposta HTTP deve ser 201
    E a conta deve ser criada no banco de dados com a flag "is_active" como falso
    E um token de ativação deve ser disparado para o endereço institucional informado

  Cenário: Rejeição de cadastro ao tentar utilizar provedor de e-mail comercial comum
    Dado que a API do sistema está ativa e pronta para receber requisições
    Quando uma requisição POST é enviada para o endpoint "/api/auth/register" com os dados:
      | campo    | valor                         |
      | nome     | "Wellington Miguel"          |
      | email    | "wellington.comercial@gmail.com" |
      | password | "SenhaSegura123"              |
    Então o status code da resposta HTTP deve ser 400
    E o corpo da resposta deve conter a mensagem de erro "Acesso restrito: utilize seu e-mail vinculado à universidade."

Funcionalidade: Interfaces Visuais de Cadastro, Login e Dashboard (Front-end Web)
  Como estudante acessando o aplicativo pelo navegador web
  Quero interagir com telas limpas, funcionais e responsivas
  Para realizar minhas ações de autenticação de forma intuitiva

  Cenário: Validação visual em tempo real de e-mail inválido na interface de Cadastro
    Dado que o estudante está visualizando a página de Cadastro no navegador web
    Quando ele digita "aluno@gmail.com" no input de campo de e-mail
    E clica fora do campo ou tenta avançar
    Então a interface do Front-end deve interceptar a ação
    E exibir uma borda vermelha de alerta no campo de e-mail
    E renderizar a mensagem de aviso na tela: "Domínio não permitido. Use seu e-mail institucional."
    E manter o botão "Registrar" desabilitado

  Cenário: Login bem-sucedido e redirecionamento automático para a Tela Inicial (Dashboard)
    Dado que o estudante está com a interface de Login aberta em seu navegador web
    E preenche o e-mail institucional correto e a senha cadastrada
    Quando ele clica no botão "Entrar"
    Então o Front-end deve despachar os dados, armazenar o token JWT recebido no armazenamento local seguro do navegador
    E redirecionar automaticamente o fluxo do usuário para a rota da Tela Inicial (Dashboard)
    E exibir a mensagem de boas-vindas "Olá, Wellington Miguel!"

Funcionalidade: Modelagem Relacional e Estrutura Inicial do Banco de Dados
  Como desenvolvedor do projeto
  Quero garantir que a infraestrutura separe as entidades com precisão relacional
  Para isolar o histórico do professor de forma granular em cada disciplina

  Cenário: Criação e checagem de integridade das entidades e relacionamentos no banco
    Dado que o banco de dados relacional foi inicializado através das migrações do sistema
    Quando uma consulta estrutural de esquema é executada
    Então o banco deve conter las tabelas "professores", "disciplinas" e a tabela intermediária "professor_disciplina"
    E a tabela "avaliacoes" deve possuir uma restrição de integridade (FK) apontando exclusivamente para a chave primária da tabela "professor_disciplina"
