import { RouterSdkPlugin } from '@fangcha/router/lib/sdk'
import { RouterApp } from '@fangcha/router'
import { DatawichSwaggerDocItems } from '../../../src/specs'
import { KitProfileSpecDocItem } from '@fangcha/backend-kit/lib/profile'
import { DatawichConfig } from '../../DatawichConfig'

const routerApp = new RouterApp({
  baseURL: DatawichConfig.adminBaseURL,
  useHealthSpecs: true,
  docItems: [...DatawichSwaggerDocItems, KitProfileSpecDocItem],
})

export const DatawichAdminRouterPlugin = RouterSdkPlugin({
  baseURL: DatawichConfig.adminBaseURL,
  jwtProtocol: {
    jwtKey: 'datawich_token_jwt',
    jwtSecret: 'datawich_secret',
  },

  backendPort: DatawichConfig.adminPort,
  routerApp: routerApp,
})
