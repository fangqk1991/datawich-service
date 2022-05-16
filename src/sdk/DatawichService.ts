import { BasicAuthConfig } from '@fangcha/tools'

class _DatawichService {
  public datawichOptions!: BasicAuthConfig

  public initOptions(options: BasicAuthConfig) {
    this.datawichOptions = options
    return this
  }
}

export const DatawichService = new _DatawichService()
