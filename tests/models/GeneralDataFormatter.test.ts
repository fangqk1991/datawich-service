import { logger } from '@fangcha/logger'
import { initGeneralDataSettingsTest } from '../GeneralDataServiceDev'
import { _DataModel, DataModelHandler } from '../../src'
import { GeneralDataFormatter } from '../../src/common/models'

initGeneralDataSettingsTest()

describe('Test GeneralDataFormatter.test.ts', () => {
  it(`Test makeProfile / updateProfile`, async () => {
    const dataModel = await _DataModel.findModel('demo')
    const fullMetadata = await new DataModelHandler(dataModel).getFullMetadata()
    const fields = GeneralDataFormatter.makeDescribableFieldsFromMetadata(fullMetadata)
    logger.info(fields)
  })
})
