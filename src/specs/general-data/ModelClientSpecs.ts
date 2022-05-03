import assert from '@fangcha/assert'
import { Context } from 'koa'
import { SpecFactory } from '@fangcha/router'
import { _AppClient } from '../../models/extensions/_AppClient'
import { ModelClientApis } from '../../common/web-api'
import { FangchaSession } from '@fangcha/backend-kit'
import { ClientAuthParams, GeneralDataPermissionKey } from '../../common/models'

const factory = new SpecFactory('API 应用管理')

const prepareModelClient = async (ctx: Context) => {
  const modelClient = await _AppClient.findWithUid(ctx.params.appid)
  assert.ok(!!modelClient, 'ModelClient Not Found')
  return modelClient as _AppClient
}

factory.prepare(ModelClientApis.ModelClientListGet, async (ctx) => {
  const searcher = new _AppClient().fc_searcher(ctx.request.query)
  const feeds = await searcher.queryFeeds()
  ctx.body = {
    elements: feeds.map((feed) => feed.modelForClient()),
    totalSize: await searcher.queryCount(),
  }
})

factory.prepare(ModelClientApis.ModelClientCreate, async (ctx) => {
  const params = { ...ctx.request.body }
  const modelClient = await _AppClient.generateApp(params)
  ctx.body = modelClient.fc_pureModel()
})

factory.prepare(ModelClientApis.ModelClientUpdate, async (ctx) => {
  const modelClient = await prepareModelClient(ctx)
  await modelClient.updateApp(ctx.request.body)
  ctx.status = 200
})

factory.prepare(ModelClientApis.ModelClientDelete, async (ctx) => {
  const session = ctx.session as FangchaSession
  session.assertVisitorHasPermission(GeneralDataPermissionKey.PERMISSION_GENERAL_DATA_MANAGEMENT)
  const modelClient = await prepareModelClient(ctx)
  await modelClient.deleteFromDB()
  ctx.status = 200
})

factory.prepare(ModelClientApis.ClientAuthModelListGet, async (ctx) => {
  const modelClient = await prepareModelClient(ctx)
  const auths = await modelClient.getAuthModels()
  ctx.body = auths.map((item) => item.fc_pureModel())
})

factory.prepare(ModelClientApis.ClientAuthModelListUpdate, async (ctx) => {
  const session = ctx.session as FangchaSession
  session.assertVisitorHasPermission(GeneralDataPermissionKey.PERMISSION_GENERAL_DATA_MANAGEMENT)
  const params = ctx.request.body as ClientAuthParams[]
  assert.ok(Array.isArray(params), '参数不合法')
  params.forEach((item) => {
    assert.ok(!!item.appid, '参数[appid]不合法')
    assert.ok(!!item.modelKey, '参数[modelKey]不合法')
    assert.ok(item.checked !== undefined, '参数[checked]不合法')
  })
  const modelClient = await prepareModelClient(ctx)
  await modelClient.updateAuthModels(params)
  ctx.status = 200
})

export const ModelClientSpecs = factory.buildSpecs()