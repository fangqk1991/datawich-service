import { SpecFactory } from '@fangcha/router'
import { prepareDataModel } from './SpecUtils'
import { GeneralDataApis } from '../../common/web-api'

const factory = new SpecFactory('模型组')

factory.prepare(GeneralDataApis.ModelLinkedGroupListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const groups = await dataModel.getLinkedGroups()
  ctx.body = groups.map((feed) => feed.fc_pureModel())
})

export const ModelGroupSpecs = factory.buildSpecs()
