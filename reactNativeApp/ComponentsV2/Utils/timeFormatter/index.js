export const timestampSecondsToFormattedDateTime = (timestampInSeconds) => {
  if (timestampInSeconds === 0) return 'Select a date'
  const d = new Date(timestampInSeconds * 1000 - 7200000)

  const curr_date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()

  const curr_month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1

  const curr_year = d.getFullYear()

  const curr_hours = d.getHours()

  const curr_minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()

  const curr_seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()

  const time = `${curr_year}-${curr_month}-${curr_date}  ${curr_hours}:${curr_minutes}:${curr_seconds}`

  return time
}

export const getDatePickerInitialDateFormat = (timeStamp) => {
  const d = new Date(timeStamp * 1000)

  const curr_date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()

  const curr_month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1

  const curr_year = d.getFullYear()

  const date = `${curr_year}-${curr_month}-${curr_date}`

  console.log(date)
  return date
}

export const getDifferentFromTimestamp = (timestampInSeconds) => {
  console.log(timestampInSeconds)
  const lastActionTimestamp = timestampInSeconds

  const actualTimeStamp = Math.round(Date.now() / 1000 + 7200)
  console.log(actualTimeStamp)

  const different = actualTimeStamp - lastActionTimestamp - 3600

  const d = new Date(different * 1000)

  const curr_date = Number(d.getDate())

  if (curr_date > 1) return 'More than one day.'

  const curr_hours = d.getHours()

  const curr_minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()

  const curr_seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()

  const time = ` ${curr_hours}:${curr_minutes}:${curr_seconds}`

  return time
}
