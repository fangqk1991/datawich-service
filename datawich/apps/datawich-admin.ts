import { FangchaApp } from '@fangcha/backend-kit'
import { DatawichAdminRouterPlugin } from './admin/DatawichAdminRouterPlugin'
import { _DatawichService } from '../../src'
import { MyDatabase } from '../services/MyDatabase'
import { TypicalSsoSdkPlugin } from '@fangcha/backend-kit/lib/sso'
import { DatawichConfig } from '../DatawichConfig'

const app = new FangchaApp({
  env: 'development',
  appName: 'datawich-admin',
  plugins: [DatawichAdminRouterPlugin, TypicalSsoSdkPlugin(DatawichConfig.adminSSO)],

  appDidLoad: async () => {
    _DatawichService.init({
      database: MyDatabase.datawichDB,
    })
  },
})
app.launch()
