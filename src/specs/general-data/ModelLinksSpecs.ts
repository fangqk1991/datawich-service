import { SpecFactory } from '@fangcha/router'
import { prepareDataModel, prepareFieldLink } from './SpecUtils'
import { GeneralDataApis } from '../../common/web-api'
import { SessionChecker } from '../../services/SessionChecker'
import { FieldLinkModel } from '../../common/models'
import { _FieldLink } from '../../models/extensions/_FieldLink'

const factory = new SpecFactory('模型关联信息')

factory.prepare(GeneralDataApis.ModelHoldingLinkListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const feeds = await dataModel.getHoldingLinks()
  const result: FieldLinkModel[] = []
  for (const feed of feeds) {
    result.push(await feed.modelWithRefFields())
  }
  ctx.body = result
})

factory.prepare(GeneralDataApis.ModelHoldingLinkCreate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const params = ctx.request.body
  params.modelKey = dataModel.modelKey
  const link = await _FieldLink.createLink(params)
  ctx.body = await link.modelWithRefFields()
})

factory.prepare(GeneralDataApis.ModelHoldingLinkUpdate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const params = ctx.request.body
  const link = await prepareFieldLink(ctx)
  await link.updateLinkInfo(params)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.ModelHoldingLinkDelete, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel)
  const link = await prepareFieldLink(ctx)
  await link.dropLink()
  ctx.status = 200
})

export const ModelLinksSpecs = factory.buildSpecs()
