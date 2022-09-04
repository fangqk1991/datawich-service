import * as jsonwebtoken from 'jsonwebtoken'
import { SpecFactory, SwaggerDocItem } from '@fangcha/router'
import { _SessionApp, FangchaSession } from '@fangcha/router/lib/session'
import { KitSsoApis } from '@fangcha/backend-kit/lib/apis'

const factory = new SpecFactory('SSO', { skipAuth: true })

factory.prepare(KitSsoApis.Login, async (ctx) => {
  const aliveSeconds = 24 * 3600
  const session = ctx.session as FangchaSession
  const jwt = jsonwebtoken.sign({ email: 'user@example.com' }, _SessionApp.jwtProtocol.jwtSecret, {
    expiresIn: aliveSeconds,
  })
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, jwt, { maxAge: aliveSeconds * 1000 })
  ctx.redirect(session.getRefererUrl())
})

factory.prepare(KitSsoApis.Logout, async (ctx) => {
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, '', {
    maxAge: 0,
  })
  const session = ctx.session as FangchaSession
  ctx.redirect(session.getRefererUrl())
})

export const TempLoginSpecs = factory.buildSpecs()

export const TempLoginSpecDocItem: SwaggerDocItem = {
  name: 'Temp Login',
  pageURL: '/api-docs/v1/temp-login',
  specs: TempLoginSpecs,
}
