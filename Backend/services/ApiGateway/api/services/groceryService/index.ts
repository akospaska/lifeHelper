const axios = require('axios')

export const groceryServiceApi = axios.create({
  baseURL: `http://${process.env.GROCERY_SERVICE_HOST}:${process.env.GROCERY_SERVICE_PORT}/`,
})
