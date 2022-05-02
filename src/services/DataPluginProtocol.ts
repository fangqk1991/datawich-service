import { SQLSearcher } from 'fc-sql'
import { FilterOptions } from 'fc-feed'
import { _DataModel } from '../models/extensions/_DataModel'

export interface DataPluginProtocol {
  onDataFound: (data: any, dataModel: _DataModel) => Promise<void>
  onParamsCheck: (params: any, dataModel: _DataModel) => Promise<{ [p: string]: string }> // return errorMap
}
