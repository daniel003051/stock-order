import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const requestStock = new KintoneRestAPIClient({
  auth: { apiToken: import.meta.env.VITE_STOCK_API_KEY },
});

// 取得產品庫存
export const getProductStock = (query: string) =>
  requestStock.record.getRecords<kintoneTypes.Stock>({
    app: '55',
    fields: ['$id', 'productName', 'productStock'],
    query: query
  })

export const updateStockRecords = (records: any) => requestStock.record.updateRecords({
  app: '55',
  records
})