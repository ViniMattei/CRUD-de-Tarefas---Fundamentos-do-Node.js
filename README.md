# CRUD de Tarefas — Fundamentos do Node.js

API em Node.js puro (sem framework) para gerenciamento de tarefas, com persistência em arquivo JSON.

## Como rodar

```bash
npm install
npm run dev   # inicia com --watch em http://localhost:3333
```

## Estrutura de uma Tarefa

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "completed_at": null,
  "created_at": "date",
  "updated_at": "date"
}
```

## Rotas

- `POST /tasks` — cria uma tarefa (`title` e `description` obrigatórios no body).
- `GET /tasks` — lista tarefas, com busca opcional via query string `?title=` e/ou `?description=`.
- `PUT /tasks/:id` — atualiza `title` e/ou `description` de uma tarefa existente.
- `DELETE /tasks/:id` — remove uma tarefa existente.
- `PATCH /tasks/:id/complete` — alterna `completed_at` entre concluído/pendente.

Todas as rotas com `:id` retornam `404` caso a tarefa não exista. `POST` e `PUT` retornam `400` se os campos obrigatórios não forem enviados.

## Importação via CSV

Com o servidor rodando, execute:

```bash
npm run import-csv
```

O script [import-csv.js](import-csv.js) lê o arquivo [tasks.csv](tasks.csv) (formato `title,description`) usando `csv-parse` e envia uma requisição `POST /tasks` para cada linha.
