import { RouterSdkPlugin } from '@fangcha/router/lib/sdk'
import { DatawichConfig } from '../../config'
import { HealthSpecs, RouterApp } from '@fangcha/router'
import { DatawichSwaggerDocItems } from '../../../src/specs'
import { TempLoginSpecDocItem } from './TempLoginSpecs'
import { KitProfileSpecDocItem } from '@fangcha/backend-kit/lib/profile'

const routerApp = new RouterApp({
  baseURL: DatawichConfig.adminBaseURL,
  docItems: [
    {
      name: '健康检查',
      pageURL: '/api-docs/v1/health',
      specs: HealthSpecs,
    },
    ...DatawichSwaggerDocItems,
    KitProfileSpecDocItem,
    TempLoginSpecDocItem,
  ],
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
