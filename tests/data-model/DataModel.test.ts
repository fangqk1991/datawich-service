import * as assert from 'assert'
import { DBTableHandler } from 'fc-sql'
import { generateModel } from '../ModelTestHelper'
import { logger } from '@fangcha/logger'
import { initGeneralDataSettingsTest } from '../GeneralDataServiceDev'
import { _DataModel, _FieldShadowLink, DataModelHandler } from '../../src'
import { FieldType } from '../../src/common/models'

initGeneralDataSettingsTest()

describe('Test DataModel', () => {
  it(`Test buildModel`, async () => {
    const modelKey = 'model_demo'
    {
      const model = await _DataModel.findModel(modelKey)
      if (model) {
        await new DataModelHandler(model).destroyModel()
      }
    }
    const author = 'fangquankun'
    const model = await _DataModel.generateModel({
      modelKey: modelKey,
      name: 'Model Demo',
      isOnline: 1,
      author: author,
    })

    const tableHandler = new DBTableHandler(model.dbSpec().database, model.sqlTableName())
    assert.ok(await tableHandler.checkTableExists())

    {
      const field = await model.createField({
        fieldKey: 'key1',
        name: '姓名',
        required: 1,
        fieldType: FieldType.SingleLineText,
        isUnique: 0,
        star: 0,
      } as any)
      const columns = await tableHandler.getColumns()
      const lastColumn = columns.pop()!
      assert.equal(lastColumn.Field, field.fieldKey)
      assert.equal(lastColumn.Type, `varchar(1023)`)
    }

    {
      const field = await model.createField({
        fieldKey: 'key2',
        name: '季节',
        required: 1,
        fieldType: FieldType.Enum,
        isUnique: 0,
        star: 0,
        options: [
          { label: '春', value: 1 },
          { label: '夏', value: 2 },
          { label: '秋', value: 3 },
          { label: '冬', value: 4 },
        ],
      } as any)
      const columns = await tableHandler.getColumns()
      const lastColumn = columns.pop()!
      assert.equal(lastColumn.Field, field.fieldKey)
    }

    // TODO: importHandler
    // const buffer = await model.importHandler().exportDemoExcel()
    // assert.ok(!!buffer)
  })

  it(`Test generate / destroy`, async () => {
    const dataModel = await generateModel()
    assert.ok(!!(await _DataModel.findModel(dataModel.modelKey)))
    const tableHandler = dataModel.dbSpec().database.tableHandler(dataModel.sqlTableName())
    assert.ok(await tableHandler.checkTableExists())
    await new DataModelHandler(dataModel).destroyModel()
    assert.ok(!(await _DataModel.findModel(dataModel.modelKey)))
    assert.ok(!(await tableHandler.checkTableExists()))
  })

  it(`Test getOuterModelsInUse`, async () => {
    const searcher = new _DataModel().fc_searcher({
      isLibrary: 1,
    })
    const feeds = await searcher.queryFeeds()
    if (feeds.length === 0) {
      return
    }
    const dataModel = feeds[0]
    const outerModels = await dataModel.getOuterModelsInUse()
    assert.ok(Array.isArray(outerModels))
  })

  it(`Test createShadowField`, async () => {
    const masterModel = await generateModel()
    await masterModel.createField({
      fieldKey: 'user',
      name: 'User',
      required: 1,
      fieldType: FieldType.User,
      isUnique: 0,
      star: 0,
    } as any)
    const matrixField = await masterModel.createField({
      fieldKey: 'season',
      name: 'Season',
      required: 1,
      fieldType: FieldType.Enum,
      isUnique: 0,
      star: 0,
      options: [
        { label: '春', value: 1 },
        { label: '夏', value: 2 },
        { label: '秋', value: 3 },
        { label: '冬', value: 4 },
      ],
    } as any)

    const shadowModel = await generateModel()
    const shadowField = await shadowModel.createShadowField({
      matrixKey: `${matrixField.modelKey}.${matrixField.fieldKey}`,
      fieldKey: 'my_season',
      name: 'MySeason',
      star: 1,
    })
    assert.ok(!matrixField.isShadow)
    assert.ok(!!shadowField.isShadow)
    const shadowLink = new _FieldShadowLink()
    shadowLink.matrixField = matrixField.modelKey
    shadowLink.matrixField = matrixField.fieldKey
    shadowLink.shadowModel = shadowField.modelKey
    shadowLink.shadowField = shadowField.fieldKey
    assert.ok(await shadowLink.findFeedInDB())
    const shadowFields = await matrixField.getShadowFields()
    assert.ok(shadowFields.length === 1)
    assert.ok(await matrixField.checkMatrixField())
    await new DataModelHandler(shadowModel).destroyModel()
    await new DataModelHandler(masterModel).destroyModel()
  })

  it(`Test DataModel Full Structure`, async () => {
    const dataModel = await _DataModel.findModel('demo')
    logger.info(`DataModel pureModel: `, dataModel.fc_pureModel())

    const fields = await dataModel.getFields()
    for (const field of fields) {
      logger.info(`ModelField pureModel: `, field.modelForClient())
    }

    const links = await dataModel.getFieldLinks()
    for (const link of links) {
      logger.info(`FieldLink pureModel: `, link.modelForClient())
    }

    const indexes = await dataModel.getColumnIndexes()
    for (const index of indexes) {
      logger.info(`FieldIndex pureModel: `, index.modelForClient())
    }

    const fullMetadata = await new DataModelHandler(dataModel).getFullMetadata()
    logger.info(`ModelFullMetadata pureModel: `, fullMetadata)
  })
})
