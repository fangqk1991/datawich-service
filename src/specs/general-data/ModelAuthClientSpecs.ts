import { SpecFactory } from '@fangcha/router'
import { prepareDataModel } from './SpecUtils'
import assert from '@fangcha/assert'
import { GeneralDataApis } from '../../common/web-api'
import { SessionChecker } from '../../services/SessionChecker'
import { ClientAuthParams, GeneralPermission } from '../../common/models'
import { ModelAuthHandler } from '../../services/ModelAuthHandler'

const factory = new SpecFactory('模型 API 访问者')

factory.prepare(GeneralDataApis.ModelAuthClientListGet, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const feeds = await new ModelAuthHandler(dataModel).getAuthModels()
  ctx.body = feeds.map((item) => item.fc_pureModel())
})

factory.prepare(GeneralDataApis.ModelAuthClientListUpdate, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  const params = ctx.request.body as ClientAuthParams[]
  assert.ok(Array.isArray(params), '参数不合法')
  params.forEach((item) => {
    assert.ok(!!item.appid, '参数[appid]不合法')
    assert.ok(!!item.modelKey, '参数[modelKey]不合法')
    assert.ok(item.checked !== undefined, '参数[checked]不合法')
  })
  await new ModelAuthHandler(dataModel).updateAuthModels(params)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.ModelAuthClientDelete, async (ctx) => {
  const dataModel = await prepareDataModel(ctx)
  const appid = ctx.params.appid
  assert.ok(!!appid, 'appid 不合法')
  await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
  await new ModelAuthHandler(dataModel).updateAuthModels([
    {
      modelKey: dataModel.modelKey,
      appid: appid,
      checked: false,
    },
  ])
  ctx.status = 200
})

export const ModelAuthClientSpecs = factory.buildSpecs()
