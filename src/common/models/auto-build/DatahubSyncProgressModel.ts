export interface DatahubSyncProgressModel {
  engineKey: string
  tableKey: string
  sampleDate: string
  current: number
  total: number
  available: number
  badge: number
  errorMsg: string
  createTime: string
  updateTime: string
}

export const Keys_DatahubSyncProgressModel = [
  // prettier-ignore
  'engineKey',
  'tableKey',
  'sampleDate',
  'current',
  'total',
  'available',
  'badge',
  'errorMsg',
  'createTime',
  'updateTime',
]
