import { SpecFactory, SwaggerDocItem } from '@fangcha/router'
import { SdkDatawichSpecs } from './SdkDatawichSpecs'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { DatawichProxy, DatawichService } from '../sdk'
import { DatawichSystemInfo } from '../common/models'
import { SdkDatawichApis2 } from '../common/sdk-api'

const factory = new SpecFactory('Datawich SDK 相关')
factory.prepare(SdkDatawichApis2.SystemInfoGet, async (ctx) => {
  ctx.body = {
    modelStructureBaseURL: `${DatawichService.proxy.baseURL()}/v2/data-model/:modelKey?curTab=fragment-model-structure`,
  } as DatawichSystemInfo
})

export const DatawichSpecDocItem: SwaggerDocItem = {
  name: 'Datawich SDK 相关',
  pageURL: '/api-docs/v1/datawich-sdk',
  specs: [...factory.buildSpecs(), ...SdkDatawichSpecs],
}

export const DatawichSdkPlugin = (proxy: DatawichProxy): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      DatawichService.initProxy(proxy)
    },
    specDocItem: DatawichSpecDocItem,
  }
}
