import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'shadow_model',
  'shadow_field',
  'matrix_model',
  'matrix_field',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'shadow_model',
  'shadow_field',
  'matrix_model',
  'matrix_field',
]
const _modifiableCols: string[] = [
  // prettier-ignore
]

const dbOptions = {
  table: 'field_shadow_link',
  primaryKey: ['shadow_model', 'shadow_field'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __FieldShadowLink extends FeedBase {
  /**
   * @description [varchar(63)] 影子模型键值，SQL 外键 -> model_field.model_key
   */
  public shadowModel!: string
  /**
   * @description [varchar(63)] 影子字段键值，SQL 外键 -> model_field.field_key
   */
  public shadowField!: string
  /**
   * @description [varchar(63)] 主模型键值，SQL 外键 -> model_field.model_key
   */
  public matrixModel!: string
  /**
   * @description [varchar(63)] 主字段键值，SQL 外键 -> model_field.field_key
   */
  public matrixField!: string
  /**
   * @description [timestamp] 创建时间
   */
  public createTime!: string
  /**
   * @description [timestamp] 更新时间
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
  }

  public fc_propertyMapper() {
    return {
      shadowModel: 'shadow_model',
      shadowField: 'shadow_field',
      matrixModel: 'matrix_model',
      matrixField: 'matrix_field',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
