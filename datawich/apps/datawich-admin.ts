import { FangchaApp } from '@fangcha/backend-kit'
import { DatawichAdminRouterPlugin } from './admin/DatawichAdminRouterPlugin'
import { _DatawichService } from '../../src'
import { MyDatabase } from '../services/MyDatabase'
import { TypicalSsoSdkPlugin } from '@fangcha/backend-kit/lib/sso'
import { DatawichConfig } from '../DatawichConfig'
import { DatawichOssPlugin } from '../services/DatawichOssPlugin'

const app = new FangchaApp({
  env: 'development',
  appName: 'datawich-admin',
  plugins: [DatawichAdminRouterPlugin, TypicalSsoSdkPlugin(DatawichConfig.adminSSO), DatawichOssPlugin],

  appDidLoad: async () => {
    _DatawichService.init({
      database: MyDatabase.datawichDB,
    })
  },
})
app.launch()
