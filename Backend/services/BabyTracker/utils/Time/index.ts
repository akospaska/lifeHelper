import { validatedServerVariables } from '../../validation/server'

const { timeDifferentGmt } = validatedServerVariables

export const getDateNowTimestampInSeconds = () => Date.now() / 1000 + timeDifferentGmt

export const calculateFormattedDuration = (startTimeStamp: number, endTimeStamp: number) => {
  const differentInSeconds = endTimeStamp - startTimeStamp

  const timer = new Date(differentInSeconds * 1000)

  const hours = timer.getHours()

  const minutes = timer.getMinutes() < 10 ? `0${timer.getMinutes()}` : timer.getMinutes()
  const seconds = timer.getSeconds() < 10 ? `0${timer.getSeconds()}` : timer.getSeconds()

  const result = `${hours === 0 ? `` : `${hours}:`}${minutes}:${seconds}`

  return result
}

export const getFormattedHourAndMinutes = (timeStampInSeconds: number) => {
  const time = new Date(timeStampInSeconds * 1000)

  const hours = time.getHours()

  const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
  const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()

  const result = `${hours === 0 ? `` : `${hours}:`}${minutes}:${seconds}`

  return result
}
