import { OpenDataModelApis } from '../open-api'
import { Api } from '@fangcha/swagger'

export const SdkDatawichApis = {
  ...OpenDataModelApis,
}

for (const key of Object.keys(SdkDatawichApis)) {
  const apiOptions = SdkDatawichApis[key] as Api
  SdkDatawichApis[key] = {
    ...apiOptions,
    route: apiOptions.route.replace(/^\/api\//, '/api/datawich-sdk/'),
  }
}
