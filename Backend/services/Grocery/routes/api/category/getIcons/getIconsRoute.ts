import { ResponseToolkit, Request } from 'hapi'

export const getIconsRoute = {
  method: 'get',
  path: '/api/category/geticons',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const iconsArray = ['baby', 'spray-can', 'money-bill-alt', 'gift', 'tshirt', 'house-user', 'xbox', 'node']

    return iconsArray
  },
}
