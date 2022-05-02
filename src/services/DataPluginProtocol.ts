import { _DataModel } from '../models/extensions/_DataModel'
import { DescribableField, Raw_ModelField } from '../common/models'

export interface DataPluginProtocol {
  onDataFound?: (data: any, dataModel: _DataModel) => Promise<void>
  onParamsCheck?: (params: any, dataModel: _DataModel) => Promise<{ [p: string]: string }> // return errorMap
  onFieldInfosMade?: (field: Raw_ModelField, describableFields: DescribableField[]) => void
}
