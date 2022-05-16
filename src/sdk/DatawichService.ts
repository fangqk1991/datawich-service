import { DatawichProxy } from './DatawichProxy'

class _DatawichService {
  public proxy!: DatawichProxy

  public initProxy(proxy: DatawichProxy) {
    this.proxy = proxy
    return this
  }
}

export const DatawichService = new _DatawichService()
