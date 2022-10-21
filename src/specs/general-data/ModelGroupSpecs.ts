import { SpecFactory } from '@fangcha/router'
import { GeneralDataApis } from '../../common/web-api'
import { DataModelSpecHandler } from './DataModelSpecHandler'

const factory = new SpecFactory('模型组')

factory.prepare(GeneralDataApis.ModelLinkedGroupListGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    const groups = await dataModel.getLinkedGroups()
    ctx.body = groups.map((feed) => feed.fc_pureModel())
  })
})

export const ModelGroupSpecs = factory.buildSpecs()
