//3600 means gmt+1
export const getDateNowTimestampInSeconds = () => Date.now() / 1000 + 3600
