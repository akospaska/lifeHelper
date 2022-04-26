export interface joiErrorDetail {
  message: string
  path: string[]
  type: string
  context: [joiErrorDetailContext]
}

export interface joiErrorDetailContext {
  limit: number
  value: string
  label: string
  key: string
}
