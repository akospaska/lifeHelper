import { childTableType } from '../../dataAccessLayer/children'
import { weightTableType } from '../../dataAccessLayer/childWeight'
import { getChildWeightsType } from '../../facade/childWeight'
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

export const getYYMMDDFromDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

  return `${year}-${month}-${day}`
}

export const getFormattedHourAndMinutes = (timeStampInSeconds: number) => {
  const time = new Date(timeStampInSeconds * 1000)

  const hours = time.getHours()

  const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
  const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()

  const result = `${hours === 0 ? `` : `${hours}:`}${minutes}:${seconds}`

  return result
}

export const roundTimeStampToDate = (timestampInSeconds: number) => {
  const d = new Date((timestampInSeconds + 7200) * 1000)

  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)

  return d.getTime() / 1000
}

export const addFormattedDateProperty = (data: weightTableType[]) => {
  data.map((a) => (a.formattedDate = getYYMMDDFromDate(new Date((a.date + validatedServerVariables.timeDifferentGmt) * 1000))))
  return data
}
