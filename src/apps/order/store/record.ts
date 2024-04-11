import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import { getOrderRecord, getProductStock, updateStockRecords } from '../../../api'
import { useRecordId, useAppId } from '../../../composables/useRecord'

export type convertedObject = { [key: string]: number }

/**
 * 1. 先取得當前的 record，並將該筆的所有訂單名稱轉成 object 如下：
 * {
 *   'iPhone 15 Pro': 12,
 *   'AirPods Pr': 12,
 * }
 * 
 * 2. 接著取得「庫存管理」應用程式的庫存，同樣轉成上面的格式
 * 3. 開始流程管理後，比對兩個 object 的數量，進行邏輯判斷
 * 4. 如果沒出錯，扣除庫存管理的數量
*/

export const useOrderRecordStore = defineStore('order', () => {
  let recordId: number | null
  let appId: number | null

  let currentOrderRecord: kintoneTypes.Order | null
  let productsAmount: convertedObject | null

  // 處理庫存
  let stockRecords: kintoneTypes.Stock | null
  let stockAmount: convertedObject | null

  // 取得當前的訂單 record
  const getCurrentOrderRecord = async () => {
    try {
      const response = await getOrderRecord(appId!, recordId!)
      currentOrderRecord = response.record
    } catch (e) {
      console.log(e)
    }
  }

  // 從訂單中獲取產品數量並轉換為物件
  const getProductAmount = (order: kintoneTypes.Order) => {
    const products: convertedObject = {}

    for (const item of order.table.value) {
      const { productName, productAmount } = item.value
      const name = productName.value
      const amount = Number(productAmount.value)
      products[name] = amount
    }

    return products
  }

  // 取得庫存管理的數量
  const getStockRecords = async () => {
    try {

      const query = Object.keys(productsAmount!)
        .map((item: string) => {
          return `"${item}"`
        })
        .join(', ')

      const fullQuery = `productName in (${query})`
      stockRecords = await getProductStock(fullQuery)
    } catch (e) {
      console.log(e)
    }
  }

  // 從庫存中獲取產品數量並轉換為物件
  const convertStockRecords = (stockRecords: kintoneTypes.Stock) => {
    let stock: convertedObject = {}

    for (const item of stockRecords.records) {
      const { productName, productStock } = item

      const name = productName?.value
      const amount = Number(productStock?.value)
      stock[name!] = amount
    }
    return stock
  }

  // 檢查庫存是否足夠
  const checkStock = <T extends convertedObject>(order: T, stock: T): boolean => {
    return Object.keys(order).some((productName: string) => {
      const isEnough = order[productName] > stock[productName]
      if (isEnough) {
        toast.error(`「${productName}」庫存數量不足，請重新檢查`, {
          position: 'bottom-right',
          autoClose: 5000,
        })
      }
      return isEnough
    })
  }

  // 更新庫存的數量
  const updateStock = async () => {
    try {
      const result = stockRecords!.records.map((item: kintoneTypes.Stock) => {
        const productName = item.productName?.value
        const stockAmount = Number(item.productStock?.value)
        const stock = String(stockAmount - (productsAmount![productName!] ?? 0))

        return {
          id: item.$id?.value,
          record: {
            productStock: {
              value: stock,
            },
          },
        }
      })
      await updateStockRecords(result)
    } catch (e) {
      console.log(e)
    }
  }

  // 封裝所有 fn
  const getCurrentOrderAndStockRecors = async (): Promise<{ productsAmount: convertedObject; stockAmount: convertedObject }> => {
    try {
      await getCurrentOrderRecord()
      productsAmount = getProductAmount(currentOrderRecord!)
      await getStockRecords()
      stockAmount = convertStockRecords(stockRecords!)
      return { productsAmount, stockAmount }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  onBeforeMount(async () => {
    recordId = useRecordId()
    appId = useAppId()
  })

  return { getCurrentOrderAndStockRecors, checkStock, updateStock }
})
