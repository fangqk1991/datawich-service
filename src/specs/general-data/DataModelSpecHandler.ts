import assert from '@fangcha/assert'
import { Context } from 'koa'
import { _DataModel } from '../../models/extensions/_DataModel'

export class DataModelSpecHandler {
  ctx!: Context

  public constructor(ctx: Context) {
    this.ctx = ctx
  }

  private _dataModel!: _DataModel
  private async prepareDataModel() {
    if (!this._dataModel) {
      const ctx = this.ctx
      const dataModel = await _DataModel.findModel(ctx.params.modelKey)
      assert.ok(!!dataModel, 'DataModel Not Found')
      if (ctx.method !== 'GET') {
        assert.ok(!dataModel.isLocked, '模型已被锁定，不可修改')
      }
      // if (!(await new SessionChecker(ctx).checkModelPermission(dataModel, GeneralPermission.ManageModel))) {
      //   assert.ok(!!dataModel.isOnline, `应用暂时停用，如有疑问，请联系 ${dataModel.author}`)
      // }
      // await new SessionChecker(ctx).assertModelAccessible(dataModel)
      this._dataModel = dataModel
    }
    return this._dataModel
  }

  public async handle(handler: (dataModel: _DataModel) => Promise<void>) {
    const dataModel = await this.prepareDataModel()
    await handler(dataModel)
  }
}
