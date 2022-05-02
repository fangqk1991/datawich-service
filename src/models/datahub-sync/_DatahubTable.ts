import __DatahubTable from '../auto-build/__DatahubTable'
import { _DatahubColumn } from './_DatahubColumn'
import { DBTableHandler } from 'fc-sql'
import { _DatahubSyncProgress } from './_DatahubSyncProgress'

export class _DatahubTable extends __DatahubTable {
  public constructor() {
    super()
  }

  public static async findTable<T extends _DatahubTable>(this: { new (): T }, engineKey: string, tableKey: string) {
    return (await (this as any).findOne({
      engine_key: engineKey,
      table_key: tableKey,
    })) as T
  }

  public async getDatahubColumns() {
    const searcher = new _DatahubColumn().fc_searcher()
    searcher.processor().addConditionKV('engine_key', this.engineKey)
    searcher.processor().addConditionKV('table_key', this.tableKey)
    searcher.processor().addConditionKV('invalid', 0)
    return searcher.queryAllFeeds()
  }

  public sqlTableName() {
    return `dh_${this.engineKey}_${this.tableKey}`
  }

  private async checkDBTableExists() {
    const database = this.dbSpec().database
    const searcher = database.searcher()
    searcher.setTable('information_schema.tables')
    searcher.addConditionKV('table_schema', database.dbName())
    searcher.addConditionKV('table_name', this.sqlTableName())
    return (await searcher.queryCount()) > 0
  }

  public async syncStructureToDatabase() {
    const database = this.dbSpec().database
    const sqlTableName = this.sqlTableName()
    const tableHandler = database.tableHandler(sqlTableName)
    if (!(await this.checkDBTableExists())) {
      await tableHandler.createInDatabase()
      await tableHandler.addColumn('__date', `DATE NOT NULL DEFAULT '1970-01-01'`)
      await database.update(`ALTER TABLE ${sqlTableName} CHANGE rid __rid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT`)
      await database.update(`ALTER TABLE ${sqlTableName} ADD INDEX(__date)`)
    }
    const sqlColumns = await new DBTableHandler(database, sqlTableName).getColumns()
    const columnMap = sqlColumns.reduce((result, cur) => {
      result[cur.Field] = true
      return result
    }, {})
    const datahubColumns = await this.getDatahubColumns()
    for (const column of datahubColumns) {
      if (columnMap[column.columnKey]) {
        continue
      }
      await tableHandler.addColumn(column.columnKey, column.getColumnDatabaseSpec())
      if (column.columnKey === 'vid') {
        await database.update(`ALTER TABLE ${sqlTableName} ADD INDEX(vid)`)
        await database.update(`ALTER TABLE ${sqlTableName} ADD INDEX(__date, vid)`)
      }
    }
  }

  public async getLatestProgress() {
    const searcher = new _DatahubSyncProgress().fc_searcher()
    searcher.processor().addConditionKV('engine_key', this.engineKey)
    searcher.processor().addConditionKV('table_key', this.tableKey)
    searcher.processor().addConditionKV('available', 1)
    searcher.processor().addOrderRule('sample_date', 'DESC')
    return searcher.queryOne()
  }
}
