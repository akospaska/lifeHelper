export const cookieParser = (request) => {
  const splittedCookies = request.headers.cookie.split(';')

  const lifeHelperRawCookie = splittedCookies.filter((a) => a.includes('lifeHelperSession'))[0]

  const sessionValue = lifeHelperRawCookie.split('=')[1]

  return sessionValue
}
