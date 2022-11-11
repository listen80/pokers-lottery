import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '预热',
      component: () => import('admin/pages/preheat'),
    },
    {
      path: '/signin',
      name: '签到',
      component: () => import('admin/pages/signin'),
    },
    {
      path: '/lottery',
      name: '抽奖',
      component: () => import('admin/pages/lottery'),
    },
    {
      path: '/end',
      name: '结束',
      component: () => import('admin/pages/end'),
    },
  ],
})
