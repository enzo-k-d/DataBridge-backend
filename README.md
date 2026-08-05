# DataFlow Backend

Serviço HTTP do DataFlow, construído com Node.js, TypeScript, Express e CORS.

## Executar

```bash
npm install
npm run dev
```

Para gerar e executar a versão compilada:

```bash
npm run build
npm start
```

Por padrão, o serviço fica disponível em `http://localhost:3231`. A rota
`GET /health` pode ser usada para verificar se ele está respondendo.

## Organização

```text
src/
├── server.ts       # Configuração do Express e inicialização do servidor
├── routes/         # URLs e métodos HTTP
├── controllers/    # Entrada, validação e resposta HTTP
├── services/       # Regras de negócio
├── repositories/   # Acesso e persistência de dados
├── interfaces/     # Contratos e tipos TypeScript
├── utils/          # Utilitários compartilhados
└── database/       # Fontes de dados locais, quando necessárias
```

O fluxo esperado é `route → controller → service → repository → database`.
