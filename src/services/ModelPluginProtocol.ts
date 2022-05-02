import { SQLSearcher } from 'fc-sql'
import { FilterOptions } from 'fc-feed'
import { _DataModel } from '../models/extensions/_DataModel'

export interface ModelPluginProtocol {
  onSearcherCreated?: (dataModel: _DataModel, searcher: SQLSearcher, options: FilterOptions) => void
  onImportedDataDecoded: (params: any) => Promise<any>
  onDataCreateBefore: (params: any) => Promise<any>
  onDataModifyBefore: (params: any) => Promise<any>
  onParamsCheck: (params: any) => Promise<{ [p: string]: string }>
}

export interface DataPluginProtocol {
  onDataFound: (data: any, dataModel: _DataModel) => Promise<void>
  onParamsCheck: (params: any, dataModel: _DataModel) => Promise<{ [p: string]: string }> // return errorMap
}
