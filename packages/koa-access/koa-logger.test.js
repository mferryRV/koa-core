/* global describe, beforeEach, it, expect */
import logger, { eventAccess } from './koa-logger'
import EventEmitter from 'events'

describe(`koa-logger.js`, () => {
  describe(`when used as a Koa middleware`, () => {
    let ctx
    beforeEach(() => { ctx = { request: {}, response: {}, app: new EventEmitter() } })

    it('should have the desired properties', (done) => {
      const l = logger()

      ctx.app.on(eventAccess, ({ req, res }) => {
        expect(req).toBeDefined()
        expect(res).toBeDefined()
        done()
      })

      l(ctx, () => {})
    })

    it('should read other properties from an array', (done) => {
      const l = logger([ 'id' ])
      ctx = { ...ctx, state: { id: '12345-67890' } }

      ctx.app.on(eventAccess, ({ id }) => {
        expect(id).toEqual('12345-67890')
        done()
      })

      l(ctx, () => {})
    })

    it('should read other properties from a function', (done) => {
      const l = logger(({ a }) => ({ A: a * a, a }))
      ctx = { ...ctx, a: 5 }

      ctx.app.on(eventAccess, ({ A, a }) => {
        expect(A).toEqual(25)
        expect(a).toEqual(5)
        done()
      })

      l(ctx, () => {})
    })
  })
})
