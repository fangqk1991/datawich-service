import { RouterSdkPlugin } from '@fangcha/router/lib/sdk'
import { RouterApp } from '@fangcha/router'
import { DatawichSwaggerDocItems } from '../../../src/specs'
import { TempLoginSpecDocItem } from './TempLoginSpecs'
import { KitProfileSpecDocItem } from '@fangcha/backend-kit/lib/profile'
import { GlobalAppConfig } from '@fangcha/config'

const routerApp = new RouterApp({
  baseURL: GlobalAppConfig.adminBaseURL,
  useHealthSpecs: true,
  docItems: [...DatawichSwaggerDocItems, KitProfileSpecDocItem, TempLoginSpecDocItem],
})

export const DatawichAdminRouterPlugin = RouterSdkPlugin({
  baseURL: GlobalAppConfig.adminBaseURL,
  jwtProtocol: {
    jwtKey: 'datawich_token_jwt',
    jwtSecret: 'datawich_secret',
  },

  backendPort: GlobalAppConfig.adminPort,
  routerApp: routerApp,
})
