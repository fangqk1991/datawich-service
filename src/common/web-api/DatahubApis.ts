export const DatahubApis = {
  DataEngineListGet: {
    method: 'GET',
    route: '/api/v2/data-engine',
    description: '获取 Datahub Engine 列表',
  },
  DataEngineTableListGet: {
    method: 'GET',
    route: '/api/v2/data-engine/:engineKey/table',
    description: '获取 Datahub Engine Table 列表',
  },
  DataColumnInfoUpdate: {
    method: 'POST',
    route: '/api/v2/data-engine/:engineKey/table/:tableKey/column/:columnKey',
    description: '编辑 Datahub Column 信息',
  },
}
