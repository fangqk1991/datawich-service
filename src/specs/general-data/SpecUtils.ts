import { Context } from 'koa'
import assert from '@fangcha/assert'
import { _DatahubColumn } from '../../models/datahub-sync/_DatahubColumn'
import { _FieldLink } from '../../models/extensions/_FieldLink'
import { _FieldGroup } from '../../models/extensions/_FieldGroup'

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
