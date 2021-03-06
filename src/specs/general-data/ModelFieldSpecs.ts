import { SpecFactory } from '@fangcha/router'
import assert from '@fangcha/assert'
import { prepareDataModel, prepareModelField } from './SpecUtils'
import { GeneralDataApis } from '../../common/web-api'
import {
  DisplayScope,
  FieldDisplayMode,
  FieldLinkModel,
  FieldType,
  GeneralPermission,
  ModelFieldModel, ModelNotifyTemplateModel
} from '../../common/models'
import { SessionChecker } from '../../services/SessionChecker'
import { _ModelField } from '../../models/extensions/_ModelField'
import { _ModelFieldAction } from '../../models/extensions/_ModelFieldAction'

const factory = new SpecFactory('模型字段')

factory.prepare(GeneralDataApis.DataModelFieldListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const feeds = await dataModel.getFields()
  ctx.body = feeds.map((feed) => feed.modelForClient())
})

factory.prepare(GeneralDataApis.DataModelVisibleFieldListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const feeds = await dataModel.getVisibleFields()
  const allLinks = await dataModel.getFieldLinks()
  const uniqueMap = await dataModel.getUniqueColumnMap()
  const fieldGroupMap = await dataModel.getFieldGroupMap()
  const result: ModelFieldModel[] = []
  for (const feed of feeds) {
    const data = feed.modelForClient()
    const links = allLinks.filter((link) => link.fieldKey === feed.fieldKey)
    const linkModels: FieldLinkModel[] = []
    for (const link of links) {
      linkModels.push(await link.modelWithRefFields())
    }
    data.refFieldLinks = linkModels
    data.isUnique = uniqueMap[feed.fieldKey] ? 1 : 0
    if (fieldGroupMap[feed.groupKey]) {
      data.groupName = fieldGroupMap[feed.groupKey].name
      data.fieldDisplayMode = fieldGroupMap[feed.groupKey].displayMode as FieldDisplayMode
      data.fieldDisplayTmpl = fieldGroupMap[feed.groupKey].displayTmpl
    }
    result.push(data)
  }
  ctx.body = result
})

factory.prepare(GeneralDataApis.DataModelListCustomFieldsGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  ctx.body = await dataModel.makeCustomFields(DisplayScope.LIST)
})

factory.prepare(GeneralDataApis.DataModelDetailCustomFieldsGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  ctx.body = await dataModel.makeCustomFields(DisplayScope.DETAIL)
})

factory.prepare(GeneralDataApis.DataModelFieldLinkListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const feeds = await dataModel.getFieldLinks()
  const result: FieldLinkModel[] = []
  for (const feed of feeds) {
    result.push(await feed.modelWithRefFields())
  }
  ctx.body = result
})

factory.prepare(GeneralDataApis.DataModelFieldTop, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  await dataModel.topField(ctx.params.fieldKey)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelFieldCreate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const { fieldType } = ctx.request.body
  assert.ok(fieldType !== FieldType.Enum, `「数值枚举」类型字段已被废弃，请使用「文本枚举」替代`)
  assert.ok(fieldType !== FieldType.Tags, `「标签」类型字段已被废弃，请使用「多选枚举」替代`)
  const field = await dataModel.createField(ctx.request.body)
  ctx.body = field.modelForClient()
})

factory.prepare(GeneralDataApis.ModelShadowFieldCreate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const field = await dataModel.createShadowField(ctx.request.body)
  ctx.body = field.modelForClient()
})

factory.prepare(GeneralDataApis.DataModelFieldDataClone, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const toField = await prepareModelField(ctx)
  const { copyFromFieldKey } = ctx.request.body
  const fromField = await _ModelField.findModelField(dataModel.modelKey, copyFromFieldKey)
  assert.ok(!!fromField, 'Source ModelField Not Found')
  await dataModel.cloneFieldData(fromField, toField)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelSystemFieldsShow, async (ctx) => {
  const { fieldKeys } = ctx.request.body
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  await dataModel.showSystemFields(fieldKeys)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelBroadcastUpdate, async (ctx) => {
  const { fieldKeys } = ctx.request.body
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  await dataModel.updateBroadcastFields(fieldKeys)
  const options: Partial<ModelNotifyTemplateModel> = {}
  options.content = await dataModel.generateNotifyTemplateContent()
  await dataModel.updateNotifyTemplate(options)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataSystemModelFieldUpdate, async (ctx) => {
  const params = ctx.request.body
  const options = {
    star: params.star,
    name: params.name,
  }
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const modelField = await prepareModelField(ctx)
  assert.ok(!!modelField.isSystem || !!modelField.isShadow, '本接口只能修改系统字段或影子字段')
  await dataModel.modifyField(modelField, options as any)
  ctx.body = modelField.modelForClient()
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelFieldUpdate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const modelField = await prepareModelField(ctx)
  assert.ok(!modelField.isSystem && !modelField.isShadow, '本接口不能修改系统字段或影子字段')
  await dataModel.modifyField(modelField, ctx.request.body)
  ctx.body = modelField.modelForClient()
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelEnumFieldTransfer, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const modelField = await prepareModelField(ctx)
  assert.ok(!modelField.isSystem && !modelField.isShadow, '本接口不能修改系统字段或影子字段')
  await dataModel.transferIntEnumToTextEnum(modelField, ctx.request.body)
  ctx.body = modelField.modelForClient()
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelFieldDelete, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const modelField = await prepareModelField(ctx)
  assert.ok(!modelField.isSystem, '本接口不能修改系统字段')
  await dataModel.deleteField(modelField)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelFieldActionCreate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const modelField = await prepareModelField(ctx)
  assert.ok(!modelField.isSystem && !modelField.isShadow, '本接口不能修改系统字段或影子字段')
  await modelField.addAction(ctx.request.body)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelFieldActionUpdate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const modelField = await prepareModelField(ctx)
  assert.ok(!modelField.isSystem && !modelField.isShadow, '本接口不能修改系统字段或影子字段')
  const action = (await _ModelFieldAction.findWithUid(ctx.params.actionId)) as _ModelFieldAction
  assert.ok(!!action, 'Action 不存在')
  await modelField.updateAction(action, ctx.request.body)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelFieldActionDelete, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const modelField = await prepareModelField(ctx)
  assert.ok(!modelField.isSystem && !modelField.isShadow, '本接口不能修改系统字段或影子字段')
  const action = (await _ModelFieldAction.findWithUid(ctx.params.actionId)) as _ModelFieldAction
  assert.ok(!!action, 'Action 不存在')
  await modelField.removeAction(action)
  ctx.status = 200
})

export const ModelFieldSpecs = factory.buildSpecs()
