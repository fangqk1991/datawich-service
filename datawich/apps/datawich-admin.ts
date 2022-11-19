import { _DatawichService } from '../../src'
import { MyDatabase } from '../services/MyDatabase'
import { TypicalSsoSdkPlugin } from '@fangcha/backend-kit/lib/sso'
import { DatawichConfig } from '../DatawichConfig'
import { DatawichOssPlugin } from '../services/DatawichOssPlugin'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { DatawichSwaggerDocItems } from '../../src/specs'

const app = new WebApp({
  env: 'development',
  appName: 'datawich-admin',
  useJwtSpecs: true,
  mainDocItems: DatawichSwaggerDocItems,
  routerOptions: {
    baseURL: DatawichConfig.adminBaseURL,
    jwtProtocol: {
      jwtKey: 'datawich_token_jwt',
      jwtSecret: 'datawich_secret',
    },
    backendPort: DatawichConfig.adminPort,
  },
  plugins: [TypicalSsoSdkPlugin(DatawichConfig.adminSSO), DatawichOssPlugin],

  appDidLoad: async () => {
    _DatawichService.init({
      database: MyDatabase.datawichDB,
    })
  },
})
app.launch()
