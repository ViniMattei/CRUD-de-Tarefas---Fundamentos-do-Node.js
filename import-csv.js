import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('./tasks.csv', import.meta.url)

const parser = fs.createReadStream(csvPath).pipe(
  parse({
    fromLine: 2, // pula o cabeçalho (title,description)
  }),
)

async function run() {
  for await (const line of parser) {
    const [title, description] = line

    const response = await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })

    if (response.ok) {
      console.log(`Task criada: ${title}`)
    } else {
      console.error(`Falha ao criar task "${title}":`, await response.text())
    }
  }
}

run()
