import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const appId = kintone.app.getId()!
const requestCustomer = new KintoneRestAPIClient({
  auth: { apiToken: import.meta.env.VITE_CUSTOMER_API_KEY },
});

export const getCustomerRecord = (recordId: number) => requestCustomer.record.getRecord({
  app: appId, id: recordId
})
