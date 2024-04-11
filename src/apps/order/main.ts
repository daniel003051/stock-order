import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()

kintone.events.on('app.record.detail.show', (event: any) => {
  const myContainer = kintone.app.record.getHeaderMenuSpaceElement() as HTMLElement
  const app = createApp(App)
  app.use(pinia)
  app.mount(myContainer)
  return event;
})
