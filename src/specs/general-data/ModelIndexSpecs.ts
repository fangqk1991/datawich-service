import { SpecFactory } from '@fangcha/router'
import { prepareDataModel, prepareModelField } from './SpecUtils'
import assert from '@fangcha/assert'
import { GeneralDataApis } from '../../common/web-api'
import { SessionChecker } from '../../services/SessionChecker'
import { checkIndexAbleField, ModelType } from '../../common/models'
import { _FieldIndex } from '../../models/extensions/_FieldIndex'

const factory = new SpecFactory('数据索引')

factory.prepare(GeneralDataApis.DataModelColumnIndexListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const indexes = await dataModel.getColumnIndexes()
  ctx.body = indexes.map((feed) => feed.fc_pureModel())
})

factory.prepare(GeneralDataApis.DataModelColumnIndexCreate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const modelField = await prepareModelField(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  assert.ok(checkIndexAbleField(modelField.fieldType), '此类型不可设置索引')
  let { isUnique } = ctx.request.body
  assert.ok([0, 1].includes(isUnique), 'isUnique 参数不合法')
  if (isUnique === 1 && dataModel.modelType === ModelType.DatahubModel) {
    isUnique = -1
  }
  await _FieldIndex.createIndex(modelField, isUnique)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelColumnIndexDrop, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const modelField = await prepareModelField(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const fieldIndex = await _FieldIndex.findIndex(modelField.modelKey, modelField.fieldKey)
  assert.ok(!!fieldIndex, '索引不存在')
  await fieldIndex.dropIndex()
  ctx.status = 200
})

export const ModelIndexSpecs = factory.buildSpecs()
