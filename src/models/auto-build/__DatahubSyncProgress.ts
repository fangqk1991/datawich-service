import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'engine_key',
  'table_key',
  'sample_date',
  'current',
  'total',
  'available',
  'badge',
  'error_msg',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'engine_key',
  'table_key',
  'sample_date',
  'current',
  'total',
  'available',
  'badge',
  'error_msg',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'current',
  'total',
  'available',
  'badge',
  'error_msg',
  'create_time',
]

const dbOptions = {
  table: 'datahub_sync_progress',
  primaryKey: ['engine_key', 'table_key', 'sample_date'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __DatahubSyncProgress extends FeedBase {
  /**
   * @description [varchar(63)] 引擎 ID，具备唯一性
   */
  public engineKey!: string
  /**
   * @description [varchar(63)] 表名
   */
  public tableKey!: string
  /**
   * @description [date] 日期
   */
  public sampleDate!: string
  /**
   * @description [bigint] 当前已完成
   */
  public current!: number
  /**
   * @description [bigint] 总数
   */
  public total!: number
  /**
   * @description [tinyint] 是否可用
   */
  public available!: number
  /**
   * @description [tinyint] 发生更新，需要发布
   */
  public badge!: number
  /**
   * @description [text] 错误信息
   */
  public errorMsg!: string
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
    this.current = 0
    this.total = 0
    this.available = 0
    this.badge = 0
    this.errorMsg = ''
  }

  public fc_propertyMapper() {
    return {
      engineKey: 'engine_key',
      tableKey: 'table_key',
      sampleDate: 'sample_date',
      current: 'current',
      total: 'total',
      available: 'available',
      badge: 'badge',
      errorMsg: 'error_msg',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
