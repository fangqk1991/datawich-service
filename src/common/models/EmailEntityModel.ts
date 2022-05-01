interface SimpleUser {
  iamId: number
  name: string
  email: string
}

export interface EmailEntityModel {
  title: string
  contentTemplate: string
  // TODO: 统一 receiverList、ccReceiverList 类型为 string[]
  receiverList: SimpleUser[]
  ccReceiverList: string[]
}
