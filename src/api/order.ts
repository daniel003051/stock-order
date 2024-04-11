import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const appId = kintone.app.getId()!
const requestOrder = new KintoneRestAPIClient({
  auth: { apiToken: import.meta.env.VITE_ORDER_API_KEY },
});

export const getOrderRecord = (appId: number, recordId: number) => requestOrder.record.getRecord<kintoneTypes.Order>({
  app: appId, id: recordId
})

export const getOrderRecords = (params: {
    app: string
    fields?: string[];
    query?: string;
  }) =>
  requestOrder.record.getRecords<kintoneTypes.Order>({
    ...params
  });

export const updateRecordById = (recordId: number, record: kintoneTypes.Order) =>
  requestOrder.record.updateRecord({
    app: '54',
    id: recordId,
    record    
  });
