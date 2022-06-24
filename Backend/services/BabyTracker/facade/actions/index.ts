export const isTheactionOnRecording = (action: actionType) => action.actionStart > 0 && !action.actionEnd

interface actionType {
  actionId: number
  actionStart: number | null
  actionEnd: number | null
}
