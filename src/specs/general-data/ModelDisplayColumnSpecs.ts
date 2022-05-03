import { prepareDataModel } from './SpecUtils'
import { SpecFactory } from '@fangcha/router'
import assert from '@fangcha/assert'
import { GeneralDataApis } from '../../common/web-api'
import { DisplayScope, DisplayScopeDescriptor } from '../../common/models'

const factory = new SpecFactory('模型自定义展示列')

factory.prepare(GeneralDataApis.DataDisplayColumnUpdate, async (ctx) => {
  const { data, displayScope } = ctx.request.body
  assert.ok(Object.values(DisplayScope).includes(displayScope), 'displayScope 参数不合法')
  const dataModel = await prepareDataModel(ctx)
  await dataModel.updateCustomDisplayColumns(data, displayScope)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelDisplayColumnListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const displayScope = ctx.request.params.displayScope as DisplayScope
  assert.ok(DisplayScopeDescriptor.checkValueValid(displayScope), 'displayScope 参数不合法')
  const feeds = await dataModel.getModelDisplayColumnList(displayScope)
  ctx.body = feeds.map((feed) => feed.fc_pureModel())
  ctx.status = 200
})
export const ModelDisplayColumnSpecs = factory.buildSpecs()
