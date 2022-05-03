import { Context } from 'koa'
import assert from '@fangcha/assert'
import { _DataModel } from '../../models/extensions/_DataModel'
import { _ModelField } from '../../models/extensions/_ModelField'
import { _DatahubColumn } from '../../models/datahub-sync/_DatahubColumn'
import { _FieldLink } from '../../models/extensions/_FieldLink'
import { _FieldGroup } from '../../models/extensions/_FieldGroup'

export const prepareDataModel = async (ctx: Context) => {
  const dataModel = await _DataModel.findModel(ctx.params.modelKey)
  assert.ok(!!dataModel, 'DataModel Not Found')
  if (dataModel.isLocked) {
    assert.ok(ctx.method === 'GET', '模型已被锁定，不可修改')
  }
  return dataModel
}

export const prepareModelField = async (ctx: Context) => {
  const modelField = await _ModelField.findModelField(ctx.params.modelKey, ctx.params.fieldKey)
  assert.ok(!!modelField, 'ModelField Not Found')
  return modelField as _ModelField
}

export const prepareDatahubColumn = async (ctx: Context) => {
  const params = {
    engine_key: ctx.params.engineKey,
    table_key: ctx.params.tableKey,
    column_key: ctx.params.columnKey,
  }
  const column = await _DatahubColumn.findOne(params)
  assert.ok(!!column, 'DatahubColumn Not Found')
  return column as _DatahubColumn
}

export const prepareFieldLink = async (ctx: Context) => {
  const fieldLink = await _FieldLink.findLink(ctx.params.linkId)
  assert.ok(!!fieldLink, 'FieldLink Not Found')
  return fieldLink
}

export const prepareFieldGroup = async (ctx: Context) => {
  const fieldGroup = await _FieldGroup.findGroup(ctx.params.modelKey, ctx.params.groupKey)
  assert.ok(!!fieldGroup, 'FieldGroup Not Found')
  return fieldGroup
}
