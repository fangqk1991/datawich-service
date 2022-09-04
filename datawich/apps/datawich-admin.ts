import { FangchaApp } from '@fangcha/backend-kit'
import { DatawichAdminRouterPlugin } from './admin/DatawichAdminRouterPlugin'
import { _DatawichService } from '../../src'
import { MyDatabase } from '../services/MyDatabase'

const app = new FangchaApp({
  env: 'development',
  appName: 'datawich-admin',
  plugins: [DatawichAdminRouterPlugin],

  appDidLoad: async () => {
    _DatawichService.init({
      database: MyDatabase.datawichDB,
    })
  },
})
app.launch()
