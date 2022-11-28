import { TypicalSsoSdkPlugin } from '@fangcha/backend-kit/lib/sso'
import { DatawichConfig } from '../DatawichConfig'
import { DatawichOssPlugin } from '../services/DatawichOssPlugin'
import { WebApp } from '@fangcha/backend-kit/lib/router'

const app = new WebApp({
  env: 'development',
  appName: 'datawich-admin',
  useJwtSpecs: true,
  routerOptions: {
    baseURL: DatawichConfig.adminBaseURL,
    jwtProtocol: {
      jwtKey: 'datawich_token_jwt',
      jwtSecret: 'datawich_secret',
    },
    backendPort: DatawichConfig.adminPort,
  },
  plugins: [TypicalSsoSdkPlugin(DatawichConfig.adminSSO), DatawichOssPlugin],

  appDidLoad: async () => {},
})
app.launch()
