import __DatahubColumn from '../auto-build/__DatahubColumn'
import { _DatahubTable } from './_DatahubTable'

export class _DatahubColumn extends __DatahubColumn {
  public constructor() {
    super()
  }

  public getColumnDatabaseSpec() {
    const match = this.columnType.match(/^varchar\((\d+)\)$/)
    const columnType = match && Number(match[1]) >= 1024 ? 'TEXT' : this.columnType
    // return `${columnType} ${this.nullable ? 'NULL' : 'NOT NULL'} ${this.extrasInfo}`
    // return `${columnType} ${this.nullable ? 'NULL' : 'NOT NULL'}`
    return `${columnType} NULL`
  }

  public async updateName(name: string) {
    this.fc_edit()
    this.name = name
    await this.updateToDB()
  }

  public sqlTableName() {
    const table = new _DatahubTable()
    table.engineKey = this.engineKey
    table.tableKey = this.tableKey
    return table.sqlTableName()
  }
}
