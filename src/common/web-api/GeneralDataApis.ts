const DataModelApis = {
  DataModelListGet: {
    method: 'GET',
    route: '/api/v2/general-data',
    description: '获取模型列表',
  },
  DataOpenModelListGet: {
    method: 'GET',
    route: '/api/v2/general-open-model',
    description: '获取可关联的模型列表',
  },
  DataContentModelListGet: {
    method: 'GET',
    route: '/api/v2/general-content-model',
    description: '获取内容管理模型列表',
  },
  DataModelCreate: {
    method: 'POST',
    route: '/api/v2/general-data',
    description: '创建模型',
  },
  DataModelImport: {
    method: 'POST',
    route: '/api/v2/general-data-import',
    description: '导入模型',
  },
  DataModelAccessibleCheck: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/check-accessible',
    description: '检查模型是否可访问',
  },
  DataModelClone: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/clone',
    description: '模型克隆',
  },
  DataModelFullMetadataGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/full-metadata',
    description: '模型完整元信息获取',
  },
  DataModelInfoGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey',
    description: '获取模型信息',
  },
  DataModelOuterModelListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/outer-model',
    description: '获取模型关联的外部模型列表',
  },
  DataModelShadowModelListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/shadow-model',
    description: '获取模型的影子模型列表',
  },
  DataModelUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey',
    description: '修改模型信息',
  },
  DataModelForAnalysisUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/data-model/for-analysis',
    description: '批量修改模型是否被数据分析信息',
  },
  DataModelDelete: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey',
    description: '删除模型',
  },
  DataModelRecordsEmpty: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/empty-records',
    description: '清空模型所有数据',
  },
  DataModelSummaryInfoGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/summary-info',
    description: '获取模型概要信息',
  },
  ModelDatahubRecordsLoad: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/load-datahub-records',
    description: '载入 Datahub 最新数据',
  },
  ModelDatahubFieldListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/datahub-field',
    description: '获取 Datahub 字段列表',
  },
  ModelDatahubColumnBind: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/bind-datahub-column',
    description: '绑定 Datahub 字段',
  },
  ModelDatahubInfoGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/datahub-info',
    description: '获取 Datahub 数据源信息',
  },
  ModelHoldingLinkListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/holding-link',
    description: '获取模型持有的关联信息',
  },
  ModelHoldingLinkCreate: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/holding-link',
    description: '创建模型关联信息',
  },
  ModelHoldingLinkUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/holding-link/:linkId',
    description: '更新模型关联信息',
  },
  ModelHoldingLinkDelete: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/holding-link/:linkId',
    description: '删除模型关联信息',
  },
  ModelFieldGroupListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/field-group',
    description: '获取模型字段组信息列表',
  },
  ModelFieldGroupCreate: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/field-group',
    description: '创建模型字段组信息',
  },
  ModelFieldGroupUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/field-group/:groupKey',
    description: '更新模型字段组信息',
  },
  ModelFieldGroupDelete: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/field-group/:groupKey',
    description: '删除模型字段组信息',
  },
  DataModelNotifyTemplateGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/notify-template',
    description: '获取模型通知模板信息',
  },
  DataModelNotifyTemplateUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/notify-template',
    description: '更新模型通知模板信息',
  },
}

const ModelFieldApis = {
  DataModelFieldListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/field',
    description: '模型完整字段列表获取',
  },
  DataModelAllFieldsDestroy: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/destroy-all-fields',
    description: '移除所有字段',
  },
  DataModelFieldsRebuild: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/rebuild-fields',
    description: '重建模型字段',
  },
  DataModelVisibleFieldListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/visible-field',
    description: '模型可见字段列表获取',
  },
  DataModelListCustomFieldsGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/custom-field/list',
    description: '模型使用模板字段列表获取',
  },
  DataModelDetailCustomFieldsGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/custom-field/detail',
    description: '模型使用模板字段列表获取',
  },
  DataModelFieldLinkListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/field-link',
    description: '模型关联字段列表获取',
  },
  DataModelFieldCreate: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/field',
    description: '创建模型字段',
  },
  ModelShadowFieldCreate: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/shadow-field',
    description: '关联内容字段',
  },
  DataModelFieldTop: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey/top-field',
    description: '置顶字段',
  },
  DataModelSystemFieldsShow: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/show-system-fields',
    description: '编辑需要展示的系统字段',
  },
  DataSystemModelFieldUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/system-field/:fieldKey',
    description: '修改系统字段信息',
  },
  DataModelFieldUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey',
    description: '修改字段信息',
  },
  DataModelEnumFieldTransfer: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey/transfer',
    description: '转换枚举字段定义信息',
  },
  DataModelFieldDelete: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey',
    description: '删除字段',
  },
  DataModelFieldDataClone: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey/clone-data',
    description: '字段克隆',
  },
  DataModelFieldActionCreate: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey/action',
    description: '添加字段动作',
  },
  DataModelFieldActionUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey/action/:actionId',
    description: '修改字段动作',
  },
  DataModelFieldActionDelete: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/field/:fieldKey/action/:actionId',
    description: '修改字段动作',
  },
  DataModelBroadcastUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/update-broadcast-fields',
    description: '编辑需要展示的是否广播字段',
  },
  DataDisplayColumnUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/update-detail-display-fields',
    description: '编辑要展示在预览页中的字段',
  },
  DataModelDisplayColumnListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/data-display-column/:displayScope',
    description: '获取要展示在预览页中的字段列表',
  },
}

const ModelGroupApis = {
  ModelLinkedGroupListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/linked-group',
    description: '获取模型相关用户组列表',
  },
}

const ModelClientApis = {
  ModelAuthClientListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/auth-client',
    description: '获取模型 API 访问者列表',
  },
  ModelAuthClientListUpdate: {
    method: 'PUT',
    route: '/api/v2/general-data/:modelKey/auth-client',
    description: '更新模型 API 访问者列表',
  },
  ModelAuthClientDelete: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/auth-client/:appid',
    description: '移除模型 API 访问者',
  },
}

const ModelIndexApis = {
  DataModelColumnIndexListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/column-index',
    description: '获取模型列索引列表',
  },
  DataModelColumnIndexCreate: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/column-index/:fieldKey',
    description: '创建模型索引',
  },
  DataModelColumnIndexDrop: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/column-index/:fieldKey',
    description: '移除模型索引',
  },
}

const ModelMilestoneApis = {
  ModelMilestoneListGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/milestone',
    description: '获取模型元信息版本列表',
  },
  ModelMilestoneCreate: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/milestone',
    description: '创建模型元信息版本',
  },
  ModelMilestoneImport: {
    method: 'POST',
    route: '/api/v2/general-data/:modelKey/milestone-import',
    description: '导入模型元信息版本',
  },
  ModelMilestoneDelete: {
    method: 'DELETE',
    route: '/api/v2/general-data/:modelKey/milestone/:tagName',
    description: '删除模型元信息版本',
  },
  ModelMasterMetadataGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/milestone/master/full-metadata',
    description: 'master 版本完整元信息获取',
  },
  ModelMilestoneMetadataGet: {
    method: 'GET',
    route: '/api/v2/general-data/:modelKey/milestone/:tagName/full-metadata',
    description: '指定版本完整元信息获取',
  },
}

export const GeneralDataApis = {
  ...DataModelApis,
  ...ModelFieldApis,
  ...ModelGroupApis,
  ...ModelIndexApis,
  ...ModelClientApis,
  ...ModelMilestoneApis,
}
