<script setup lang="ts">
import { useOrderRecordStore } from './store/record'

const { getCurrentOrderAndStockRecors, checkStock, updateStock } = useOrderRecordStore()

kintone.events.on('app.record.detail.process.proceed', async (event: KintoneEvent.Process<kintoneTypes.Order>) => {
  if (event.status.value !== '待出貨') return event

  const { productsAmount, stockAmount } = await getCurrentOrderAndStockRecors()
  console.log(productsAmount, stockAmount)
  // 確認庫存是否足夠
  const enoughStock = checkStock(productsAmount, stockAmount)

  if (enoughStock) {
    return false
  }

  updateStock()
  return event
})

</script>

<template>
  <div></div>
</template>

<style scoped></style>
