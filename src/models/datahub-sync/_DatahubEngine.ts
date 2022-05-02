import __DatahubEngine from '../auto-build/__DatahubEngine'
import { _DatahubTable } from './_DatahubTable'
import { DatahubEngineModel } from '../../common/models'

export class _DatahubEngine extends __DatahubEngine {
  public constructor() {
    super()
  }

  public static async allAvailableEngineList<T extends _DatahubEngine>(this: { new (): T }) {
    const searcher = new this().fc_searcher()
    searcher.processor().addConditionKV('invalid', 0)
    return searcher.queryAllFeeds()
  }

  public async getAvailableTables() {
    const searcher = new _DatahubTable().fc_searcher()
    searcher.processor().addConditionKV('engine_key', this.engineKey)
    searcher.processor().addConditionKV('invalid', 0)
    return searcher.queryAllFeeds()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as DatahubEngineModel
    // @ts-ignore
    delete data.extrasInfo
    return data
  }
}
