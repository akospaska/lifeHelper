const sha512 = require('js-sha512')

export const stringToSHA512 = (password: string): string => {
  //transform the input value into a sha512 hashed string
  return sha512(password)
}

export const generateRandomHashValue = (): string => {
  let hashValue = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (var i = 0; i < 5000; i++) {
    hashValue += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return stringToSHA512(hashValue)
}
