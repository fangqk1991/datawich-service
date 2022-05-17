import { DatawichProxy } from './DatawichProxy'
import { AliyunOSS } from '@fangcha/ali-oss'

export interface DatawichServiceOptions {
  proxy: DatawichProxy
  ossForSignature?: AliyunOSS
}

class _DatawichService {
  public proxy!: DatawichProxy
  public ossForSignature!: AliyunOSS

  public initOptions(options: DatawichServiceOptions) {
    this.proxy = options.proxy
    if (options.ossForSignature) {
      this.ossForSignature = options.ossForSignature
    }
    return this
  }

  public initProxy(proxy: DatawichProxy) {
    this.proxy = proxy
    return this
  }
}

export const DatawichService = new _DatawichService()
