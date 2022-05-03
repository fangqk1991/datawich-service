import { FCDatabase } from 'fc-sql'
import { _DatawichService } from '../src'
import { GeneralDataDBOptions } from '../tools/db-config'

FCDatabase.instanceWithName('general_data').init(GeneralDataDBOptions as any)

export const initGeneralDataSettingsTest = () => {
  _DatawichService.init({
    database: FCDatabase.instanceWithName('general_data'),
  })
}
