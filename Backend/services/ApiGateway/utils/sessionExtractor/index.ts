export const sessionExtractor = (request) => {
  try {
    const splittedCookiesArray: string[] = request.headers.cookie.split(';')

    const lifeHelperRawCookie: string = splittedCookiesArray.filter((a) => a.includes('lifeHelperSession'))[0]

    const sessionValue = lifeHelperRawCookie.split('=')[1]

    return sessionValue
  } catch (error) {
    return null
  }
}
