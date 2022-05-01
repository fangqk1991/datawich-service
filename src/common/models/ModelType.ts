import { Descriptor } from '@fangcha/tools'

export enum ModelType {
  NormalModel = 'NormalModel',
  ContentModel = 'ContentModel',
  DatahubModel = 'DatahubModel',
}

const values = [ModelType.NormalModel, ModelType.ContentModel, ModelType.DatahubModel]

const describe = (code: ModelType) => {
  switch (code) {
    case ModelType.NormalModel:
      return '常规上报模型'
    case ModelType.ContentModel:
      return '内容管理模型'
    case ModelType.DatahubModel:
      return '外部数据源'
  }
  return 'Unknown'
}

export const ModelTypeDescriptor = new Descriptor(values, describe)
