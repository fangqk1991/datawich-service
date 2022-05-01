import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { GeneralDataDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const generalDataGenerator = new ModelGenerator({
  dbConfig: GeneralDataDBOptions,
  tmplFile: modelTmpl,
  extTmplFile: extendTmpl,
})

const generalDataSchemas: DBModelSchema[] = [
  {
    tableName: 'data_model',
    outputFile: `${__dirname}/../src/models/auto-build/__DataModel.ts`,
    extFile: `${__dirname}/../src/models/extensions/_DataModel.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['author', 'create_time'],
  },
  {
    tableName: 'model_field',
    outputFile: `${__dirname}/../src/models/auto-build/__ModelField.ts`,
    extFile: `${__dirname}/../src/models/extensions/_ModelField.ts`,
    primaryKey: ['model_key', 'field_key'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'field_key', 'create_time'],
  },
  {
    tableName: 'field_enum_metadata',
    outputFile: `${__dirname}/../src/models/auto-build/__FieldEnumMetadata.ts`,
    extFile: `${__dirname}/../src/models/extensions/_FieldEnumMetadata.ts`,
    primaryKey: ['model_key', 'field_key', 'value'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'field_key', 'value', 'create_time'],
  },
  {
    tableName: 'model_notify_template',
    outputFile: `${__dirname}/../src/models/auto-build/__ModelNotifyTemplate.ts`,
    extFile: `${__dirname}/../src/models/extensions/_ModelNotifyTemplate.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'create_time'],
  },
  {
    tableName: 'field_index',
    outputFile: `${__dirname}/../src/models/auto-build/__FieldIndex.ts`,
    extFile: `${__dirname}/../src/models/extensions/_FieldIndex.ts`,
    primaryKey: ['model_key', 'field_key'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'field_key', 'create_time'],
  },
  {
    tableName: 'field_link',
    outputFile: `${__dirname}/../src/models/auto-build/__FieldLink.ts`,
    extFile: `${__dirname}/../src/models/extensions/_FieldLink.ts`,
    primaryKey: 'link_id',
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'field_key', 'ref_model', 'ref_field'],
  },
  {
    tableName: 'field_shadow_link',
    outputFile: `${__dirname}/../src/models/auto-build/__FieldShadowLink.ts`,
    extFile: `${__dirname}/../src/models/extensions/_FieldShadowLink.ts`,
    primaryKey: ['shadow_model', 'shadow_field'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableWhiteList: [],
  },
  {
    tableName: 'app_client',
    outputFile: `${__dirname}/../src/models/auto-build/__AppClient.ts`,
    extFile: `${__dirname}/../src/models/extensions/_AppClient.ts`,
    primaryKey: 'appid',
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['appid', 'create_time'],
  },
  {
    tableName: 'model_authorization',
    outputFile: `${__dirname}/../src/models/auto-build/__ModelAuthorization.ts`,
    extFile: `${__dirname}/../src/models/extensions/_ModelAuthorization.ts`,
    primaryKey: ['model_key', 'appid'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'appid', 'create_time'],
  },
  {
    tableName: 'datahub_engine',
    outputFile: `${__dirname}/../src/models/auto-build/__DatahubEngine.ts`,
    extFile: `${__dirname}/../src/models/datahub-sync/_DatahubEngine.ts`,
    primaryKey: 'engine_key',
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    tableName: 'datahub_table',
    outputFile: `${__dirname}/../src/models/auto-build/__DatahubTable.ts`,
    extFile: `${__dirname}/../src/models/datahub-sync/_DatahubTable.ts`,
    primaryKey: ['engine_key', 'table_key'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['engine_key', 'table_key'],
  },
  {
    tableName: 'datahub_column',
    outputFile: `${__dirname}/../src/models/auto-build/__DatahubColumn.ts`,
    extFile: `${__dirname}/../src/models/datahub-sync/_DatahubColumn.ts`,
    primaryKey: ['engine_key', 'table_key', 'column_key'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['engine_key', 'table_key', 'column_key'],
  },
  {
    tableName: 'datahub_sync_progress',
    outputFile: `${__dirname}/../src/models/auto-build/__DatahubSyncProgress.ts`,
    extFile: `${__dirname}/../src/models/datahub-sync/_DatahubSyncProgress.ts`,
    primaryKey: ['engine_key', 'table_key', 'sample_date'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['engine_key', 'table_key', 'sample_date'],
  },
  {
    tableName: 'datahub_table_link',
    outputFile: `${__dirname}/../src/models/auto-build/__DatahubTableLink.ts`,
    extFile: `${__dirname}/../src/models/datahub-sync/_DatahubTableLink.ts`,
    primaryKey: 'child_model',
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableWhiteList: ['sample_date'],
  },
  {
    tableName: 'datahub_column_link',
    outputFile: `${__dirname}/../src/models/auto-build/__DatahubColumnLink.ts`,
    extFile: `${__dirname}/../src/models/datahub-sync/_DatahubColumnLink.ts`,
    primaryKey: ['child_model', 'child_field'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableWhiteList: [],
  },
  {
    tableName: 'model_group',
    outputFile: `${__dirname}/../src/models/auto-build/__ModelGroup.ts`,
    extFile: `${__dirname}/../src/models/permission/_ModelGroup.ts`,
    primaryKey: ['model_key', 'group_id'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'group_id', 'create_time'],
  },
  {
    tableName: 'field_group',
    outputFile: `${__dirname}/../src/models/auto-build/__FieldGroup.ts`,
    extFile: `${__dirname}/../src/models/extensions/_FieldGroup.ts`,
    primaryKey: ['model_key', 'group_key'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'group_key', 'create_time'],
  },
  {
    tableName: 'model_field_action',
    outputFile: `${__dirname}/../src/models/auto-build/__ModelFieldAction.ts`,
    extFile: `${__dirname}/../src/models/extensions/_ModelFieldAction.ts`,
    primaryKey: 'action_id',
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableWhiteList: ['event', 'title', 'content'],
  },
  {
    tableName: 'model_display_column',
    outputFile: `${__dirname}/../src/models/auto-build/__ModelDisplayColumn.ts`,
    extFile: `${__dirname}/../src/models/extensions/_ModelDisplayColumn.ts`,
    primaryKey: 'column_key',
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['model_key', 'create_time'],
  },
  {
    tableName: 'common_profile',
    outputFile: `${__dirname}/../src/models/auto-build/__CommonProfile.ts`,
    extFile: `${__dirname}/../src/models/extensions/_CommonProfile.ts`,
    primaryKey: ['user', 'event', 'target'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableWhiteList: ['description'],
  },
  {
    tableName: 'cs_wide_company',
    outputFile: `${__dirname}/../src/models/auto-build/__WideCompany.ts`,
    extFile: `${__dirname}/../src/models/company/_WideCompany.ts`,
    primaryKey: 'company_id',
  },
  {
    tableName: 'model_milestone',
    outputFile: `${__dirname}/../src/models/auto-build/__ModelMilestone.ts`,
    extFile: `${__dirname}/../src/models/extensions/_ModelMilestone.ts`,
    primaryKey: ['model_key', 'tag_name'],
    reloadOnAdded: true,
    modifiableWhiteList: [],
  },
]

const main = async () => {
  for (const schema of generalDataSchemas) {
    const data = await generalDataGenerator.generateData(schema)
    generalDataGenerator.buildModel(schema, data)
  }
  process.exit()
}
main()
