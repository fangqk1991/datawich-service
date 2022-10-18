import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { GlobalAppConfig } from '@fangcha/config'

FCDatabase.instanceWithName('datawichDB').init(new DBOptionsBuilder(GlobalAppConfig.mysql.datawichDB).build())

export const MyDatabase = {
  datawichDB: FCDatabase.instanceWithName('datawichDB'),
}
