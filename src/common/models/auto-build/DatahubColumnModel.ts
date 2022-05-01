export interface DatahubColumnModel {
  engineKey: string
  tableKey: string
  columnKey: string
  columnType: string
  name: string
  nullable: number
  specialKey: string
  extrasInfo: string
  invalid: number
  createTime: string
  updateTime: string
  // Extend properties
  linked: boolean
  linkField: string
}

export const Keys_DatahubColumnModel = [
  // prettier-ignore
  'engineKey',
  'tableKey',
  'columnKey',
  'columnType',
  'name',
  'nullable',
  'specialKey',
  'extrasInfo',
  'invalid',
  'createTime',
  'updateTime',
]
