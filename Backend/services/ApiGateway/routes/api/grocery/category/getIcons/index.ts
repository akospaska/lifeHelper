import { AxiosResponse } from 'axios'
import { ResponseToolkit, Request } from 'hapi'

import { groceryServiceApi } from '../../../../../api/services/groceryService'

export const getIconsRoute = {
  method: 'get',
  path: '/api/grocery/category/geticons',
  options: {
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      const axiosResponse: AxiosResponse = await groceryServiceApi.get('api/category/geticons')
      return axiosResponse.data
    },
  },
}
