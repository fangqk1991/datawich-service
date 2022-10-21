import { SpecFactory } from '@fangcha/router'
import assert from '@fangcha/assert'
import { GeneralDataApis } from '../../common/web-api'
import { _DataModel } from '../../models/extensions/_DataModel'
import { SessionChecker } from '../../services/SessionChecker'
import {
  ForAnalysisParams,
  GeneralDataPermissionKey,
  GeneralPermission,
  ModelFullMetadata,
  ModelType,
} from '../../common/models'
import { DataModelHandler } from '../../services/DataModelHandler'
import { _DatawichService } from '../../services/_DatawichService'
import { FangchaSession } from '@fangcha/router/lib/session'
import { ModelDataHandler } from '../../services/ModelDataHandler'
import { DatahubHandler } from '../../services/DatahubHandler'
import { _DatahubColumn } from '../../models/datahub-sync/_DatahubColumn'
import { DataModelSpecHandler } from './DataModelSpecHandler'

const factory = new SpecFactory('数据模型')

factory.prepare(GeneralDataApis.DataModelListGet, async (ctx) => {
  const searcher = new _DataModel().fc_searcher(ctx.request.query)
  const feeds = await searcher.queryFeeds()
  ctx.body = {
    elements: feeds.map((feed) => feed.modelForClient()),
    totalSize: await searcher.queryCount(),
  }
})

factory.prepare(GeneralDataApis.DataModelAccessibleCheck, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    ctx.status = 200
  })
})

factory.prepare(GeneralDataApis.DataModelClone, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    const session = ctx.session as FangchaSession
    const { to_key } = ctx.request.body
    const toModel = await new DataModelHandler(dataModel).cloneToModel(to_key, session.curUserStr())
    ctx.body = toModel.modelForClient()
  })
})

factory.prepare(GeneralDataApis.DataModelFullMetadataGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    ctx.set('Content-disposition', `attachment; filename=${dataModel.modelKey}.json`)
    ctx.body = JSON.stringify(await new DataModelHandler(dataModel).getFullMetadata(), null, 2)
  })
})

factory.prepare(GeneralDataApis.DataModelInfoGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel)
    const data = dataModel.modelForClient()
    data.powerData = await new SessionChecker(ctx).getScopePowerData(dataModel.modelKey)
    ctx.body = data
  })
})

factory.prepare(GeneralDataApis.DataModelOuterModelListGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel)
    const outerModels = await dataModel.getOuterModelsInUse()
    ctx.body = outerModels.map((feed) => feed.fc_pureModel())
  })
})

factory.prepare(GeneralDataApis.DataModelShadowModelListGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel)
    const outerModels = await dataModel.getShadowModels()
    ctx.body = outerModels.map((feed) => feed.fc_pureModel())
  })
})

factory.prepare(GeneralDataApis.DataModelCreate, async (ctx) => {
  const session = ctx.session as FangchaSession
  const params = { ...ctx.request.body }
  params.author = session.curUserStr()
  const dataModel = await _DataModel.generateModel(params)
  ctx.body = dataModel.fc_pureModel()
})

factory.prepare(GeneralDataApis.DataModelImport, async (ctx) => {
  const session = ctx.session as FangchaSession
  const params = ctx.request.body as ModelFullMetadata
  params.fieldLinks = params.fieldLinks || []
  params.fieldIndexes = params.fieldIndexes || []
  params.fieldGroups = params.fieldGroups || []
  params.modelFields = params.modelFields || []
  assert.ok(params.systemVersion === _DatawichService.version, `当前系统只支持 ${_DatawichService.version} 版本的数据`)
  assert.ok(!!params.modelKey, `modelKey 信息缺失`)
  assert.ok(!!params.dataModel, `dataModel 信息缺失`)
  assert.ok(!(await _DataModel.findModel(params.modelKey)), `${params.modelKey} 模型已存在`)
  const dataModel = await _DataModel.generateFullModel(params, session.curUserStr())
  ctx.body = dataModel.fc_pureModel()
})

factory.prepare(GeneralDataApis.DataModelUpdate, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    await dataModel.updateFeed(ctx.request.body)
    ctx.status = 200
  })
})

factory.prepare(GeneralDataApis.DataModelForAnalysisUpdate, async (ctx) => {
  const session = ctx.session as FangchaSession
  session.assertVisitorHasPermission(GeneralDataPermissionKey.PERMISSION_GENERAL_DATA_ANALYSIS)
  const changedList = ctx.request.body as ForAnalysisParams[]
  assert.ok(Array.isArray(changedList), '参数不合法')
  changedList.forEach((item) => {
    assert.ok(!!item.modelKey, '参数[modelKey]不合法')
    assert.ok(item.checked !== undefined, '参数[checked]不合法')
  })
  await _DataModel.updateForAnalysis(changedList)
  ctx.status = 200
})

factory.prepare(GeneralDataApis.DataModelDelete, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    await new DataModelHandler(dataModel).destroyModel()
    ctx.status = 200
  })
})

factory.prepare(GeneralDataApis.DataModelRecordsEmpty, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    const session = ctx.session as FangchaSession
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    await dataModel.removeAllRecords(session.curUserStr())
    ctx.status = 200
  })
})

factory.prepare(GeneralDataApis.DataModelSummaryInfoGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    ctx.body = {
      count: await new ModelDataHandler(dataModel).getDataCount(),
    }
  })
})

factory.prepare(GeneralDataApis.ModelDatahubFieldListGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    assert.ok(dataModel.modelType === ModelType.DatahubModel, '只有数据源模型可进行此操作')
    ctx.body = await new DatahubHandler(dataModel).getDatahubColumnModels()
  })
})

factory.prepare(GeneralDataApis.ModelDatahubInfoGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    assert.ok(dataModel.modelType === ModelType.DatahubModel, '只有数据源模型可进行此操作')
    const datahubTable = await new DatahubHandler(dataModel).getDatahubTable()
    const progress = await datahubTable.getLatestProgress()
    ctx.body = {
      sampleDate: dataModel.sampleDate,
      engineKey: datahubTable.engineKey,
      tableKey: datahubTable.tableKey,
      latestProgress: progress?.fc_pureModel(),
    }
  })
})

factory.prepare(GeneralDataApis.ModelDatahubRecordsLoad, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    assert.ok(dataModel.modelType === ModelType.DatahubModel, '只有数据源模型可进行此操作')
    await new DatahubHandler(dataModel).loadLatestDatahubRecords()
    ctx.status = 200
  })
})

factory.prepare(GeneralDataApis.ModelDatahubColumnBind, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    assert.ok(dataModel.modelType === ModelType.DatahubModel, '只有数据源模型可进行此操作')
    const datahubLink = new DatahubHandler(dataModel).datahubLink
    const { columnKey, fieldData } = ctx.request.body
    const column = await _DatahubColumn.findOne({
      engine_key: datahubLink.engineKey,
      table_key: datahubLink.tableKey,
      column_key: columnKey,
    })
    assert.ok(!!column, 'DatahubColumn Not Found')
    await new DatahubHandler(dataModel).bindDatahubColumn(fieldData, column!)
    ctx.status = 200
  })
})

factory.prepare(GeneralDataApis.DataOpenModelListGet, async (ctx) => {
  const searcher = new _DataModel().fc_searcher({ isLibrary: 1 })
  const feeds = await searcher.queryFeeds()
  ctx.body = feeds.map((feed) => feed.modelForClient())
})

factory.prepare(GeneralDataApis.DataContentModelListGet, async (ctx) => {
  const searcher = new _DataModel().fc_searcher({ modelType: ModelType.ContentModel })
  const feeds = await searcher.queryFeeds()
  ctx.body = feeds.map((feed) => feed.modelForClient())
})

factory.prepare(GeneralDataApis.DataModelNotifyTemplateGet, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    const template = await dataModel.prepareNotifyTemplate()
    ctx.body = template.fc_pureModel()
  })
})

factory.prepare(GeneralDataApis.DataModelNotifyTemplateUpdate, async (ctx) => {
  await new DataModelSpecHandler(ctx).handle(async (dataModel) => {
    const params = ctx.request.body
    await new SessionChecker(ctx).assertModelAccessible(dataModel, GeneralPermission.ManageModel)
    await dataModel.updateNotifyTemplate(params)
    ctx.status = 200
  })
})

export const DataModelSpecs = factory.buildSpecs()
