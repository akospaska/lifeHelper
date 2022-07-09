import { Box } from 'native-base'

export const revealFetchError = (message, statusCode, toast) =>
  toast.show({
    render: () => {
      return (
        <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
          {`${message} -- ${statusCode}`}
        </Box>
      )
    },
  })

export const displayErrorMessageByErrorStatusCode = (toast, statusCode) => {
  switch (Number(statusCode)) {
    case 400:
      revealFetchError('Bad Request', 400, toast)
      break
    case 403:
      revealFetchError('Access Denied!', 403, toast)
      break
    case 405:
      revealFetchError('Method not allowed!', 405, toast)
      break
    case 500:
      revealFetchError('Fatal Error Yolo!', 500, toast)
      break

    default:
      revealFetchError('Unexpected Error!', 418, toast)
      break
  }
}
