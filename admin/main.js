// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI, { MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

const port = location.protocol === 'https:' ? '' : ':8082'
const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
const path = process.env.NODE_ENV === 'development' ? '' : '/wss'

const socket = new WebSocket(`${protocol}://${location.hostname}${port}${path}`)

class Message {
  constructor () {
    this.callback = null
  }
  onmessage (callback) {
    this.callback = function (event) {
      const json = JSON.parse(event.data)
      callback(json)
    }
    socket.addEventListener('message', this.callback)
  }
  removemessage () {
    socket.removeEventListener('message', this.callback)
  }
}

function onmessage (callback) {
  socket.addEventListener('message', function (event) {
    // console.log('Message from server ', event.data)
    const json = JSON.parse(event.data)
    callback(json)
  })
}

function removemessage (callback) {
  socket.removeEventListener('message', callback)
}
function send (json) {
  socket.send(JSON.stringify(json))
}

function onClose () {
  MessageBox.alert('连接错误, 按确认重连或联系管理员', '提示').finally(() => {
    window.location.reload()
  })
}
// Connection opened
socket.addEventListener('open', function (event) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
  })
})

// Listen for messages
socket.addEventListener('error', function (event) {
  console.log('Message from server ', event)
  // onClose()
})

// Listen for messages
socket.addEventListener('close', function (event) {
  console.log('Message from server ', event)
  onClose()
})

Vue.prototype.$onmessage = onmessage
Vue.prototype.$send = send
Vue.prototype.$removemessage = removemessage
Vue.prototype.$Message = Message
