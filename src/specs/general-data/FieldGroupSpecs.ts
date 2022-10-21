import { SpecFactory } from '@fangcha/router'
import { GeneralDataApis } from '../../common/web-api'
import { SessionChecker } from '../../services/SessionChecker'
import { _FieldGroup } from '../../models/extensions/_FieldGroup'
import { DataModelSpecHandler } from './DataModelSpecHandler'

const factory = new SpecFactory('字段组')

factory.prepare(GeneralDataApis.ModelFieldGroupListGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel)
    const feeds = await dataModel.getFieldGroups()
    ctx.body = feeds.map((feed) => feed.fc_pureModel())
  })
})

factory.prepare(GeneralDataApis.ModelFieldGroupCreate, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel)
    const params = ctx.request.body
    params.modelKey = dataModel.modelKey
    const group = await _FieldGroup.createGroup(params)
    ctx.body = await group.fc_pureModel()
  })
})

factory.prepare(GeneralDataApis.ModelFieldGroupUpdate, async (ctx) => {
  await new DataModelSpecHandler(ctx).handleFieldGroup(async (fieldGroup, dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel)
    const params = ctx.request.body
    await fieldGroup.updateInfos(params)
    ctx.status = 200
  })
})

factory.prepare(GeneralDataApis.ModelFieldGroupDelete, async (ctx) => {
  await new DataModelSpecHandler(ctx).handleFieldGroup(async (fieldGroup, dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel)
    await fieldGroup.destroyGroup()
    ctx.status = 200
  })
})

export const FieldGroupSpecs = factory.buildSpecs()
