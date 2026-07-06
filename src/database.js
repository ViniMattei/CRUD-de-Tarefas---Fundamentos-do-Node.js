import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const databasePath = path.resolve(__dirname, '..', 'db.json')

export class Database {
  #database = {}

  constructor() {
    if (fs.existsSync(databasePath)) {
      this.#database = JSON.parse(fs.readFileSync(databasePath, 'utf8'))
    }
  }

  #persist() {
    fs.writeFileSync(databasePath, JSON.stringify(this.#database, null, 2))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key]?.toLowerCase().includes(String(value).toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex === -1) {
      return null
    }

    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
    }

    this.#persist()

    return this.#database[table][rowIndex]
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex === -1) {
      return null
    }

    const [deleted] = this.#database[table].splice(rowIndex, 1)

    this.#persist()

    return deleted
  }

  findById(table, id) {
    const data = this.#database[table] ?? []
    return data.find((row) => row.id === id) ?? null
  }
}
