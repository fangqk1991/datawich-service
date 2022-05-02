import { makeUUID } from '@fangcha/tools'
import { AliyunOSS } from '@fangcha/ali-oss'
import { DataPluginProtocol } from './DataPluginProtocol'
import { FCDatabase } from 'fc-sql'
import { _DataModel } from '../models/extensions/_DataModel'
import { _ModelField } from '../models/extensions/_ModelField'
import { _FieldIndex } from '../models/extensions/_FieldIndex'
import { _FieldLink } from '../models/extensions/_FieldLink'
import { _FieldShadowLink } from '../models/extensions/_FieldShadowLink'
import { _ModelNotifyTemplate } from '../models/extensions/_ModelNotifyTemplate'
import { _AppClient } from '../models/extensions/_AppClient'
import { _ModelAuthorization } from '../models/extensions/_ModelAuthorization'
import { _FieldEnumMetadata } from '../models/extensions/_FieldEnumMetadata'
import { _FieldGroup } from '../models/extensions/_FieldGroup'
import { _ModelFieldAction } from '../models/extensions/_ModelFieldAction'
import { _CommonProfile } from '../models/extensions/_CommonProfile'
import { _ModelDisplayColumn } from '../models/extensions/_ModelDisplayColumn'
import { _ModelMilestone } from '../models/extensions/_ModelMilestone'
import { ModelDataInfo } from './ModelDataInfo'
import { GeneralGroupApp } from '@fangcha/general-group'
import { _DatahubEngine } from '../models/datahub-sync/_DatahubEngine'
import { _DatahubTable } from '../models/datahub-sync/_DatahubTable'
import { _DatahubColumn } from '../models/datahub-sync/_DatahubColumn'
import { _DatahubTableLink } from '../models/datahub-sync/_DatahubTableLink'
import { _DatahubColumnLink } from '../models/datahub-sync/_DatahubColumnLink'
import { _DatahubSyncProgress } from '../models/datahub-sync/_DatahubSyncProgress'
import { _ModelGroup } from '../models/permission/_ModelGroup'
import { CommonGroup } from '../models/permission/CommonGroup'
import { MemberPower } from '../models/permission/MemberPower'

class __DatawichService {
  public version = '0.0.1'

  public database!: FCDatabase
  public groupApp!: GeneralGroupApp

  public ossForSignature!: AliyunOSS
  public downloadRootDir = '/tmp'
  public plugins: DataPluginProtocol[] = []

  public generateRandomTmpPath() {
    return `${this.downloadRootDir}/${makeUUID()}`
  }

  public setDatabase(database: FCDatabase) {
    this.database = database
    _DataModel.setDatabase(database)
    _ModelField.setDatabase(database)
    _FieldIndex.setDatabase(database)
    _FieldLink.setDatabase(database)
    _FieldShadowLink.setDatabase(database)
    _ModelNotifyTemplate.setDatabase(database)
    _AppClient.setDatabase(database)
    _ModelAuthorization.setDatabase(database)
    _FieldEnumMetadata.setDatabase(database)
    _FieldGroup.setDatabase(database)
    _ModelFieldAction.setDatabase(database)
    _CommonProfile.setDatabase(database)
    _ModelDisplayColumn.setDatabase(database)
    _ModelMilestone.setDatabase(database)
    ModelDataInfo.database = database
    this.initDatahubSync(database)
    this.initPermissionSettings(database)
    this.groupApp = new GeneralGroupApp(database)
    return this
  }

  public initDatahubSync(database: FCDatabase) {
    _DatahubEngine.setDatabase(database)
    _DatahubTable.setDatabase(database)
    _DatahubColumn.setDatabase(database)
    _DatahubTableLink.setDatabase(database)
    _DatahubColumnLink.setDatabase(database)
    _DatahubSyncProgress.setDatabase(database)
    return this
  }

  public initPermissionSettings(database: FCDatabase) {
    _ModelGroup.setDatabase(database)
    CommonGroup.setDatabase(database)
    MemberPower.setDatabase(database)
    return this
  }
}

export const _DatawichService = new __DatawichService()
