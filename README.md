# DataFlow Backend

API do DataFlow, construída com Node.js, TypeScript, Express e PostgreSQL, com autenticação por JWT.

## 1. Pré-requisitos e instalação

- Node.js compatível com `>=20`, conforme o `package.json`, e npm.
- Git para clonar o repositório.
- Um servidor PostgreSQL em execução, local ou remoto.
- Acesso pelo pgAdmin ou pelo terminal (`psql`) para criar o banco, se necessário.

Clone o repositório usando a URL fornecida pela equipe:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do backend, onde está o `package.json`. Execute todos os comandos npm deste guia nessa pasta:

```bash
npm install
```

## 2. Preparar o PostgreSQL

Se você já possui um banco e um usuário PostgreSQL, use as credenciais deles na próxima etapa. O banco pode estar vazio, sem tabelas.

Para um ambiente local novo, conecte-se ao servidor como administrador pelo pgAdmin ou `psql`. Execute os comandos abaixo separadamente, fora de uma transação, substituindo a senha de exemplo:

```sql
CREATE ROLE dataflow_app WITH LOGIN PASSWORD 'SUBSTITUA_POR_UMA_SENHA_FORTE';
```

```sql
CREATE DATABASE dataflow OWNER dataflow_app;
```

Esses comandos criam o usuário de conexão do PostgreSQL e um banco vazio. Execute-os apenas se esses recursos ainda não existirem. Referências: [CREATE ROLE](https://www.postgresql.org/docs/current/sql-createrole.html) e [CREATE DATABASE](https://www.postgresql.org/docs/current/sql-createdatabase.html).

O usuário PostgreSQL (`DB_USER`) é a credencial usada pelo backend para acessar o banco. O usuário da aplicação é uma conta que fará login no DataFlow; são cadastros diferentes.

## 3. Criar e configurar o `.env`

O `.env` é um arquivo de texto com as configurações da sua máquina, no formato `NOME=valor`, uma por linha. O `.env.example` é o modelo compartilhado no repositório; o `.env` é a sua cópia local, preenchida com os dados reais.

Copie o arquivo de exemplo para `.env`, na mesma pasta do `package.json`.

No Windows, usando PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Se já existir um `.env`, edite-o sem sobrescrever suas configurações. Preencha:

```dotenv
PORT=11001
FRONTEND_ORIGIN=http://localhost:11000

JWT_SECRET=SUBSTITUA_PELA_CHAVE_GERADA

DB_HOST=127.0.0.1
DB_PORT=11002
DB_NAME=dataflow
DB_USER=dataflow_app
DB_PASSWORD=SUBSTITUA_PELA_SENHA_DO_USUARIO_POSTGRESQL
```

| Variável | Como configurar |
| --- | --- |
| `PORT` | Porta HTTP do backend. Padrão do código: `11001`. |
| `FRONTEND_ORIGIN` | Origem do frontend permitida pelo CORS, incluindo protocolo e porta. Padrão: `http://localhost:11000`. |
| `JWT_SECRET` | Segredo usado para assinar e verificar os tokens. Gere o valor conforme a próxima etapa. |
| `DB_HOST` | Endereço do servidor PostgreSQL. Use `127.0.0.1` se estiver na mesma máquina. |
| `DB_PORT` | Porta em que seu PostgreSQL atende. O projeto usa `11002` como padrão; ajuste para a porta real da sua instalação. |
| `DB_NAME` | Nome exato de um banco já criado no PostgreSQL. Alterar este valor não cria nem renomeia o banco. |
| `DB_USER` | Usuário PostgreSQL com acesso ao banco informado. |
| `DB_PASSWORD` | Senha desse usuário PostgreSQL. Obrigatória na configuração atual do pool. |

O backend carrega o `.env` ao iniciar. Reinicie o processo depois de alterar essas configurações. O `.env` está no `.gitignore`: mantenha as credenciais reais nele e compartilhe apenas o `.env.example` com valores de exemplo.

### Como preencher, passo a passo

1. Abra o `.env` no editor. No Windows, confira se o arquivo se chama exatamente `.env`, sem a extensão `.txt`.
2. Mantenha `PORT=11001` se essa porta estiver disponível. Esse valor é a porta da API, não a do PostgreSQL.
3. Em `FRONTEND_ORIGIN`, coloque o endereço usado para abrir o frontend no navegador, por exemplo `http://localhost:11000`, sem caminho de página nem barra final.
4. Consulte os dados da conexão PostgreSQL. No pgAdmin, as propriedades do servidor, na aba de conexão, mostram o endereço, a porta e o usuário. O nome do banco aparece na lista de bancos. A senha deve ser a que você definiu ou recebeu para esse usuário.
5. Preencha `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` com esses dados. Para um banco remoto, use o endereço fornecido pelo responsável; `127.0.0.1` aponta para a própria máquina em que o backend roda.
6. Gere a chave JWT conforme a seção abaixo e substitua o texto de exemplo em `JWT_SECRET` pelo resultado.
7. Salve o arquivo, reinicie o backend se estiver aberto e execute o teste da etapa 4.

Por exemplo, se seu colega criou o banco `dataflow_dev` com o usuário `colega_app`, e o PostgreSQL dele atende em `localhost:5432`, a parte do banco será:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dataflow_dev
DB_USER=colega_app
DB_PASSWORD="SUBSTITUA_PELA_SENHA_REAL"
```

Ele deve substituir o texto da senha. Os nomes acima são apenas exemplos: precisam corresponder aos recursos criados no servidor dele. Não é necessário usar o mesmo nome de banco, usuário ou senha de outro desenvolvedor.

Não coloque vírgulas nem ponto e vírgula no fim das linhas. Use aspas em valores que contenham `#` ou espaços para preservar o conteúdo. `DB_HOST` recebe apenas o endereço, sem `http://` e sem a porta, pois a porta vai em `DB_PORT`.

### Gerar a chave JWT

Execute localmente:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado para `JWT_SECRET` no seu `.env`. O comando usa o gerador de bytes aleatórios do [Node.js](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback).

A chave deve ficar no backend. Gere-a uma vez para o ambiente e mantenha o mesmo valor entre reinicializações. Se trocar a chave, os tokens assinados com a anterior deixarão de passar na validação. Atualmente, os tokens expiram em `30d`.

## 4. Verificar a conexão com o banco

Depois de instalar as dependências e preencher o `.env`, execute na pasta do backend:

```bash
node -r dotenv/config -r ts-node/register/transpile-only -e "const { DataBase } = require('./src/database/pool'); DataBase.query('SELECT 1 AS connection_ok').then(result => console.log(result.rows[0])).catch(error => { console.error('Falha na conexão:', error.code || error.name); process.exitCode = 1; }).finally(() => DataBase.end());"
```

Resultado esperado:

```text
{ connection_ok: 1 }
```

Esse teste usa o pool real do projeto e confirma a conexão e a autenticação no PostgreSQL. Não precisa de tabelas e não cria nem altera dados. Ele não verifica se a estrutura de tabelas da aplicação está pronta.

## 5. Setup das tabelas e usuário inicial — em desenvolvimento

O arquivo `src/database/setupDataBase.ts` está reservado para o setup, mas ainda está vazio. Não existe um comando npm de setup disponível nesta versão, e iniciar o backend não cria as tabelas automaticamente.

O fluxo previsto para quem clonar o projeto será:

1. Criar ou escolher um banco PostgreSQL e configurar sua conexão no `.env`.
2. Executar o futuro setup para criar as tabelas necessárias dentro desse banco.
3. Criar, pelo setup, um usuário inicial da aplicação para o primeiro acesso.

O setup planejado deverá poder rodar novamente sem apagar dados nem duplicar o usuário inicial. O comando de execução e a configuração desse usuário serão documentados quando a implementação estiver pronta.

**O banco indicado em `DB_NAME` precisa existir antes da conexão.** A criação das tabelas dentro dele é a responsabilidade prevista para o setup; criar o próprio banco PostgreSQL é a etapa 2 deste guia.

### Como criar o comando `configDataBase` quando o setup estiver pronto

Um comando npm é um nome associado a uma instrução dentro de `scripts` no `package.json`. Ao executar `npm run configDataBase`, o npm procura a entrada `configDataBase` e executa seu conteúdo. Referência: [scripts do npm](https://docs.npmjs.com/cli/v10/using-npm/scripts/).

**O exemplo a seguir é uma orientação para a futura implementação. Ele ainda não foi adicionado ao `package.json`.**

Para declarar diretamente a ferramenta que executará o arquivo TypeScript, adicione `ts-node` como dependência de desenvolvimento quando for implementar esse comando:

```bash
npm install --save-dev ts-node
```

Depois, acrescente a entrada abaixo ao objeto `scripts` existente, preservando os outros comandos:

```json
"configDataBase": "ts-node -r dotenv/config src/database/setupDataBase.ts"
```

Essa é uma entrada de objeto, não um `package.json` completo. Separe-a das outras entradas com vírgula, conforme a sintaxe JSON.

- `configDataBase`: nome que você escolheu para o comando.
- `ts-node`: executa o arquivo TypeScript.
- `-r dotenv/config`: carrega o `.env` antes de executar o setup, inclusive antes de importar o pool.
- `src/database/setupDataBase.ts`: arquivo que conterá a rotina de criação das tabelas e do usuário inicial.

O uso de `ts-node` para executar arquivos e carregar módulos antes da execução está documentado em [opções do ts-node](https://typestrong.org/ts-node/docs/options/).

Com o script cadastrado e o setup implementado, você executará:

```bash
npm run configDataBase
```

O nome do comando é um atalho: quem cria as tabelas e imprime o resultado é o código do `setupDataBase.ts`. Para entregar o primeiro acesso solicitado, essa rotina deverá:

1. Conectar ao banco configurado no `.env`.
2. Criar as tabelas necessárias sem apagar as existentes.
3. Criar o usuário inicial da aplicação, caso ainda não exista, armazenando o hash da senha.
4. Após confirmar a gravação, mostrar o login e a senha inicial gerada nessa execução. Essa senha é da aplicação, não é `DB_PASSWORD`.
5. Se o usuário já existir, informar isso sem redefinir a senha nem tentar recuperar a senha original a partir do hash.
6. Fechar a conexão ao terminar e encerrar com erro se alguma etapa falhar.

Exemplo ilustrativo da saída de uma primeira execução bem-sucedida:

```text
Setup concluído.
Usuário inicial criado.
Login: <login configurado para o primeiro acesso>
Senha inicial: <senha gerada nesta execução>
```

Para esse acesso funcionar na API, o login também precisará consultar e validar o usuário salvo no banco, substituindo o usuário provisório atual.

### Ordem de execução após a implementação

1. Colocar o servidor PostgreSQL em execução pelo serviço ou ambiente em que foi instalado.
2. Criar o banco e seu usuário de conexão, se ainda não existirem.
3. Preencher o `.env` e testar a conexão.
4. Rodar `npm run configDataBase` para preparar as tabelas e o primeiro acesso.
5. Rodar `npm run dev` para iniciar a API.

O comando de setup prepara a estrutura dentro do banco; ele não inicia o servidor PostgreSQL. A execução detalhada e a saída real serão documentadas quando o setup estiver implementado.

### Estado atual da autenticação

O `LoginService.ts` ainda valida um usuário provisório definido no código, para desenvolvimento:

- E-mail: `root@gmail.com`
- Senha: `root`

Essa conta não é criada nem consultada no PostgreSQL. O fluxo de cadastro também ainda não persiste usuários no banco. Portanto, conseguir fazer login atualmente não comprova a conexão com o banco; use o teste da etapa 4.

## 6. Executar o backend

Para desenvolvimento:

```bash
npm run dev
```

Com os valores de exemplo, a API atende em `http://localhost:11001`, e o frontend deve usar essa URL. O frontend acessa a API por HTTP; a conexão PostgreSQL é feita pelo backend usando `DB_HOST` e `DB_PORT`.

Rotas atuais:

| Método | Rota | Uso |
| --- | --- | --- |
| `POST` | `/auth/login` | Recebe JSON com `email` e `password` e retorna o resultado do login. |
| `POST` | `/auth/cadastro` | Recebe JSON com `nome`, `email` e `password`; persistência ainda em desenvolvimento. |
| `GET` | `/auth/validate` | Valida o token enviado no cabeçalho `Authorization: Bearer <token>`. |

Não existe uma rota `/health` implementada nesta versão.

Para verificar os tipos e gerar a versão compilada:

```bash
npm run typecheck
npm run build
```

Após uma compilação bem-sucedida:

```bash
npm start
```

O projeto está em desenvolvimento. Há erros de TypeScript conhecidos em `BasicDataBase.ts` e `CadastroService.ts` que precisam ser corrigidos para concluir essas verificações. O comando de desenvolvimento usa `--transpile-only`, portanto iniciar o servidor não garante que a checagem de tipos passou.

## Problemas de configuração

| Sintoma | O que conferir |
| --- | --- |
| `DB_PASSWORD não configurada` | Se o `.env` está na pasta do backend e contém `DB_PASSWORD`. |
| `JWT_SECRET não configurada` | Se a chave foi gerada e preenchida no `.env`. |
| Conexão recusada (`ECONNREFUSED`) | Se o PostgreSQL está em execução no endereço e porta configurados. |
| Conexão expira | Endereço, porta, acesso de rede e regras de firewall do servidor PostgreSQL. |
| Falha de autenticação PostgreSQL | Se `DB_USER` e `DB_PASSWORD` correspondem ao usuário do servidor. |
| Banco não existe | Se `DB_NAME` corresponde exatamente a um banco já criado. |
| Tabela não existe | Se a estrutura foi criada; o setup automático ainda não está implementado. |
| Erro de CORS no navegador | Se `FRONTEND_ORIGIN` corresponde à origem usada para abrir o frontend. |

## Organização

```text
src/
├── server.ts          # Configuração do Express e inicialização do servidor
├── routes/            # URLs e métodos HTTP
├── controllers/       # Entrada, validação e resposta HTTP
├── services/          # Regras de negócio
├── repositories/      # Acesso e persistência de dados
├── interfaces/        # Contratos e tipos TypeScript
├── middlewares/auth/  # Middleware de autenticação e funções JWT em Jwt.ts
├── utils/             # Utilitários compartilhados
└── database/          # Pool PostgreSQL e futuro setup das tabelas
```

O fluxo esperado é `route → controller → service → repository → database`.
