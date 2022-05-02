import { makeUUID } from '@fangcha/tools'
import { AliyunOSS } from '@fangcha/ali-oss'
import { DataPluginProtocol } from './ModelPluginProtocol'

class __DatawichService {
  public version = '0.0.1'
  public downloadRootDir = '/tmp'
  public ossForSignature!: AliyunOSS
  public plugins: DataPluginProtocol[] = []

  public generateRandomTmpPath() {
    return `${this.downloadRootDir}/${makeUUID()}`
  }
}

export const _DatawichService = new __DatawichService()
