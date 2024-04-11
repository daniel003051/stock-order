export const useRecordId = () => {
  return kintone.app.record.getId()
}

export const useRelatedAppId = (relateName: string) => {
  return kintone.app.getRelatedRecordsTargetAppId(relateName) 
}

export const useAppId = () => {
  return kintone.app.getId()
}