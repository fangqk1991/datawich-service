import { SpecFactory } from '@fangcha/router'
import assert from '@fangcha/assert'
import { DatahubApis } from '../../common/web-api'
import { _DatahubEngine } from '../../models/datahub-sync/_DatahubEngine'
import { _DatahubColumn } from '../../models/datahub-sync/_DatahubColumn'

const factory = new SpecFactory('Datahub 数据')

factory.prepare(DatahubApis.DataEngineListGet, async (ctx) => {
  const searcher = new _DatahubEngine().fc_searcher()
  const feeds = await searcher.queryAllFeeds()
  ctx.body = feeds.map((feed) => feed.modelForClient())
})

factory.prepare(DatahubApis.DataEngineTableListGet, async (ctx) => {
  const dataEngine = (await _DatahubEngine.findWithUid(ctx.params.engineKey)) as _DatahubEngine
  assert.ok(!!dataEngine, 'Datahub Engine 不存在')
  const feeds = await dataEngine.getAvailableTables()
  ctx.body = feeds.map((feed) => feed.fc_pureModel())
})

factory.prepare(DatahubApis.DataColumnInfoUpdate, async (ctx) => {
  const params = {
    engine_key: ctx.params.engineKey,
    table_key: ctx.params.tableKey,
    column_key: ctx.params.columnKey,
  }
  const column = (await _DatahubColumn.findOne(params))!
  assert.ok(!!column, 'DatahubColumn Not Found')
  const { name } = ctx.request.body
  await column.updateName(name || '')
  ctx.status = 200
})

export const DatahubSpecs = factory.buildSpecs()
