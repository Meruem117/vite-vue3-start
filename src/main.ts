import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { store, key } from './store/store'
import './static/css/index.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'

const app = createApp(App)
app.use(router)
app.use(store, key)
app.use(Antd)
VMdPreview.use(githubTheme, {
    Hljs: hljs,
})
app.use(VMdPreview)
app.mount('#app')
