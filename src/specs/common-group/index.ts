import assert from '@fangcha/assert'
import { prepareGroup, prepareGroupAndMember } from './CommonGroupUtils'
import { SpecFactory } from '@fangcha/router'
import { CommonGroupApis } from '../../common/web-api'

const factory = new SpecFactory('通用用户组')

factory.prepare(CommonGroupApis.GroupInfoUpdate, async (ctx) => {
  const group = await prepareGroup(ctx, true)
  await group.updateInfo(ctx.request.body)
  ctx.body = group.fc_pureModel()
})

factory.prepare(CommonGroupApis.GroupMemberListGet, async (ctx) => {
  const group = await prepareGroup(ctx)
  const feeds = await group.getMembers()
  feeds.sort((item1, item2) => {
    if (item1.isAdmin !== item2.isAdmin) {
      return item1.isAdmin > item2.isAdmin ? -1 : 1
    }
    return item1.member.localeCompare(item2.member)
  })
  ctx.body = feeds.map((feed) => feed.fc_pureModel())
})

factory.prepare(CommonGroupApis.GroupMemberAdd, async (ctx) => {
  const { emailList } = ctx.request.body
  const group = await prepareGroup(ctx, true)
  await group.addMultipleMembers(emailList)
  ctx.status = 200
})

factory.prepare(CommonGroupApis.GroupMemberUpdate, async (ctx) => {
  const { member } = await prepareGroupAndMember(ctx)
  const { isAdmin } = ctx.request.body
  assert.ok([0, 1].includes(isAdmin), 'isAdmin 需要为 0 或 1')
  await member.updateLevel(isAdmin)
  ctx.status = 200
})

factory.prepare(CommonGroupApis.GroupMemberRemove, async (ctx) => {
  const { group, member } = await prepareGroupAndMember(ctx)
  await group.removeMember(member.member)
  ctx.status = 200
})

factory.prepare(CommonGroupApis.GroupPermissionListGet, async (ctx) => {
  const group = await prepareGroup(ctx)
  const feeds = await group.getPermissions()
  ctx.body = feeds.map((feed) => feed.fc_pureModel())
})

export const CommonGroupSpecs = factory.buildSpecs()
