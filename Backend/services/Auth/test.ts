import * as Hapi from '@hapi/hapi'
const server = Hapi.server({ port: 1025 })

const scheme = function (server, options) {
  return {
    authenticate: function (request, h) {
      const req = request.raw.req
      const authorization = req.headers
      //get the sessionCookie
      console.log(authorization)

      return h.authenticated({ credentials: { user: 'john' } })
    },
  }
}

server.auth.scheme('authenticationBySession', scheme)
server.auth.strategy('default', 'authenticationBySession')

server.route({
  method: 'GET',
  path: '/',
  options: {
    auth: 'default',
    handler: function (request, h) {
      return request.auth.credentials.user
    },
  },
})

console.log('I was here')

export const serverInit = async () => {
  server.route([{ method: 'POST', path: '/test', handler: () => 'ok' }])

  server.ext({
    type: 'onPostAuth',
    method: function (request, h) {
      //do something before every response send

      /* console.log('I am in onPostAuth')

      console.log(request.payload)

      request.payload['kiscica'] = 'kismacska'

      console.log(request.payload)
*/

      console.log(Object.keys(request))

      console.log(request['auth'])

      console.log('I was after the auth')
      return h.continue
    },
  })

  await server.start()
  console.log(`I am the test server`)

  return server
}

serverInit()
