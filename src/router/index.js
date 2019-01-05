import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'index',
    component: r =>
      require.ensure([], () => r(require('../components/ApolloExample.vue')))
  },
  {
    path: '/test',
    name: 'test',
    component: r =>
      require.ensure([], () => r(require('../components/testchange.vue')))
  },
  {
    path: '/sub',
    name: 'sub',
    component: r =>
      require.ensure([], () => r(require('../components/sub.vue')))
  }
]

const router = new Router({
  mode: 'history',
  routes // （缩写）相当于 routes: routes
})

export default router
