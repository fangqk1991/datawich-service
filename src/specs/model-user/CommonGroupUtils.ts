import { Context } from 'koa'
import assert from '@fangcha/assert'
import { GroupLevel } from '@fangcha/general-group'
import { _DatawichService } from '../../services/_DatawichService'
import { FangchaSession } from '@fangcha/backend-kit'

export const prepareGroup = async (ctx: Context, forEditing = false) => {
  const group = await _DatawichService.groupApp.findGroup(ctx.params.groupId)
  assert.ok(!!group, '用户组不存在')
  const session = ctx.session as FangchaSession
  const member = await group.findMember(session.curUserStr())
  if (group.groupLevel === GroupLevel.Private) {
    assert.ok(!!member, '您不在该组中，无权查看', 403)
  }
  if (forEditing && group.groupLevel !== GroupLevel.Public) {
    assert.ok(!!member, '您不在该组中，无权编辑', 403)
    assert.ok(!!member?.isAdmin, '只有管理员才能进行编辑操作', 403)
  }
  return group
}

export const prepareGroupAndMember = async (ctx: Context) => {
  const group = await prepareGroup(ctx, true)
  const member = await group.findMember(ctx.params.email)
  assert.ok(!!member, '成员不存在')
  return {
    group: group,
    member: member,
  }
}
