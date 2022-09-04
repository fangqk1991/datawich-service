import { SwaggerDocItem } from '@fangcha/router/src/main/SwaggerDocItem'
import { GeneralDataSpecs } from './general-data'
import { DataAppSpecs } from './data-app'
import { ModelUserSpecs } from './model-user'
import { CommonGroupSpecs } from './common-group'
export * from './general-data'
export * from './model-user'
export * from './common-group'
export * from './data-app'

export const DatawichSwaggerDocItems: SwaggerDocItem[] = [
  {
    name: 'General Data',
    pageURL: '/api-docs/v1/general-data',
    specs: GeneralDataSpecs,
  },
  {
    name: 'Data App',
    pageURL: '/api-docs/v1/data-app',
    specs: DataAppSpecs,
  },
  {
    name: 'Model User',
    pageURL: '/api-docs/v1/model-user',
    specs: ModelUserSpecs,
  },
  {
    name: '通用用户组',
    pageURL: '/api-docs/v1/common-group',
    specs: CommonGroupSpecs,
  },
]
