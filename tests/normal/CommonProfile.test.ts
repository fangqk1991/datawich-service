import * as assert from 'assert'
import { DiffMapper } from '@fangcha/tools'
import { _CommonProfile } from '../..'
import { initGeneralDataSettingsTest } from '../GeneralDataServiceDev'
import { ProfileEvent } from '../../src/common/models'

initGeneralDataSettingsTest()

describe('Test CommonProfile', () => {
  it(`Test makeProfile / updateProfile`, async () => {
    const profile = await _CommonProfile.makeProfile('fangquankun', ProfileEvent.UserModelAppDisplay, 'demo')
    assert.ok(!!profile)
    assert.ok(typeof profile.profileData() === 'object')
    const profileAfter = {
      hiddenFieldsMap: {
        work_date: true,
        work_type: true,
      },
    }
    await profile.updateProfile(profileAfter)
    assert.ok(DiffMapper.checkEquals(profileAfter, profile.profileData()))
  })
})
