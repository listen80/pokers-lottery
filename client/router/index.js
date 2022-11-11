import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'preheat',
      component: () => import('client/pages/preheat'),
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: () => import('client/pages/signIn'),
    },
    {
      path: '/lottery',
      name: 'lottery',
      component: () => import('client/pages/lottery'),
    },
    {
      path: '/end',
      name: 'end',
      component: () => import('client/pages/end'),
    },
  ],
})
