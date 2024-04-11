/// <reference types="vite/client" />
declare namespace kintoneTypes {
  interface BaseType {
    $id?: kintone.fieldTypes.Id;
    $revision?: kintone.fieldTypes.Revision;
    更新人?: kintone.fieldTypes.Modifier;
    建立人?: kintone.fieldTypes.Creator;
    更新時間?: kintone.fieldTypes.UpdatedTime;
    建立時間?: kintone.fieldTypes.CreatedTime;
    key?: kintone.fieldTypes.RecordNumber;
    [key: string]: any;
  }

  interface Event<T extends BaseType> {
    appId: number;
    recordId: number;
    type: string;
    record: T;
  }

  interface Customer extends BaseType {
    // orderTable?: kintone.fieldTypes
  }

  interface Order extends BaseType {
    companyName?: kintone.fieldTypes.SingleLineText; // 公司名稱
    shipping?: kintone.fieldTypes.DropDown; // 出貨狀態
    productName?: kintone.fieldTypes.SingleLineText; // 商品名稱
    productPrice?: kintone.fieldTypes.Number; // 商品價格
    productAmount?: kintone.fieldTypes.Number; // 商品數量
    totalPrice?: kintone.fieldTypes.Calc; // 訂單總金額
    table?: kintone.fieldTypes.SubTable
  }

  interface Stock extends BaseType {
    productName?: kintone.fieldTypes.SingleLineText; // 商品名稱
    productPrice?: kintone.fieldTypes.SingleLineText; // 商品價格
    productStock?: kintone.fieldTypes.SingleLineText; // 庫存數量
  }
}

declare namespace KintoneEvent {
  interface Edit<T> {
    appId: number;
    record: T;
    recordId: number;
    type: string;
  }

  interface Process<T = any> {
    action: {
      value: '開始送貨' | '完成'
    },
    nextStatus: {
      value: '處理中' | '已出貨'
    },
    record: T,
    status: {
      value: '待出貨' | '處理中'
    },
    type: string,
  }
}