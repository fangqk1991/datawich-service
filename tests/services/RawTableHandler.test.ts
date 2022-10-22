import { initGeneralDataSettingsTest } from '../GeneralDataServiceDev'
import { _DataModel, DataModelHandler, RawTableHandler } from '../../src'
import { MyDatabase } from '../../datawich/services/MyDatabase'

initGeneralDataSettingsTest()

describe('Test RawTableHandler.test.ts', () => {
  it(`Test transferColumnsToModelFields`, async () => {
    const handler = new RawTableHandler(MyDatabase.datawichDB, 'datawich_company')
    const fields = await handler.transferColumnsToModelFields()
    console.info(fields)
  })

  it(`Test build model from schema`, async () => {
    const modelKey = 'company_demo'
    {
      const model = await _DataModel.findModel(modelKey)
      if (model) {
        await new DataModelHandler(model).destroyModel()
      }
    }
    const author = 'fangquankun'
    const model = await _DataModel.generateModel({
      modelKey: modelKey,
      name: 'Company Demo',
      isOnline: 1,
      author: author,
    })

    const handler = new RawTableHandler(MyDatabase.datawichDB, 'datawich_company')
    await handler.injectFieldsToDataModel(model)
  })
})
