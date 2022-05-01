import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'child_model',
  'engine_key',
  'table_key',
  'sample_date',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'child_model',
  'engine_key',
  'table_key',
  'sample_date',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'sample_date',
]

const dbOptions = {
  table: 'datahub_table_link',
  primaryKey: 'child_model',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __DatahubTableLink extends FeedBase {
  /**
   * @description [varchar(63)] 模型键值，SQL 外键 -> data_model.model_key
   */
  public childModel!: string
  /**
   * @description [varchar(63)] 引擎 ID，具备唯一性
   */
  public engineKey!: string
  /**
   * @description [varchar(63)] 表名
   */
  public tableKey!: string
  /**
   * @description [date] 采样日期
   */
  public sampleDate!: string
  /**
   * @description [timestamp] 创建时间: ISO8601 字符串
   */
  public createTime!: string
  /**
   * @description [timestamp] 更新时间: ISO8601 字符串
   */
  public updateTime!: string

  protected static _staticDBOptions: DBProtocolV2
  protected static _staticDBObserver?: DBObserver

  public static setDatabase(database: FCDatabase, dbObserver?: DBObserver) {
    this.addStaticOptions({ database: database }, dbObserver)
  }

  public static setStaticProtocol(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static addStaticOptions(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, this._staticDBOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static _onStaticDBOptionsUpdate(_protocol: DBProtocolV2) {}

  public constructor() {
    super()
    this.setDBProtocolV2(this.constructor['_staticDBOptions'])
    this._reloadOnAdded = true
    this._reloadOnUpdated = true
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.sampleDate = '1970-01-01'
  }

  public fc_propertyMapper() {
    return {
      childModel: 'child_model',
      engineKey: 'engine_key',
      tableKey: 'table_key',
      sampleDate: 'sample_date',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
