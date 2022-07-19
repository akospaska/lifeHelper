import { actionTableType } from '../../../dataAccessLayer/statistics/statistics'
import { calculateFormattedDuration, getFormattedHourAndMinutes } from '../../../utils/Time'

export const formatStatistics = (statistics: actionTableType[]) => {
  //extend statistics with calculated duration startTime and endTime
  statistics.map((a) => {
    a['duration'] = a.actionStart && a.actionEnd ? calculateFormattedDuration(a.actionStart, a.actionEnd) : null
    a['startTime'] = a.actionStart ? getFormattedHourAndMinutes(a.actionStart) : null
    a['endTime'] = a.actionEnd ? getFormattedHourAndMinutes(a.actionEnd) : null
  })

  let finalFormattedResult = formatter(statistics)

  return finalFormattedResult
}

const formatter = (statistics: actionTableType[]) => {
  let days = []

  //extract all the days into the days array
  statistics.forEach((statistic) => {
    let originalDate = statistic.creationDate
    //if something wrong than i should modify here about the date
    originalDate.setHours(originalDate.getHours() + 2)
    const day = originalDate.getDate()

    if (!days.includes(day)) {
      days.push(day)
    }
  })

  const groupEdByDayArray = days.map((a) => {
    let dayCollectorArray = []

    statistics.map((data) => {
      let originalDate = data.creationDate
      originalDate.setHours(originalDate.getHours())
      const dayOfTheMonth = originalDate.getDate()

      if (dayOfTheMonth === a) {
        dayCollectorArray.push(data)
      }
    })
    return dayCollectorArray
  })

  let finalResult = []
  groupEdByDayArray.map((a, b) => {
    const creationDate = a[0].creationDate

    const year = creationDate.getFullYear()
    // 👇️ getMonth returns integer from 0(January) to 11(December)
    const month = creationDate.getMonth() + 1
    const day = creationDate.getDate()

    const withSlashes = [year, month, day].join('/')

    finalResult.push({ date: withSlashes, data: a })
  })
  return finalResult
}
