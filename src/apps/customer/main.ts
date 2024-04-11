import { createApp } from 'vue';
import App from './App.vue';

kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], (event: kintoneTypes.Event<kintoneTypes.BaseType>) => {
  const myContainer = kintone.app.record.getSpaceElement('totalPrice')!
  const app = createApp(App)
  app.mount(myContainer)
  return event;
})
