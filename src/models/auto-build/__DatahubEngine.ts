import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'engine_key',
  'name',
  'db_name',
  'extras_info',
  'invalid',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'engine_key',
  'name',
  'db_name',
  'extras_info',
  'invalid',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'name',
  'db_name',
  'extras_info',
  'invalid',
  'create_time',
]

const dbOptions = {
  table: 'datahub_engine',
  primaryKey: 'engine_key',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __DatahubEngine extends FeedBase {
  /**
   * @description [varchar(63)] 引擎 ID，具备唯一性
   */
  public engineKey!: string
  /**
   * @description [varchar(127)] 名称
   */
  public name!: string
  /**
   * @description [varchar(127)] 名称
   */
  public dbName!: string
  /**
   * @description [text] 附加信息，空 | JSON 字符串
   */
  public extrasInfo!: string
  /**
   * @description [tinyint] 是否已失效
   */
  public invalid!: number
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
    this.name = ''
    this.dbName = ''
    this.extrasInfo = ''
    this.invalid = 0
  }

  public fc_propertyMapper() {
    return {
      engineKey: 'engine_key',
      name: 'name',
      dbName: 'db_name',
      extrasInfo: 'extras_info',
      invalid: 'invalid',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
