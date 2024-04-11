<script setup lang="ts">
import { useRecordId, useRelatedAppId } from '../../composables/useRecord'
import { getCustomerRecord, getOrderRecords } from '../../api'
import { onMounted, ref, nextTick } from 'vue'

let recordId: number | null = null
let relatedAppId: string | null = null
const totalOrderPrice = ref<number>(0)
const calculating = ref<boolean>(true)

/**
 * 取得指定記錄的公司名稱。
 * @async
 * @function getCompanyName
 * @returns {Promise<string>} 返回一個 Promise，解析值是公司名稱。
 * @throws {Error} 如果發生錯誤，將拋出一個錯誤。
*/
const getCompanyName = async () => {
  try {
    const response = await getCustomerRecord(recordId!)
    console.log(response)
    return response.record.companyName.value
  } catch (e) {
    console.error(e)
    throw new Error('無法獲取公司名稱。')
  }
}

// 計算關聯紀錄清單的總價格
const calcTotalOrderPrice = async () => {
  try {
    const companyName = await getCompanyName()
    await nextTick()
    console.log(useRelatedAppId('orderTable'))
    const response = await getOrderRecords({
      app: '54',
      fields: ['orderTotalPrice'],
      query: `companyName = "${companyName}"`
    })

    totalOrderPrice.value = response.records.reduce((prev, curr) => {
      const price = parseInt(curr.orderTotalPrice!.value)
      return prev += price
    }, 0)

    calculating.value = false
  } catch(e) {
    console.log(e)
  }
}

onMounted(() => {
  recordId = useRecordId()
  relatedAppId = useRelatedAppId('orderTable')
  calcTotalOrderPrice()
})
</script>

<template>
  <div>
    <h1>訂單總金額：{{ calculating ? '計算中...' : totalOrderPrice }}</h1>
  </div>
</template>
