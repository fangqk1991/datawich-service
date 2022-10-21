import { DBTableHandler } from 'fc-sql'
import { FieldType, Raw_ModelField } from '../common/models'

export class RawTableHandler extends DBTableHandler {
  public async transferColumnsToModelFields() {
    const columns = await this.getColumns()
    const retainKeysSet = new Set([
      '_rid',
      'rid',
      'data_id',
      'model_key',
      'ignore',
      'author',
      'update_author',
      'create_time',
      'update_time',
    ])
    const todoColumns = columns.filter((item) => !retainKeysSet.has(item.Field))
    return todoColumns.map((column) => {
      const fieldParams: Partial<Raw_ModelField> = {}
      fieldParams.modelKey = column.Field
      fieldParams.name = column.Field
      fieldParams.required = 0
      fieldParams.useDefault = 0
      fieldParams.defaultValue = column.Default || ''
      fieldParams.star = 0
      fieldParams.fieldType = FieldType.SingleLineText
      fieldParams.isSystem = 0
      fieldParams.isShadow = 0
      fieldParams.matrixKey = ''
      fieldParams.remarks = column.Comment || ''
      fieldParams.inputHint = ''
      fieldParams.extrasInfo = JSON.stringify({})
      return fieldParams as Raw_ModelField
    })
  }
}
