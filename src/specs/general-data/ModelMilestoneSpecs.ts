import { SpecFactory } from '@fangcha/router'
import { prepareDataModel } from './SpecUtils'
import assert from '@fangcha/assert'
import { GeneralDataApis } from '../../common/web-api'
import { SessionChecker } from '../../services/SessionChecker'
import { DataModelHandler } from '../../services/DataModelHandler'
import { _ModelMilestone } from '../../models/extensions/_ModelMilestone'

const factory = new SpecFactory('元信息版本')

factory.prepare(GeneralDataApis.ModelMilestoneListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const searcher = dataModel.getMilestoneSearcher()
  const items = await searcher.queryAllFeeds()
  ctx.body = items.map((feed) => feed.fc_pureModel())
})

factory.prepare(GeneralDataApis.ModelMilestoneCreate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  await new DataModelHandler(dataModel).createMilestone(ctx.request.body)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.ModelMilestoneImport, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  await new DataModelHandler(dataModel).importMilestone(ctx.request.body)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.ModelMilestoneDelete, async (ctx) => {
  assert.ok(false, '暂不支持删除操作', 403)
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const milestone = await _ModelMilestone.findMilestone(dataModel.modelKey, ctx.params.tagName)
  assert.ok(!!milestone, '版本不存在')
  await milestone.deleteFromDB()
  ctx.status = 200
})

factory.prepare(GeneralDataApis.ModelMasterMetadataGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  ctx.set('Content-disposition', `attachment; filename=${dataModel.modelKey}-master.json`)
  ctx.body = JSON.stringify(await new DataModelHandler(dataModel).getFullMetadata(), null, 2)
})

factory.prepare(GeneralDataApis.ModelMilestoneMetadataGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const milestone = await _ModelMilestone.findMilestone(dataModel.modelKey, ctx.params.tagName)
  assert.ok(!!milestone, '版本不存在')
  ctx.body = milestone.getMetadata()
})

factory.prepare(GeneralDataApis.ModelMilestoneMetadataExport, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const milestone = await _ModelMilestone.findMilestone(dataModel.modelKey, ctx.params.tagName)
  assert.ok(!!milestone, '版本不存在')
  ctx.set('Content-disposition', `attachment; filename=${dataModel.modelKey}-${milestone.tagName}.json`)
  ctx.body = JSON.stringify(milestone.getMetadata(), null, 2)
})

export const ModelMilestoneSpecs = factory.buildSpecs()
