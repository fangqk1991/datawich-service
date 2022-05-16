import { SwaggerDocItem } from '@fangcha/router'
import { SdkDatawichSpecs } from './SdkDatawichSpecs'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { DatawichProxy, DatawichService } from '../sdk'

export const DatawichSpecDocItem: SwaggerDocItem = {
  name: 'Datawich SDK 相关',
  pageURL: '/api-docs/v1/datawich-sdk',
  specs: SdkDatawichSpecs,
}

export const DatawichSdkPlugin = (proxy: DatawichProxy): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      DatawichService.initProxy(proxy)
    },
    specDocItem: DatawichSpecDocItem,
  }
}
